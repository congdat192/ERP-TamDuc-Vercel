
import { StoreEntity, CreateStoreRequest, UpdateStoreRequest, StoreListResponse } from '@/types/store';
import { api } from './apiService';

export async function getStores(): Promise<StoreEntity[]> {
  try {
    console.log('🔍 [StoreService] Fetching stores...');
    const response = await api.get<StoreListResponse>('/stores');
    console.log('✅ [StoreService] Stores fetched:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ [StoreService] Error fetching stores:', error);
    throw error;
  }
}

export async function createStore(data: CreateStoreRequest): Promise<StoreEntity> {
  try {
    console.log('🔧 [StoreService] Creating store:', data.name);
    const response = await api.post<StoreEntity>('/stores', data);
    console.log('✅ [StoreService] Store created:', response.name);
    return response;
  } catch (error) {
    console.error('❌ [StoreService] Error creating store:', error);
    throw error;
  }
}

export async function updateStore(storeId: number, data: UpdateStoreRequest): Promise<StoreEntity> {
  try {
    console.log('📝 [StoreService] Updating store:', storeId);
    const response = await api.put<StoreEntity>(`/stores/${storeId}`, data);
    console.log('✅ [StoreService] Store updated:', response.name);
    return response;
  } catch (error) {
    console.error('❌ [StoreService] Error updating store:', error);
    throw error;
  }
}

export async function deleteStore(storeId: number): Promise<void> {
  try {
    console.log('🗑️ [StoreService] Deleting store:', storeId);
    await api.delete(`/stores/${storeId}`);
    console.log('✅ [StoreService] Store deleted');
  } catch (error) {
    console.error('❌ [StoreService] Error deleting store:', error);
    throw error;
  }
}

export async function toggleStoreStatus(storeId: number, status: 'active' | 'inactive'): Promise<StoreEntity> {
  return updateStore(storeId, { status });
}

export async function getStoresWithFilters(filters: {
  search?: string;
  status?: 'active' | 'inactive';
  isMainStore?: boolean;
}): Promise<StoreEntity[]> {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.isMainStore !== undefined) params.append('is_main_store', filters.isMainStore.toString());
    
    const queryString = params.toString();
    const endpoint = `/stores${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<StoreListResponse>(endpoint);
    return response.data;
  } catch (error) {
    console.error('❌ [StoreService] Error fetching filtered stores:', error);
    throw error;
  }
}
