import { supabase } from '@/integrations/supabase/client';
import { 
  LensBrand, 
  LensProduct, 
  LensBanner, 
  LensFilters, 
  LensProductWithDetails, 
  LensProductAttribute, 
  LensMediaItem, 
  MediaLibraryFilters, 
  MediaUploadResult,
  LensRecommendationGroup,
  CreateRecommendationGroupInput,
  UpdateRecommendationGroupInput,
  SupplierCatalog,
  CreateSupplierCatalogInput,
  UpdateSupplierCatalogInput
} from '../types/lens';

export const lensApi = {
  // Brands - Get unique brands from products' attributes
  async getBrands(): Promise<LensBrand[]> {
    const { data } = await supabase
      .from('lens_product_attributes')
      .select('options')
      .eq('slug', 'lens_brand')
      .single();
    
    if (!data || !data.options) return [];
    
    // Normalize options from old format (string[]) or new format (AttributeOption[])
    const options = Array.isArray(data.options) ? data.options : [];
    
    return options.map((opt: any, index: number) => {
      const brandValue = typeof opt === 'string' ? opt : opt.value;
      const brandLabel = typeof opt === 'string' ? opt : opt.label;
      
      return {
        id: brandValue,
        name: brandLabel || brandValue,
        logo_url: (typeof opt === 'object' && opt.image_url) ? opt.image_url : null,
        description: (typeof opt === 'object' && opt.short_description) ? opt.short_description : null,
        display_order: index,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
  },

  // Products
  async getProducts(filters?: Partial<LensFilters>, page = 1, perPage = 8): Promise<{ products: LensProductWithDetails[]; total: number }> {
    // Build query without pagination first
    let query = supabase
      .from('lens_products')
      .select(`
        *,
        supply_tiers:lens_supply_tiers(*),
        use_case_scores:lens_product_use_case_scores(*, use_case:lens_use_cases(*))
      `)
      .eq('is_active', true);

    // Apply SPH/CYL filters at SQL level if provided
    if (filters?.sph !== undefined && filters?.cyl !== undefined) {
      query = query
        .eq('supply_tiers.is_active', true)
        .gte('supply_tiers.sph_max', filters.sph)
        .lte('supply_tiers.sph_min', filters.sph)
        .gte('supply_tiers.cyl_max', filters.cyl)
        .lte('supply_tiers.cyl_min', filters.cyl);
    }

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

    // Detect if attribute filters are active
    const hasAttributeFilters = filters?.attributeFilters && 
      Object.keys(filters.attributeFilters).length > 0;

    // PRIMARY SORT: display_order if filters are active
    if (hasAttributeFilters) {
      query = query.order('display_order', { ascending: true });
    }

    // SECONDARY SORT: user's choice
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
        // Fallback if no filter: sort by created_at
        if (!hasAttributeFilters) {
          query = query.order('created_at', { ascending: false });
        }
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

    // Apply use cases filter
    if (filters?.useCases && filters.useCases.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const scores = (product as any).use_case_scores || [];
        return filters.useCases!.some(uc => 
          scores.some((s: any) => s.use_case?.code === uc && s.score >= 50)
        );
      });
    }

    // Apply tier type filter
    if (filters?.availableTiers && filters.availableTiers.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const tiers = (product as any).supply_tiers || [];
        return tiers.some((t: any) => 
          filters.availableTiers!.includes(t.tier_type) && t.is_active
        );
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
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    // Product not found, return null
    if (!data) {
      return null;
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
      options: (attr.options as any) || [],
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
        options: attribute.options as any
      })
      .select()
      .single();
    
    if (error) throw error;
    return { 
      ...data,
      type: data.type as 'select' | 'multiselect',
      options: (data.options as any) || []
    };
  },

  async updateAttribute(
    id: string,
    attribute: Partial<LensProductAttribute>
  ): Promise<LensProductAttribute> {
    const updateData: any = {
      ...attribute,
      updated_at: new Date().toISOString()
    };
    
    if (attribute.options) {
      updateData.options = attribute.options as any;
    }
    
    const { data, error } = await supabase
      .from('lens_product_attributes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { 
      ...data,
      type: data.type as 'select' | 'multiselect',
      options: (data.options as any) || []
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
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  },

  async createBanner(banner: Omit<LensBanner, 'id' | 'created_at' | 'updated_at'>): Promise<LensBanner> {
    const { data, error } = await supabase
      .from('lens_banners')
      .insert(banner)
      .select()
      .single();
    
    if (error) throw error;
    return data as LensBanner;
  },

  async updateBanner(id: string, banner: Partial<LensBanner>): Promise<LensBanner> {
    const { data, error } = await supabase
      .from('lens_banners')
      .update({ ...banner, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as LensBanner;
  },

  async deleteBanner(id: string): Promise<void> {
    const { error } = await supabase
      .from('lens_banners')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Helper: Generate unique filename preserving original name
  async generateUniqueFileName(
    originalName: string, 
    folder: 'products' | 'banners' | 'brands' | 'catalogs'
  ): Promise<string> {
    // Step 1: Sanitize filename
    const sanitized = originalName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (á → a)
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9.]/g, '-')     // Replace special chars with -
      .replace(/-+/g, '-')              // Collapse multiple - into one
      .replace(/^-|-$/g, '');           // Remove leading/trailing -

    // Step 2: Split name and extension
    const lastDotIndex = sanitized.lastIndexOf('.');
    const nameWithoutExt = sanitized.substring(0, lastDotIndex);
    const ext = sanitized.substring(lastDotIndex);

    // Step 3: Check if base name exists and find next available suffix
    let finalPath = `${folder}/${sanitized}`;
    let suffix = 0;

    while (true) {
      const fileName = finalPath.split('/')[1];
      
      const { data: existing } = await supabase.storage
        .from('lens-images')
        .list(folder, {
          search: fileName
        });

      // If no exact match found, use this name
      const exactMatch = existing?.find(f => f.name === fileName);
      if (!exactMatch) break;

      // If found, increment suffix and try again
      suffix++;
      finalPath = `${folder}/${nameWithoutExt}-${suffix}${ext}`;
    }

    return finalPath;
  },

  // Image upload
  async uploadImage(file: File, folder: 'products' | 'banners' | 'brands'): Promise<string> {
    // Generate unique filename preserving original name
    const fileName = await this.generateUniqueFileName(file.name, folder);

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

  // ============= MEDIA LIBRARY (Storage Only) =============

  async getMediaLibrary(filters?: MediaLibraryFilters): Promise<LensMediaItem[]> {
    try {
      // List files from all folders (products, banners, brands)
      const folders = ['products', 'banners', 'brands'];
      const allFiles: Array<{ file: any; folder: string; file_path: string }> = [];

      // Fetch files from each folder
      for (const folder of folders) {
        // Skip if filtering by specific folder and this isn't it
        if (filters?.folder && filters.folder !== folder) continue;

        try {
          const { data: files, error } = await supabase.storage
            .from('lens-images')
            .list(folder, {
              limit: 1000,
              sortBy: { column: 'created_at', order: 'desc' }
            });

          if (error) {
            console.warn(`Error listing folder ${folder}:`, error);
            continue; // Skip missing folder
          }

          if (!files || files.length === 0) {
            console.info(`Folder ${folder} is empty`);
            continue;
          }

          // Add files with folder info
          files.forEach(file => {
            // Ensure file has required properties
            if (file.id && file.name) {
              allFiles.push({
                file,
                folder,
                file_path: `${folder}/${file.name}`
              });
            }
          });
        } catch (err) {
          console.warn(`Unexpected error listing ${folder}:`, err);
          continue; // Skip folder with errors
        }
      }

    // Filter by search term (client-side)
    let filteredFiles = allFiles;
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredFiles = filteredFiles.filter(item => 
        item.file.name.toLowerCase().includes(searchLower)
      );
    }

      // Convert to LensMediaItem format
      const mediaItems: LensMediaItem[] = filteredFiles.map(item => ({
        id: item.file.id || crypto.randomUUID(),
        file_name: item.file.name,
        file_path: item.file_path,
        file_size: item.file.metadata?.size || 0,
        mime_type: item.file.metadata?.mimetype || 'image/jpeg',
        width: null,
        height: null,
        folder: item.folder,
        tags: [],
        alt_text: null,
        caption: null,
        used_in_products: [],
        usage_count: 0,
        is_active: true,
        uploaded_by: null,
        created_at: item.file.created_at || new Date().toISOString(),
        updated_at: item.file.updated_at || new Date().toISOString(),
      }));

      return mediaItems;
    } catch (error) {
      console.error('Unexpected error in getMediaLibrary:', error);
      throw error;
    }
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

  async deleteMediaFromLibrary(filePath: string): Promise<void> {
    // Delete directly from Storage (no DB check needed)
    const { error } = await supabase.storage
      .from('lens-images')
      .remove([filePath]);

    if (error) throw error;
  },

  async getMediaFolders(): Promise<string[]> {
    // Hardcoded folders to avoid issues with Storage API returning folders with id = null
    return ['products', 'banners', 'brands'];
  },

  // ============= RECOMMENDATION GROUPS =============
  
  // Get all recommendation groups with product count
  async getRecommendationGroups(): Promise<LensRecommendationGroup[]> {
    const { data: groups, error } = await supabase
      .from('lens_recommendation_groups')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;

    // Get product counts for each group
    const groupsWithCounts = await Promise.all(
      (groups || []).map(async (group) => {
        const { count } = await supabase
          .from('lens_recommendation_products')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);
        
        return {
          ...group,
          product_count: count || 0
        };
      })
    );

    return groupsWithCounts;
  },

  // Get products by recommendation group
  async getProductsByRecommendation(groupId: string): Promise<{
    products: LensProductWithDetails[];
    total: number;
  }> {
    const { data: recommendationProducts, error } = await supabase
      .from('lens_recommendation_products')
      .select(`
        product_id,
        display_order,
        product:lens_products(
          *,
          supply_tiers:lens_supply_tiers(*),
          use_case_scores:lens_product_use_case_scores(*, use_case:lens_use_cases(*))
        )
      `)
      .eq('group_id', groupId)
      .order('display_order');
    
    if (error) throw error;
    
    const products = (recommendationProducts || [])
      .map(rp => rp.product as any)
      .filter(p => p && p.is_active);
    
    return {
      products: products as LensProductWithDetails[],
      total: products.length
    };
  },

  // Admin: Create recommendation group
  async createRecommendationGroup(data: CreateRecommendationGroupInput): Promise<LensRecommendationGroup> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: group, error } = await supabase
      .from('lens_recommendation_groups')
      .insert({
        ...data,
        created_by: user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return group;
  },

  // Admin: Update recommendation group
  async updateRecommendationGroup(id: string, data: UpdateRecommendationGroupInput): Promise<LensRecommendationGroup> {
    const { data: group, error } = await supabase
      .from('lens_recommendation_groups')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return group;
  },

  // Admin: Delete recommendation group
  async deleteRecommendationGroup(id: string): Promise<void> {
    const { error } = await supabase
      .from('lens_recommendation_groups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Admin: Add product to recommendation group
  async addProductToGroup(groupId: string, productId: string, displayOrder?: number): Promise<void> {
    const { error } = await supabase
      .from('lens_recommendation_products')
      .insert({
        group_id: groupId,
        product_id: productId,
        display_order: displayOrder ?? 0
      });
    
    if (error) {
      // Handle duplicate error gracefully
      if (error.code === '23505') {
        throw new Error('Sản phẩm đã có trong nhóm này');
      }
      throw error;
    }
  },

  // Admin: Remove product from recommendation group
  async removeProductFromGroup(groupId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('lens_recommendation_products')
      .delete()
      .eq('group_id', groupId)
      .eq('product_id', productId);
    
    if (error) throw error;
  },

  // Admin: Reorder products in a group
  async reorderGroupProducts(groupId: string, productOrders: { productId: string; order: number }[]): Promise<void> {
    const updates = productOrders.map(({ productId, order }) =>
      supabase
        .from('lens_recommendation_products')
        .update({ display_order: order })
        .eq('group_id', groupId)
        .eq('product_id', productId)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(r => r.error);
    
    if (errors.length > 0) {
      throw errors[0].error;
    }
  },

  // Admin: Get products in a specific group (with full product details)
  async getGroupProducts(groupId: string): Promise<Array<LensProductWithDetails & { display_order: number; notes: string | null }>> {
    const { data, error } = await supabase
      .from('lens_recommendation_products')
      .select(`
        display_order,
        notes,
        product:lens_products(
          *,
          supply_tiers:lens_supply_tiers(*),
          use_case_scores:lens_product_use_case_scores(*, use_case:lens_use_cases(*))
        )
      `)
      .eq('group_id', groupId)
      .order('display_order');
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...(item.product as any),
      display_order: item.display_order,
      notes: item.notes
    }));
  },

  // ============= SUPPLIER CATALOGS =============

  // Get all active supplier catalogs
  async getSupplierCatalogs(): Promise<SupplierCatalog[]> {
    const { data, error } = await supabase
      .from('supplier_catalogs')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  },

  // Create new supplier catalog
  async createSupplierCatalog(input: CreateSupplierCatalogInput): Promise<SupplierCatalog> {
    const { data, error } = await supabase
      .from('supplier_catalogs')
      .insert(input)
      .select()
      .single();
    
    if (error) throw error;
    return data as SupplierCatalog;
  },

  // Update supplier catalog
  async updateSupplierCatalog(id: string, input: UpdateSupplierCatalogInput): Promise<SupplierCatalog> {
    const { data, error } = await supabase
      .from('supplier_catalogs')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SupplierCatalog;
  },

  // Delete supplier catalog
  async deleteSupplierCatalog(id: string): Promise<void> {
    const { error } = await supabase
      .from('supplier_catalogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Upload PDF to storage
  async uploadCatalogPDF(file: File): Promise<string> {
    const fileName = await this.generateUniqueFileName(file.name, 'catalogs');
    
    const { error: uploadError } = await supabase.storage
      .from('lens-images')
      .upload(fileName, file, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      });
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('lens-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },

  // ============= DISPLAY ORDER MANAGEMENT =============
  
  // Update single product display order
  async updateProductDisplayOrder(productId: string, displayOrder: number): Promise<void> {
    const { error } = await supabase
      .from('lens_products')
      .update({ display_order: displayOrder, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (error) throw error;
  },

  // Batch update product display orders
  async batchUpdateDisplayOrder(updates: Array<{ id: string; display_order: number }>): Promise<void> {
    const { error } = await supabase.rpc('batch_update_product_display_order', {
      updates: updates
    });

    if (error) throw error;
  },
};
