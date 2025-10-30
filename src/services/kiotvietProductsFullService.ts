import { supabase } from '@/integrations/supabase/client';
import type { KiotVietProductFullDB, InventoryByBranch } from '@/lib/types/kiotviet.types';

// Helper to parse JSONB fields
function parseProduct(rawProduct: any): KiotVietProductFullDB {
  return {
    ...rawProduct,
    inventory_by_branch: typeof rawProduct.inventory_by_branch === 'string' 
      ? JSON.parse(rawProduct.inventory_by_branch) 
      : (rawProduct.inventory_by_branch || []),
    images: typeof rawProduct.images === 'string' 
      ? JSON.parse(rawProduct.images) 
      : (rawProduct.images || []),
    attributes: typeof rawProduct.attributes === 'string' 
      ? JSON.parse(rawProduct.attributes) 
      : (rawProduct.attributes || []),
    units: typeof rawProduct.units === 'string' 
      ? JSON.parse(rawProduct.units) 
      : (rawProduct.units || []),
    price_books: typeof rawProduct.price_books === 'string' 
      ? JSON.parse(rawProduct.price_books) 
      : (rawProduct.price_books || []),
    product_formulas: typeof rawProduct.product_formulas === 'string' 
      ? JSON.parse(rawProduct.product_formulas) 
      : (rawProduct.product_formulas || []),
    product_serials: typeof rawProduct.product_serials === 'string' 
      ? JSON.parse(rawProduct.product_serials) 
      : (rawProduct.product_serials || []),
    product_batch_expires: typeof rawProduct.product_batch_expires === 'string' 
      ? JSON.parse(rawProduct.product_batch_expires) 
      : (rawProduct.product_batch_expires || []),
    product_shelves: typeof rawProduct.product_shelves === 'string' 
      ? JSON.parse(rawProduct.product_shelves) 
      : (rawProduct.product_shelves || []),
  };
}

export class KiotVietProductsFullService {
  /**
   * Get products from kiotviet_products_full table with filters
   */
  static async getProducts(filters?: {
    categoryId?: number;
    categoryIds?: number[];
    trademarkId?: number;
    trademarkIds?: number[];
    search?: string;
    isActive?: boolean;
    lowStock?: boolean;
    overstock?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ products: KiotVietProductFullDB[]; total: number }> {
    let query = supabase
      .from('kiotviet_products_full')
      .select('*', { count: 'exact' });

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.categoryIds && filters.categoryIds.length > 0) {
      query = query.in('category_id', filters.categoryIds);
    }

    if (filters?.trademarkId) {
      query = query.eq('trademark_id', filters.trademarkId);
    }

    if (filters?.trademarkIds && filters.trademarkIds.length > 0) {
      query = query.in('trademark_id', filters.trademarkIds);
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,barcode.ilike.%${filters.search}%`
      );
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters?.lowStock) {
      query = query.eq('low_stock_alert', true);
    }

    if (filters?.overstock) {
      query = query.eq('overstock_alert', true);
    }

    // Pagination
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 50;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to).order('name', { ascending: true });

    const { data, error, count } = await query;

    if (error) throw error;

    return { 
      products: (data || []).map(parseProduct), 
      total: count || 0 
    };
  }

  /**
   * Get single product by ID
   */
  static async getProductById(id: number): Promise<KiotVietProductFullDB | null> {
    const { data, error } = await supabase
      .from('kiotviet_products_full')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? parseProduct(data) : null;
  }

  /**
   * Get single product by code
   */
  static async getProductByCode(code: string): Promise<KiotVietProductFullDB | null> {
    const { data, error } = await supabase
      .from('kiotviet_products_full')
      .select('*')
      .eq('code', code)
      .single();

    if (error) throw error;
    return data ? parseProduct(data) : null;
  }

  /**
   * Get product statistics
   */
  static async getProductStats() {
    const { count: totalProducts, error: totalError } = await supabase
      .from('kiotviet_products_full')
      .select('*', { count: 'exact', head: true });

    const { count: activeProducts, error: activeError } = await supabase
      .from('kiotviet_products_full')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: lowStockProducts, error: lowStockError } = await supabase
      .from('kiotviet_products_full')
      .select('*', { count: 'exact', head: true })
      .eq('low_stock_alert', true);

    const { count: overstockProducts, error: overstockError } = await supabase
      .from('kiotviet_products_full')
      .select('*', { count: 'exact', head: true })
      .eq('overstock_alert', true);

    if (totalError || activeError || lowStockError || overstockError) {
      throw totalError || activeError || lowStockError || overstockError;
    }

    return {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      inactiveProducts: (totalProducts || 0) - (activeProducts || 0),
      lowStockProducts: lowStockProducts || 0,
      overstockProducts: overstockProducts || 0,
    };
  }

  /**
   * Get all unique categories from products
   */
  static async getCategories(): Promise<Array<{ id: number; name: string; path: string }>> {
    const { data, error } = await supabase
      .from('kiotviet_products_full')
      .select('category_id, category_name, category_path')
      .not('category_id', 'is', null)
      .order('category_name');

    if (error) throw error;

    // Deduplicate categories
    const uniqueCategories = new Map<number, { id: number; name: string; path: string }>();
    
    data?.forEach((item) => {
      if (item.category_id && !uniqueCategories.has(item.category_id)) {
        uniqueCategories.set(item.category_id, {
          id: item.category_id,
          name: item.category_name || '',
          path: item.category_path || '',
        });
      }
    });

    return Array.from(uniqueCategories.values());
  }

  /**
   * Get all unique trademarks from products
   */
  static async getTrademarks(): Promise<Array<{ id: number; name: string }>> {
    const { data, error } = await supabase
      .from('kiotviet_products_full')
      .select('trademark_id, trademark_name')
      .not('trademark_id', 'is', null)
      .order('trademark_name');

    if (error) throw error;

    // Deduplicate trademarks
    const uniqueTrademarks = new Map<number, { id: number; name: string }>();
    
    data?.forEach((item) => {
      if (item.trademark_id && !uniqueTrademarks.has(item.trademark_id)) {
        uniqueTrademarks.set(item.trademark_id, {
          id: item.trademark_id,
          name: item.trademark_name || '',
        });
      }
    });

    return Array.from(uniqueTrademarks.values());
  }

  /**
   * Get inventory summary across all branches
   */
  static async getTotalInventoryValue(): Promise<number> {
    const { data, error } = await supabase
      .from('kiotviet_products_full')
      .select('total_on_hand, base_price');

    if (error) throw error;

    const totalValue = data?.reduce(
      (sum, product) => sum + (product.total_on_hand || 0) * (product.base_price || 0),
      0
    );

    return totalValue || 0;
  }
}
