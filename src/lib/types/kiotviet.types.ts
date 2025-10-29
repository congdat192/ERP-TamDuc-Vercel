// ==========================================
// KIOTVIET API TYPES
// ==========================================

// Category types
export interface KiotVietCategory {
  categoryId: number;
  categoryName: string;
  parentId?: number;
  retailerId: number;
  hasChild?: boolean;
  modifiedDate?: string;
  createdDate: string;
  children?: KiotVietCategory[];
}

export interface KiotVietCategoryTree extends KiotVietCategory {
  children?: KiotVietCategoryTree[];
}

// Product types
export interface KiotVietProduct {
  id: number;
  code: string;
  barcode?: string;
  name: string;
  fullName: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  basePrice: number;
  hasVariants: boolean;
  allowSale: boolean;
  isActive: boolean;
  images?: string[];
  productType: 1 | 2 | 3; // 1: combo, 2: normal, 3: service
  attributes?: Array<{
    attributeName: string;
    attributeValue: string;
  }>;
  units?: Array<{
    unitName: string;
    conversionValue: number;
  }>;
  createdDate?: string;
  modifiedDate?: string;
}

// Inventory types
export interface KiotVietInventory {
  productId: number;
  productCode: string;
  productName: string;
  branchId: number;
  branchName: string;
  onHand: number;
  reserved: number;
  available: number;
}

// API Response types
export interface KiotVietApiResponse<T> {
  total: number;
  pageSize: number;
  data: T[];
}

// Credential types
export interface KiotVietCredentials {
  id?: string;
  retailerName: string;
  clientId: string;
  encryptedToken: string;
  tokenExpiresAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Sync config types
export interface KiotVietSyncConfig {
  syncCategories: boolean;
  syncProducts: boolean;
  syncInventory: boolean;
  pageSize?: number;
  dateFrom?: string;
}

// Sync log types
export interface KiotVietSyncLog {
  id: string;
  syncType: string;
  status: 'success' | 'partial' | 'failed';
  recordsSynced: number;
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
}

// Database types (Supabase tables)
export interface KiotVietProductDB {
  id: number;
  code: string;
  barcode?: string;
  name: string;
  category_id?: number;
  full_name?: string;
  description?: string;
  base_price: number;
  has_variants: boolean;
  allow_sale: boolean;
  is_active: boolean;
  images: any; // JSONB
  product_type: number;
  attributes: any; // JSONB
  units: any; // JSONB
  synced_at: string;
  created_at: string;
}

export interface KiotVietCategoryDB {
  id: number;
  category_name: string;
  parent_id?: number;
  retailer_id?: number;
  has_child?: boolean;
  modified_date?: string;
  created_date?: string;
  level: number;
  synced_at: string;
}

export interface KiotVietInventoryDB {
  id: string;
  product_id: number;
  branch_id: number;
  branch_name?: string;
  on_hand: number;
  reserved: number;
  available: number;
  synced_at: string;
}
