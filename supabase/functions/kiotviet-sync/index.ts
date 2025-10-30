import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decrypt } from '../_shared/crypto.ts';

const KIOTVIET_BASE_URL = 'https://public.kiotapi.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KiotVietSyncRequest {
  credentialId: string;
  syncType: 'categories' | 'products' | 'inventory' | 'all' | 'products_full';
  options?: {
    pageSize?: number;
    dateFrom?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 KiotViet Sync started');
    
    // Parse request
    const { credentialId, syncType, options }: KiotVietSyncRequest = await req.json();
    console.log('📋 Sync type:', syncType);
    
    // Init Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get credentials
    const { data: credential, error: credError } = await supabaseClient
      .from('kiotviet_credentials')
      .select('*')
      .eq('id', credentialId)
      .single();

    if (credError || !credential) {
      throw new Error('Credentials not found');
    }

    console.log('🔐 Credentials loaded, decrypting token...');

    // Decrypt access token
    const accessToken = await decrypt(credential.encrypted_token);

    // Check token expiry
    if (credential.token_expires_at && new Date(credential.token_expires_at) < new Date()) {
      throw new Error('Token expired. Please update your access token in settings.');
    }

    // Sync based on type
    const results: any = {};
    const startTime = new Date().toISOString();

    try {
      if (syncType === 'categories' || syncType === 'all') {
        console.log('📁 Syncing categories...');
        results.categories = await syncCategories(accessToken, supabaseClient, credential.retailer_name);
        console.log(`✅ Categories synced: ${results.categories.count}`);
      }

      if (syncType === 'products' || syncType === 'all') {
        console.log('📦 Syncing products...');
        results.products = await syncProducts(accessToken, supabaseClient, options, credential.retailer_name);
        console.log(`✅ Products synced: ${results.products.count}`);
      }

      if (syncType === 'inventory' || syncType === 'all') {
        console.log('📊 Syncing inventory...');
        results.inventory = await syncInventory(accessToken, supabaseClient, credential.retailer_name);
        console.log(`✅ Inventory synced: ${results.inventory.count}`);
      }

      if (syncType === 'products_full') {
        console.log('🚀 Syncing products (FULL - single table)...');
        results.products_full = await syncProductsFull(accessToken, supabaseClient, options, credential.retailer_name);
        console.log(`✅ Products (full) synced: ${results.products_full.count}`);
      }

      // Log successful sync
      await supabaseClient.from('kiotviet_sync_logs').insert({
        sync_type: syncType,
        status: 'success',
        records_synced: Object.values(results).reduce((sum: number, v: any) => sum + (v?.count || 0), 0),
        started_at: startTime,
        completed_at: new Date().toISOString()
      });

      console.log('✅ Sync completed successfully');

      return new Response(JSON.stringify({ success: true, results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (syncError: any) {
      // Log failed sync
      await supabaseClient.from('kiotviet_sync_logs').insert({
        sync_type: syncType,
        status: 'failed',
        records_synced: 0,
        error_message: syncError.message,
        started_at: startTime,
        completed_at: new Date().toISOString()
      });

      throw syncError;
    }

  } catch (error: any) {
    console.error('❌ Sync error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function syncCategories(accessToken: string, supabase: any, retailerName: string) {
  console.log('📡 Fetching categories from KiotViet...');
  
  // Use hierachicalData=true to get full tree structure with all fields
  const response = await fetch(`${KIOTVIET_BASE_URL}/categories?hierachicalData=true`, {
    headers: { 
      'Retailer': retailerName,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch categories: ${response.status} ${errorText}`);
  }

  const apiData = await response.json();
  const categories = apiData.data || apiData;

  if (!Array.isArray(categories)) {
    throw new Error('Invalid categories response format');
  }

  console.log(`📥 Received ${categories.length} root categories from KiotViet`);

  // Flatten hierarchical data into a flat list with correct levels
  const flatCategories: any[] = [];
  
  function flattenCategory(cat: any, level: number = 1) {
    flatCategories.push({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      parentId: cat.parentId || null,
      retailerId: cat.retailerId,
      hasChild: cat.hasChild || false,
      modifiedDate: cat.modifiedDate,
      createdDate: cat.createdDate,
      level: level
    });
    
    // Recursively flatten children (max 3 levels per KiotViet spec)
    if (cat.children && Array.isArray(cat.children) && level < 3) {
      cat.children.forEach((child: any) => flattenCategory(child, level + 1));
    }
  }

  categories.forEach(cat => flattenCategory(cat));
  
  console.log(`✅ Flattened to ${flatCategories.length} total categories`);

  // Build category map for validation
  const categoryMap = new Map(flatCategories.map((c: any) => [c.categoryId, c]));
  
  // Validate and clean orphaned categories
  const validCategories = flatCategories.map((cat: any) => {
    if (cat.parentId && !categoryMap.has(cat.parentId)) {
      console.warn(`⚠️ Orphaned category: ${cat.categoryName} (id=${cat.categoryId}) has parent_id=${cat.parentId} which doesn't exist. Setting parent_id to null and level to 1.`);
      return { ...cat, parentId: null, level: 1 };
    }
    return cat;
  });

  // Sort categories by hierarchy (parents first, then children)
  const sortedCategories: any[] = [];
  const processed = new Set<number>();

  function addCategoryWithParents(cat: any) {
    if (processed.has(cat.categoryId)) return;
    
    // Add parent first if exists
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      addCategoryWithParents(categoryMap.get(cat.parentId));
    }
    
    sortedCategories.push(cat);
    processed.add(cat.categoryId);
  }

  validCategories.forEach((cat: any) => addCategoryWithParents(cat));

  console.log(`✅ Sorted ${sortedCategories.length} categories by hierarchy`);

  // Upsert with ALL fields from KiotViet API
  const { error } = await supabase.from('kiotviet_categories').upsert(
    sortedCategories.map((cat: any) => ({
      id: cat.categoryId,
      category_name: cat.categoryName,
      parent_id: cat.parentId,
      retailer_id: cat.retailerId,
      has_child: cat.hasChild,
      modified_date: cat.modifiedDate,
      created_date: cat.createdDate,
      level: cat.level,
      synced_at: new Date().toISOString()
    })),
    { onConflict: 'id' }
  );

  if (error) {
    console.error('❌ Error upserting categories:', error);
    throw error;
  }

  return { count: sortedCategories.length };
}

async function syncProducts(accessToken: string, supabase: any, options: any, retailerName: string) {
  let allProducts: any[] = [];
  let currentItem = 0;
  const pageSize = options?.pageSize || 100;

  console.log('📡 Fetching products from KiotViet (paginated)...');

  // Paginated fetch
  while (true) {
    const url = new URL(`${KIOTVIET_BASE_URL}/products`);
    url.searchParams.append('pageSize', pageSize.toString());
    url.searchParams.append('currentItem', currentItem.toString());
    url.searchParams.append('includeInventory', 'false');
    
    if (options?.dateFrom) {
      url.searchParams.append('lastModifiedFrom', options.dateFrom);
    }

    console.log(`📄 Fetching page: currentItem=${currentItem}, pageSize=${pageSize}`);

    const response = await fetch(url.toString(), {
      headers: { 
        'Retailer': retailerName,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${response.status} ${errorText}`);
    }

    const apiData = await response.json();
    const data = apiData.data || [];
    const total = apiData.total || data.length;

    allProducts = [...allProducts, ...data];
    console.log(`📥 Fetched ${data.length} products (total so far: ${allProducts.length}/${total})`);

    if (allProducts.length >= total || data.length === 0) break;
    currentItem += pageSize;
  }

  console.log(`💾 Upserting ${allProducts.length} products to database...`);

  // Upsert products in batches (Supabase has a limit)
  const batchSize = 500;
  for (let i = 0; i < allProducts.length; i += batchSize) {
    const batch = allProducts.slice(i, i + batchSize);
    
    const { error } = await supabase.from('kiotviet_products').upsert(
      batch.map((p: any) => ({
        id: p.id,
        code: p.code,
        barcode: p.barcode || null,
        name: p.name,
        category_id: p.categoryId || null,
        full_name: p.fullName || p.name,
        description: p.description || null,
        base_price: p.basePrice || 0,
        has_variants: p.hasVariants || false,
        allow_sale: p.allowSale !== false,
        is_active: p.isActive !== false,
        images: JSON.stringify(p.images || []),
        product_type: p.productType || 2,
        attributes: JSON.stringify(p.attributes || []),
        units: JSON.stringify(p.units || []),
        synced_at: new Date().toISOString()
      })),
      { onConflict: 'id' }
    );

    if (error) {
      console.error(`❌ Error upserting batch ${i}-${i + batch.length}:`, error);
      throw error;
    }

    console.log(`✅ Batch ${i}-${i + batch.length} upserted`);
  }

  return { count: allProducts.length };
}

async function syncInventory(accessToken: string, supabase: any, retailerName: string) {
  console.log('📡 Fetching inventory from KiotViet...');
  
  const response = await fetch(`${KIOTVIET_BASE_URL}/productOnHands`, {
    headers: { 
      'Retailer': retailerName,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch inventory: ${response.status} ${errorText}`);
  }

  const apiData = await response.json();
  const inventory = apiData.data || apiData;

  if (!Array.isArray(inventory)) {
    throw new Error('Invalid inventory response format');
  }

  console.log(`📥 Received ${inventory.length} inventory records`);

  // Upsert inventory
  const { error } = await supabase.from('kiotviet_inventory').upsert(
    inventory.map((inv: any) => ({
      product_id: inv.productId,
      branch_id: inv.branchId,
      branch_name: inv.branchName || 'Unknown',
      on_hand: inv.onHand || 0,
      reserved: inv.reserved || 0,
      available: (inv.onHand || 0) - (inv.reserved || 0),
      synced_at: new Date().toISOString()
    })),
    { onConflict: 'product_id,branch_id' }
  );

  if (error) {
    console.error('❌ Error upserting inventory:', error);
    throw error;
  }

  return { count: inventory.length };
}

async function syncProductsFull(accessToken: string, supabase: any, options: any, retailerName: string) {
  console.log('🚀 [FULL SYNC] Starting single table sync...');
  
  // Step 1: Fetch Categories (for denormalization)
  console.log('📂 Fetching categories for denormalization...');
  const categoriesResponse = await fetch(`${KIOTVIET_BASE_URL}/categories?hierachicalData=true`, {
    headers: {
      'Retailer': retailerName,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!categoriesResponse.ok) {
    throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
  }
  
  const categoriesData = await categoriesResponse.json();
  const categoriesMap = new Map();
  
  // Build category map with full path
  function buildCategoryMap(cats: any[], parentPath = '') {
    if (!Array.isArray(cats)) return;
    for (const cat of cats) {
      const fullPath = parentPath ? `${parentPath} > ${cat.categoryName}` : cat.categoryName;
      categoriesMap.set(cat.categoryId, { 
        name: cat.categoryName, 
        path: fullPath 
      });
      if (cat.children && Array.isArray(cat.children)) {
        buildCategoryMap(cat.children, fullPath);
      }
    }
  }
  
  buildCategoryMap(categoriesData.data || categoriesData || []);
  console.log(`📂 Loaded ${categoriesMap.size} categories`);
  
  // Step 2: Fetch Products with Inventory
  let allProducts: any[] = [];
  let currentItem = 0;
  const pageSize = options?.pageSize || 100;
  
  console.log('📡 Fetching products with inventory from KiotViet...');
  
  while (true) {
    const url = new URL(`${KIOTVIET_BASE_URL}/products`);
    url.searchParams.append('pageSize', pageSize.toString());
    url.searchParams.append('currentItem', currentItem.toString());
    url.searchParams.append('includeInventory', 'true');
    url.searchParams.append('includeQuantity', 'true');
    
    if (options?.dateFrom) {
      url.searchParams.append('lastModifiedFrom', options.dateFrom);
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        'Retailer': retailerName,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const apiData = await response.json();
    const data = apiData.data || [];
    const total = apiData.total || data.length;
    
    allProducts = [...allProducts, ...data];
    console.log(`📥 Products: ${allProducts.length}/${total}`);
    
    if (allProducts.length >= total || data.length === 0) break;
    currentItem += pageSize;
  }
  
  console.log(`✅ Fetched ${allProducts.length} products`);
  
  // Step 3: Transform & Enrich Data
  console.log('🔄 Transforming data...');
  
  const enrichedProducts = allProducts.map((p: any) => {
    // Get category info
    const category = categoriesMap.get(p.categoryId);
    
    // Process inventory by branch
    const inventories = p.inventories || [];
    const inventoryByBranch = inventories.map((inv: any) => ({
      branch_id: inv.branchId,
      branch_name: inv.branchName || 'Unknown',
      on_hand: inv.onHand || 0,
      reserved: inv.reserved || 0,
      available: (inv.onHand || 0) - (inv.reserved || 0),
      min_quality: inv.minQuality || null,
      max_quality: inv.maxQuality || null,
      location: null // Will be filled from productShelves
    }));
    
    // Aggregate inventory totals
    const totalOnHand = inventoryByBranch.reduce((sum: number, inv: any) => sum + inv.on_hand, 0);
    const totalReserved = inventoryByBranch.reduce((sum: number, inv: any) => sum + inv.reserved, 0);
    
    // Get min/max stock from first inventory record (KiotViet uses same min/max across branches)
    const minStock = inventories[0]?.minQuality || 0;
    const maxStock = inventories[0]?.maxQuality || 999999999;
    
    // Extract location from productShelves and merge into inventoryByBranch
    if (p.productShelves && Array.isArray(p.productShelves)) {
      p.productShelves.forEach((shelf: any) => {
        const invIndex = inventoryByBranch.findIndex((inv: any) => inv.branch_id === shelf.branchId);
        if (invIndex >= 0) {
          inventoryByBranch[invIndex].location = shelf.ProductShelves || null;
        }
      });
    }
    
    return {
      id: p.id,
      code: p.code,
      barcode: p.barCode || p.barcode || null,
      name: p.name,
      full_name: p.fullName || p.name,
      description: p.description || null,
      
      // Category (denormalized)
      category_id: p.categoryId || null,
      category_name: category?.name || p.categoryName || null,
      category_path: category?.path || null,
      
      // Trademark/Brand (denormalized)
      trademark_id: p.tradeMarkId || null,
      trademark_name: p.tradeMarkName || null,
      
      // Pricing (NO COST)
      base_price: p.basePrice || 0,
      
      // Inventory
      total_on_hand: totalOnHand,
      total_reserved: totalReserved,
      total_available: totalOnHand - totalReserved,
      inventory_by_branch: JSON.stringify(inventoryByBranch),
      
      // Stock Management
      min_stock: minStock,
      max_stock: maxStock,
      
      // Details
      weight: p.weight || 0,
      
      // Settings
      has_variants: p.hasVariants || false,
      allow_sale: p.allowsSale !== false,
      is_active: p.isActive !== false,
      product_type: p.type || p.productType || 2,
      is_reward_point: p.isRewardPoint !== false,
      is_lot_serial_control: p.isLotSerialControl || false,
      is_batch_expire_control: p.isBatchExpireControl || false,
      
      order_template: p.orderTemplate || null,
      
      // JSONB Fields
      images: JSON.stringify(p.images || []),
      attributes: JSON.stringify(p.attributes || []),
      units: JSON.stringify(p.units || []),
      price_books: JSON.stringify(p.priceBooks || []),
      product_formulas: JSON.stringify(p.productFormulas || []),
      product_serials: JSON.stringify(p.productSerials || []),
      product_batch_expires: JSON.stringify(p.productBatchExpires || []),
      product_shelves: JSON.stringify(p.productShelves || []),
      
      synced_at: new Date().toISOString()
    };
  });
  
  // Step 4: Upsert to Single Table
  console.log(`💾 Upserting ${enrichedProducts.length} products to kiotviet_products_full...`);
  
  const batchSize = 500;
  for (let i = 0; i < enrichedProducts.length; i += batchSize) {
    const batch = enrichedProducts.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('kiotviet_products_full')
      .upsert(batch, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Batch ${i}-${i + batch.length} error:`, error);
      throw error;
    }
    
    console.log(`✅ Batch ${i}-${i + batch.length} done`);
  }
  
  console.log('✅ [FULL SYNC] Completed!');
  return { count: enrichedProducts.length };
}
