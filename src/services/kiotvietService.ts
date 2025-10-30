import { supabase } from '@/integrations/supabase/client';
import type { 
  KiotVietProduct, 
  KiotVietCategory, 
  KiotVietInventory,
  KiotVietProductDB,
  KiotVietCategoryDB,
  KiotVietInventoryDB,
  KiotVietSyncLog
} from '@/lib/types/kiotviet.types';

export class KiotVietService {
  // ============= CREDENTIALS =============
  
  /**
   * Save KiotViet credentials (encrypts token server-side)
   */
  static async saveCredentials(data: {
    retailerName: string;
    clientId: string;
    clientSecret: string;
  }) {
    const { data: result, error } = await supabase.functions.invoke('save-kiotviet-token', {
      body: data
    });

    if (error) throw new Error(error.message || 'Failed to save credentials');
    if (!result.success) throw new Error(result.error || 'Failed to save credentials');
    
    return result;
  }

  /**
   * Get active credential (returns only metadata, no token)
   */
  static async getActiveCredential() {
    const { data, error } = await supabase
      .from('kiotviet_credentials')
      .select('id, retailer_name, client_id, is_active, created_at, updated_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Check if credentials exist
   */
  static async hasCredentials(): Promise<boolean> {
    const credential = await this.getActiveCredential();
    return !!credential;
  }

  // ============= SYNC =============
  
  /**
   * Sync data from KiotViet API to Supabase
   */
  static async syncData(
    syncType: 'categories' | 'products' | 'inventory' | 'all' | 'products_full',
    options?: {
      pageSize?: number;
      dateFrom?: string;
    }
  ) {
    const credential = await this.getActiveCredential();
    if (!credential) {
      throw new Error('No active KiotViet credentials found. Please configure in Settings.');
    }

    const { data, error } = await supabase.functions.invoke('kiotviet-sync', {
      body: {
        credentialId: credential.id,
        syncType,
        options: options || { pageSize: 100 }
      }
    });

    if (error) throw new Error(error.message || 'Sync failed');
    if (!data.success) throw new Error(data.error || 'Sync failed');
    
    return data.results;
  }

  // ============= CATEGORIES =============
  
  /**
   * Get all categories from local database
   */
  static async getCategories(): Promise<KiotVietCategoryDB[]> {
    const { data, error } = await supabase
      .from('kiotviet_categories')
      .select('*')
      .order('category_name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Build category tree structure
   */
  static async getCategoryTree(): Promise<any[]> {
    const categories = await this.getCategories();
    
    console.log('📊 Total categories fetched:', categories.length);
    console.log('📊 Sample category:', categories[0]);
    
    // Build tree structure
    const categoryMap = new Map();
    categories.forEach(cat => categoryMap.set(cat.id, { ...cat, children: [] }));

    const tree: any[] = [];
    categories.forEach(cat => {
      const node = categoryMap.get(cat.id);
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children.push(node);
        } else {
          console.warn('⚠️ Orphaned category:', cat.category_name, 'parent_id:', cat.parent_id);
        }
      } else {
        tree.push(node);
      }
    });

    console.log('🌳 Tree built:', tree.length, 'root categories');
    console.log('🌳 Tree structure:', tree);

    return tree;
  }

  // ============= PRODUCTS =============
  
  /**
   * Get products with filters and pagination
   */
  static async getProducts(filters?: {
    categoryId?: number;
    search?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ products: KiotVietProductDB[]; total: number }> {
    let query = supabase
      .from('kiotviet_products')
      .select('*, category:kiotviet_categories(category_name)', { count: 'exact' });

    // Apply filters
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,barcode.ilike.%${filters.search}%`);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    // Pagination
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 50;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      products: data || [],
      total: count || 0
    };
  }

  /**
   * Get single product by ID with inventory
   */
  static async getProductById(id: number): Promise<KiotVietProductDB | null> {
    const { data, error } = await supabase
      .from('kiotviet_products')
      .select('*, category:kiotviet_categories(category_name), inventory:kiotviet_inventory(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get product statistics
   */
  static async getProductStats() {
    const { count: totalProducts } = await supabase
      .from('kiotviet_products')
      .select('*', { count: 'exact', head: true });

    const { count: activeProducts } = await supabase
      .from('kiotviet_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: totalCategories } = await supabase
      .from('kiotviet_categories')
      .select('*', { count: 'exact', head: true });

    return {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      inactiveProducts: (totalProducts || 0) - (activeProducts || 0),
      totalCategories: totalCategories || 0
    };
  }

  // ============= INVENTORY =============
  
  /**
   * Get inventory for a specific product
   */
  static async getInventory(productId: number): Promise<KiotVietInventoryDB[]> {
    const { data, error } = await supabase
      .from('kiotviet_inventory')
      .select('*')
      .eq('product_id', productId);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get total inventory value (all products)
   */
  static async getTotalInventoryValue(): Promise<number> {
    const { data, error } = await supabase
      .from('kiotviet_products')
      .select('base_price, inventory:kiotviet_inventory(on_hand)');

    if (error) throw error;

    let totalValue = 0;
    data?.forEach((product: any) => {
      const totalStock = product.inventory?.reduce((sum: number, inv: any) => sum + (inv.on_hand || 0), 0) || 0;
      totalValue += (product.base_price || 0) * totalStock;
    });

    return totalValue;
  }

  // ============= SYNC LOGS =============
  
  /**
   * Get recent sync logs
   */
  static async getSyncLogs(limit = 10): Promise<KiotVietSyncLog[]> {
    const { data, error } = await supabase
      .from('kiotviet_sync_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Map database fields to KiotVietSyncLog interface
    return (data || []).map(log => ({
      id: log.id,
      syncType: log.sync_type,
      status: log.status as 'success' | 'partial' | 'failed',
      recordsSynced: log.records_synced,
      errorMessage: log.error_message,
      startedAt: new Date(log.started_at),
      completedAt: log.completed_at ? new Date(log.completed_at) : undefined
    }));
  }

  /**
   * Get last sync time for a specific type
   */
  static async getLastSyncTime(syncType: string): Promise<Date | null> {
    const { data, error } = await supabase
      .from('kiotviet_sync_logs')
      .select('completed_at')
      .eq('sync_type', syncType)
      .eq('status', 'success')
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data?.completed_at ? new Date(data.completed_at) : null;
  }
}
