
import { api } from './apiService';
import { Store, CreateStoreRequest, UpdateStoreRequest, StoreListResponse } from '@/types/store';

// Get all stores for current business
export const getStores = async (): Promise<Store[]> => {
  console.log('🏪 [storeService] Getting stores list');
  
  const data = await api.get<StoreListResponse>('/stores');
  
  console.log('✅ [storeService] Stores retrieved successfully:', data.data.length, 'stores found');
  return data.data;
};

// Create new store
export const createStore = async (storeData: CreateStoreRequest): Promise<Store> => {
  console.log('🏗️ [storeService] Creating new store:', storeData.name);
  
  const store = await api.post<Store>('/stores', storeData);
  
  console.log('✅ [storeService] Store created successfully:', store.name);
  return store;
};

// Get specific store details
export const getStore = async (storeId: number): Promise<Store> => {
  console.log('🏪 [storeService] Getting store details for ID:', storeId);
  
  const store = await api.get<Store>(`/stores/${storeId}`);
  
  console.log('✅ [storeService] Store details retrieved successfully:', store.name);
  return store;
};

// Update store
export const updateStore = async (storeId: number, storeData: UpdateStoreRequest): Promise<Store> => {
  console.log('📝 [storeService] Updating store ID:', storeId, 'with data:', storeData);
  
  const store = await api.put<Store>(`/stores/${storeId}`, storeData);
  
  console.log('✅ [storeService] Store updated successfully:', store.name);
  return store;
};

// Delete store
export const deleteStore = async (storeId: number): Promise<void> => {
  console.log('🗑️ [storeService] Deleting store ID:', storeId);
  
  await api.delete(`/stores/${storeId}`);
  
  console.log('✅ [storeService] Store deleted successfully');
};

// Activate/Deactivate store
export const toggleStoreStatus = async (storeId: number, status: 'active' | 'inactive'): Promise<Store> => {
  console.log('🔄 [storeService] Toggling store status:', storeId, 'to', status);
  
  const store = await api.put<Store>(`/stores/${storeId}`, { status });
  
  console.log('✅ [storeService] Store status updated successfully:', store.name, 'is now', status);
  return store;
};

// Get stores with filters and pagination
export const getStoresWithFilters = async (params: {
  page?: number;
  perPage?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}): Promise<StoreListResponse> => {
  console.log('🔍 [storeService] Getting stores with filters:', params);
  
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.perPage) queryParams.append('perPage', params.perPage.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.orderBy) queryParams.append('orderBy', params.orderBy);
  if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);
  
  const data = await api.get<StoreListResponse>(`/stores?${queryParams.toString()}`);
  
  console.log('✅ [storeService] Filtered stores retrieved successfully:', data.data.length, 'stores found');
  return data;
};
