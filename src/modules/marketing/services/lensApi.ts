import { supabase } from '@/integrations/supabase/client';
import { LensBrand, LensFeature, LensProduct, LensBanner, LensFilters, LensProductWithDetails } from '../types/lens';

export const lensApi = {
  // Brands
  async getBrands(): Promise<LensBrand[]> {
    const { data, error } = await supabase
      .from('lens_brands')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  },

  // Features
  async getFeatures(): Promise<LensFeature[]> {
    const { data, error } = await supabase
      .from('lens_features')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  },

  // Products
  async getProducts(filters?: Partial<LensFilters>, page = 1, perPage = 8): Promise<{ products: LensProductWithDetails[]; total: number }> {
    let query = supabase
      .from('lens_products')
      .select(`
        *,
        brand:lens_brands(*),
        features:lens_product_features(
          feature:lens_features(*)
        )
      `, { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (filters?.brandIds && filters.brandIds.length > 0) {
      query = query.in('brand_id', filters.brandIds);
    }

    if (filters?.featureIds && filters.featureIds.length > 0) {
      const { data: productIds } = await supabase
        .from('lens_product_features')
        .select('product_id')
        .in('feature_id', filters.featureIds);
      
      if (productIds) {
        const ids = productIds.map(p => p.product_id);
        query = query.in('id', ids);
      }
    }

    if (filters?.material) {
      query = query.eq('material', filters.material);
    }

    if (filters?.refractiveIndex) {
      query = query.eq('refractive_index', filters.refractiveIndex);
    }

    if (filters?.minPrice !== null && filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== null && filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.origin) {
      query = query.eq('origin', filters.origin);
    }

    if (filters?.hasWarranty) {
      query = query.not('warranty_months', 'is', null);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Sorting
    switch (filters?.sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('view_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform features array
    const products = (data || []).map(product => ({
      ...product,
      features: product.features?.map((f: any) => f.feature).filter(Boolean) || []
    }));

    return { products, total: count || 0 };
  },

  async getProductById(id: string): Promise<LensProductWithDetails | null> {
    const { data, error } = await supabase
      .from('lens_products')
      .select(`
        *,
        brand:lens_brands(*),
        features:lens_product_features(
          feature:lens_features(*)
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Increment view count
    await supabase
      .from('lens_products')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return {
      ...data,
      features: data.features?.map((f: any) => f.feature).filter(Boolean) || []
    };
  },

  async createProduct(product: Omit<LensProduct, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<LensProduct> {
    const { data, error } = await supabase
      .from('lens_products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, product: Partial<LensProduct>): Promise<LensProduct> {
    const { data, error } = await supabase
      .from('lens_products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('lens_products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async linkProductFeatures(productId: string, featureIds: string[]): Promise<void> {
    // Delete existing links
    await supabase
      .from('lens_product_features')
      .delete()
      .eq('product_id', productId);

    // Insert new links
    if (featureIds.length > 0) {
      const { error } = await supabase
        .from('lens_product_features')
        .insert(featureIds.map(featureId => ({ product_id: productId, feature_id: featureId })));

      if (error) throw error;
    }
  },

  // Banners
  async getBanners(): Promise<LensBanner[]> {
    const { data, error } = await supabase
      .from('lens_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  },

  // Image upload
  async uploadImage(file: File, folder: 'products' | 'banners' | 'brands'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('lens-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('lens-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }
};
