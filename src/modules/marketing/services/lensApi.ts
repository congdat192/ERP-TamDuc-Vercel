import { supabase } from '@/integrations/supabase/client';
import { LensProduct, LensBanner, LensFilters, LensProductWithDetails, LensProductAttribute } from '../types/lens';

export const lensApi = {
  // Products
  async getProducts(
    filters?: Partial<LensFilters>,
    page = 1,
    perPage = 8
  ): Promise<{ products: LensProductWithDetails[]; total: number }> {
    try {
      let query = supabase
        .from('lens_products')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Apply attribute filters using JSONB operators
      // Collect all OR conditions first, then apply .or() once
      if (filters?.attributeFilters) {
        const allOrConditions: string[] = [];
        
          Object.entries(filters.attributeFilters).forEach(([slug, values]) => {
          if (values.length > 0) {
            // Each value becomes an OR condition
            values.forEach(value => {
              // ✅ Support all formats for maximum compatibility:
              // Format 1 (correct): ["CHEMI"]
              allOrConditions.push(`attributes@>{"${slug}":["${value}"]}`);
              
              // Format 2 (scalar - legacy): "CHEMI"
              allOrConditions.push(`attributes@>{"${slug}":"${value}"}`);
              
              // Format 3 (double nested - legacy): [["CHEMI"]]
              allOrConditions.push(`attributes@>{"${slug}":[["${value}"]]}`);
            });
          }
        });
        
        // Apply all OR conditions at once
        if (allOrConditions.length > 0) {
          query = query.or(allOrConditions.join(','));
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

      // Cast and add empty brand object for compatibility
      const products = (data || []).map(product => ({
        ...product,
        image_urls: Array.isArray(product.image_urls) ? product.image_urls as string[] : [],
        attributes: product.attributes || {},
        related_product_ids: Array.isArray(product.related_product_ids) 
          ? product.related_product_ids as string[] 
          : [],
        brand: { 
          id: '', 
          name: '', 
          logo_url: null, 
          description: null, 
          display_order: 0, 
          is_active: true, 
          created_at: '', 
          updated_at: '' 
        }
      })) as LensProductWithDetails[];

      return { products, total: count || 0 };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<LensProductWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('lens_products')
        .select('*')
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
        attributes: data.attributes || {},
        related_product_ids: Array.isArray(data.related_product_ids) 
          ? data.related_product_ids as string[] 
          : [],
      } as LensProductWithDetails;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async getRelatedProducts(productIds: string[]): Promise<LensProductWithDetails[]> {
    try {
      if (!productIds || productIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('lens_products')
        .select('*')
        .in('id', productIds)
        .eq('is_active', true)
        .limit(4);
      
      if (error) throw error;
      
      return (data || []).map(product => ({
        ...product,
        image_urls: Array.isArray(product.image_urls) ? product.image_urls as string[] : [],
        attributes: product.attributes || {},
        related_product_ids: Array.isArray(product.related_product_ids) 
          ? product.related_product_ids as string[] 
          : [],
      })) as LensProductWithDetails[];
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
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
      attributes: data.attributes || {},
      related_product_ids: Array.isArray(data.related_product_ids) 
        ? data.related_product_ids as string[] 
        : []
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
      attributes: data.attributes || {},
      related_product_ids: Array.isArray(data.related_product_ids) 
        ? data.related_product_ids as string[] 
        : []
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
