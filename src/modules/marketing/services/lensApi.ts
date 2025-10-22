import { supabase } from '@/integrations/supabase/client';
import { LensBrand, LensProduct, LensBanner, LensFilters, LensProductWithDetails, LensProductAttribute } from '../types/lens';

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

  // Products
  async getProducts(filters?: Partial<LensFilters>, page = 1, perPage = 8): Promise<{ products: LensProductWithDetails[]; total: number }> {
    let query = supabase
      .from('lens_products')
      .select(`
        *,
        brand:lens_brands(*)
      `, { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (filters?.brandIds && filters.brandIds.length > 0) {
      query = query.in('brand_id', filters.brandIds);
    }

    if (filters?.featureIds && filters.featureIds.length > 0) {
      // NOTE: Filter logic simplified - multiselect attributes are now in slug_values format
      // Client-side filtering is performed in the UI components instead
      // This allows more flexible dynamic filtering based on user-defined attributes
      
      // For now, we skip backend filtering for features to maintain simplicity
      // Products will be filtered on the frontend based on multiselect attribute values
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

    // Cast image_urls and attributes
    const products = (data || []).map(product => ({
      ...product,
      image_urls: Array.isArray(product.image_urls) ? product.image_urls as string[] : [],
      attributes: product.attributes || {}
    })) as LensProductWithDetails[];

    return { products, total: count || 0 };
  },

  async getProductById(id: string): Promise<LensProductWithDetails | null> {
    const { data, error } = await supabase
      .from('lens_products')
      .select(`
        *,
        brand:lens_brands(*)
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
      image_urls: Array.isArray(data.image_urls) ? data.image_urls as string[] : [],
      attributes: data.attributes || {}
    } as LensProductWithDetails;
  },

  async createProduct(product: Omit<LensProduct, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<LensProduct> {
    const { data, error } = await supabase
      .from('lens_products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      image_urls: Array.isArray(data.image_urls) ? data.image_urls as string[] : [],
      attributes: data.attributes || {}
    } as LensProduct;
  },

  async updateProduct(id: string, product: Partial<LensProduct>): Promise<LensProduct> {
    const { data, error } = await supabase
      .from('lens_products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      image_urls: Array.isArray(data.image_urls) ? data.image_urls as string[] : [],
      attributes: data.attributes || {}
    } as LensProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('lens_products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Attributes
  async getAttributes(): Promise<LensProductAttribute[]> {
    const { data, error } = await supabase
      .from('lens_product_attributes')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    
    return (data || []).map(attr => ({
      ...attr,
      type: attr.type as 'select' | 'multiselect',
      options: typeof attr.options === 'string' 
        ? JSON.parse(attr.options) 
        : (Array.isArray(attr.options) ? attr.options : []),
      icon: attr.icon || null
    }));
  },

  async createAttribute(
    attribute: Omit<LensProductAttribute, 'id' | 'created_at' | 'updated_at'>
  ): Promise<LensProductAttribute> {
    const { data, error } = await supabase
      .from('lens_product_attributes')
      .insert({
        ...attribute,
        options: JSON.stringify(attribute.options)
      })
      .select()
      .single();
    
    if (error) throw error;
    return { 
      ...data,
      type: data.type as 'select' | 'multiselect',
      options: typeof data.options === 'string' ? JSON.parse(data.options) : data.options 
    };
  },

  async updateAttribute(
    id: string,
    attribute: Partial<LensProductAttribute>
  ): Promise<LensProductAttribute> {
    const { data, error } = await supabase
      .from('lens_product_attributes')
      .update({
        ...attribute,
        options: attribute.options ? JSON.stringify(attribute.options) : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { 
      ...data,
      type: data.type as 'select' | 'multiselect',
      options: typeof data.options === 'string' ? JSON.parse(data.options) : data.options 
    };
  },

  async deleteAttribute(id: string): Promise<void> {
    const { error } = await supabase
      .from('lens_product_attributes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
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
  },

  // Upload multiple images
  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, 'products'));
    return Promise.all(uploadPromises);
  },

  // Delete image from storage
  async deleteImage(imageUrl: string): Promise<void> {
    const urlParts = imageUrl.split('/storage/v1/object/public/lens-images/');
    const filePath = urlParts[1];
    
    if (!filePath) throw new Error('Invalid image URL');
    
    const { error } = await supabase.storage
      .from('lens-images')
      .remove([filePath]);
    
    if (error) throw error;
  },

  // Upsert products (for Excel import)
  async upsertProducts(products: any[]): Promise<{
    inserted: number;
    updated: number;
    errors: string[];
  }> {
    const results = { inserted: 0, updated: 0, errors: [] as string[] };
    
    try {
      const { data, error } = await supabase
        .from('lens_products')
        .upsert(products, {
          onConflict: 'sku',
          ignoreDuplicates: false
        })
        .select();
      
      if (error) throw error;
      
      data?.forEach(p => {
        if (p.created_at === p.updated_at) {
          results.inserted++;
        } else {
          results.updated++;
        }
      });
      
    } catch (err: any) {
      results.errors.push(err.message);
    }
    
    return results;
  }
};
