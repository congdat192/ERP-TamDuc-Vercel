import { supabase } from '@/integrations/supabase/client';
import { LensBrand, LensProduct, LensBanner, LensFilters, LensProductWithDetails, LensProductAttribute, LensMediaItem, MediaLibraryFilters, MediaUploadResult } from '../types/lens';

export const lensApi = {
  // Brands - Get unique brands from products' attributes
  async getBrands(): Promise<LensBrand[]> {
    const { data } = await supabase
      .from('lens_products')
      .select('attributes')
      .eq('is_active', true);
    
    const brandNames = new Set<string>();
    (data || []).forEach(p => {
      const attrs = p.attributes as Record<string, string[]> | null;
      const brand = attrs?.lens_brand?.[0];
      if (brand) brandNames.add(brand);
    });
    
    return Array.from(brandNames).map((name, index) => ({
      id: name,
      name,
      logo_url: null,
      description: null,
      display_order: index,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  },

  // Products
  async getProducts(filters?: Partial<LensFilters>, page = 1, perPage = 8): Promise<{ products: LensProductWithDetails[]; total: number }> {
    // Build query without pagination first
    let query = supabase
      .from('lens_products')
      .select('*')
      .eq('is_active', true);

    // Apply price filters (can be done in SQL)
    if (filters?.minPrice !== null && filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== null && filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    // Apply search filter (can be done in SQL)
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply sorting (can be done in SQL)
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
        break;
    }

    // Fetch ALL matching products (no pagination yet)
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    // Apply attribute filters in JavaScript (more reliable for JSONB)
    let filteredProducts = data || [];

    if (filters?.attributeFilters && Object.keys(filters.attributeFilters).length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const attrs = product.attributes as Record<string, string[]> | null;
        if (!attrs) return false;
        
        // ALL attribute filters must match (AND logic between different attributes)
        return Object.entries(filters.attributeFilters).every(([slug, filterValues]) => {
          const productValues = attrs[slug] || [];
          // ANY filter value must exist in product values (OR logic within same attribute)
          return filterValues.some(fv => productValues.includes(fv));
        });
      });
    }

    // Apply pagination AFTER filtering
    const total = filteredProducts.length;
    const from = (page - 1) * perPage;
    const to = from + perPage;
    const paginatedProducts = filteredProducts.slice(from, to);

    return {
      products: paginatedProducts as LensProductWithDetails[],
      total,
    };
  },

  async getProductById(id: string): Promise<LensProductWithDetails | null> {
    const { data, error } = await supabase
      .from('lens_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    // Increment view count
    await supabase
      .from('lens_products')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return data as LensProductWithDetails;
  },

  async getRelatedProducts(productIds: string[]): Promise<LensProductWithDetails[]> {
    if (productIds.length === 0) return [];

    const { data, error } = await supabase
      .from('lens_products')
      .select('*')
      .in('id', productIds)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }

    return (data || []) as LensProductWithDetails[];
  },

  async createProduct(product: Omit<LensProduct, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<LensProduct> {
    const { data, error } = await supabase
      .from('lens_products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data as LensProduct;
  },

  async updateProduct(id: string, product: Partial<LensProduct>): Promise<LensProduct> {
    const { data, error } = await supabase
      .from('lens_products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as LensProduct;
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
  },

  // ============= MEDIA LIBRARY =============

  async getMediaLibrary(filters?: MediaLibraryFilters): Promise<LensMediaItem[]> {
    let query = supabase
      .from('lens_media_library')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters?.folder) {
      query = query.eq('folder', filters.folder);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters?.search) {
      query = query.or(`file_name.ilike.%${filters.search}%,alt_text.ilike.%${filters.search}%,caption.ilike.%${filters.search}%`);
    }

    if (filters?.unused) {
      query = query.eq('usage_count', 0);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as LensMediaItem[];
  },

  async uploadToMediaLibrary(
    file: File,
    metadata: {
      folder?: string;
      tags?: string[];
      alt_text?: string;
      caption?: string;
    } = {}
  ): Promise<MediaUploadResult> {
    // 1. Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${metadata.folder || 'uncategorized'}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('lens-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('lens-images')
      .getPublicUrl(fileName);

    // 3. Get image dimensions
    const dimensions = await this.getImageDimensions(file);

    // 4. Save metadata to database
    const { data: media, error: dbError } = await supabase
      .from('lens_media_library')
      .insert({
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type,
        width: dimensions.width,
        height: dimensions.height,
        folder: metadata.folder || 'uncategorized',
        tags: metadata.tags || [],
        alt_text: metadata.alt_text || null,
        caption: metadata.caption || null,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return { media: media as LensMediaItem, url: publicUrl };
  },

  async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  },

  async updateMediaMetadata(
    id: string,
    updates: Partial<Pick<LensMediaItem, 'tags' | 'alt_text' | 'caption' | 'folder'>>
  ): Promise<LensMediaItem> {
    const { data, error } = await supabase
      .from('lens_media_library')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as LensMediaItem;
  },

  async deleteMediaFromLibrary(id: string): Promise<void> {
    const { data: media } = await supabase
      .from('lens_media_library')
      .select('used_in_products, file_path')
      .eq('id', id)
      .single();

    if (media && media.used_in_products.length > 0) {
      throw new Error('Không thể xóa ảnh đang được sử dụng trong sản phẩm');
    }

    const { error: dbError } = await supabase
      .from('lens_media_library')
      .update({ is_active: false })
      .eq('id', id);

    if (dbError) throw dbError;

    if (media) {
      const { error: storageError } = await supabase.storage
        .from('lens-images')
        .remove([media.file_path]);

      if (storageError) console.error('Storage delete error:', storageError);
    }
  },

  async getUnusedMedia(olderThanDays: number = 30): Promise<LensMediaItem[]> {
    const { data, error } = await supabase.rpc('get_unused_media', {
      older_than_days: olderThanDays,
    });

    if (error) throw error;
    return data as LensMediaItem[];
  },

  async getMediaFolders(): Promise<string[]> {
    const { data, error } = await supabase
      .from('lens_media_library')
      .select('folder')
      .eq('is_active', true);

    if (error) throw error;
    
    const uniqueFolders = [...new Set(data.map(item => item.folder))];
    return uniqueFolders.sort();
  },

  async getMediaTags(): Promise<string[]> {
    const { data, error } = await supabase
      .from('lens_media_library')
      .select('tags')
      .eq('is_active', true);

    if (error) throw error;
    
    const allTags = data.flatMap(item => item.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  },
};
