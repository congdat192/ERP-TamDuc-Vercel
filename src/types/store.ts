
export interface Store {
  id: number;
  business_id: number;
  name: string;
  code: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  manager_phone?: string;
  status: 'active' | 'inactive';
  is_main_store: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreRequest {
  name: string;
  code: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  manager_phone?: string;
  is_main_store?: boolean;
}

export interface UpdateStoreRequest {
  name?: string;
  code?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  manager_phone?: string;
  status?: 'active' | 'inactive';
  is_main_store?: boolean;
}

export interface StoreListResponse {
  data: Store[];
  total: number;
  per_page: number;
  current_page: number;
}

export interface StoreContextType {
  stores: Store[];
  currentStore: Store | null;
  selectedStoreIds: number[];
  isLoading: boolean;
  error: string | null;
  
  // Store management
  fetchStores: () => Promise<void>;
  createStore: (data: CreateStoreRequest) => Promise<Store>;
  updateStore: (storeId: number, data: UpdateStoreRequest) => Promise<Store>;
  deleteStore: (storeId: number) => Promise<void>;
  
  // Store selection
  setCurrentStore: (store: Store | null) => void;
  setSelectedStoreIds: (storeIds: number[]) => void;
  selectAllStores: () => void;
  clearStoreSelection: () => void;
  
  // Utilities
  getStoreById: (storeId: number) => Store | undefined;
  getActiveStores: () => Store[];
  refreshStores: () => Promise<void>;
  clearStoreData: () => void;
}

// Store filter types for other modules
export interface StoreFilterOptions {
  mode: 'all' | 'single' | 'multiple' | 'compare';
  storeIds: number[];
  aggregateData?: boolean;
}

export interface StoreAwareApiParams {
  storeIds?: number[];
  aggregateByStore?: boolean;
}
