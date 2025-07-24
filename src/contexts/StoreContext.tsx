import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { StoreEntity, StoreContextType, CreateStoreRequest, UpdateStoreRequest } from '@/types/store';
import { getStores, createStore as createStoreAPI, updateStore as updateStoreAPI, deleteStore as deleteStoreAPI } from '@/services/storeService';
import { useBusiness } from '@/contexts/BusinessContext';
import { useToast } from '@/hooks/use-toast';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<StoreEntity[]>([]);
  const [currentStore, setCurrentStore] = useState<StoreEntity | null>(null);
  const [selectedStoreIds, setSelectedStoreIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentBusiness } = useBusiness();
  const { toast } = useToast();

  // Load stores when business changes
  useEffect(() => {
    if (currentBusiness) {
      fetchStores();
    } else {
      // Clear stores when no business selected
      setStores([]);
      setCurrentStore(null);
      setSelectedStoreIds([]);
      setError(null);
    }
  }, [currentBusiness?.id]);

  // Auto-select main store if available
  useEffect(() => {
    if (stores.length > 0 && !currentStore) {
      const mainStore = stores.find(store => store.is_main_store && store.status === 'active');
      if (mainStore) {
        setCurrentStore(mainStore);
      } else {
        // Select first active store if no main store
        const firstActiveStore = stores.find(store => store.status === 'active');
        if (firstActiveStore) {
          setCurrentStore(firstActiveStore);
        }
      }
    }
  }, [stores, currentStore]);

  const fetchStores = useCallback(async () => {
    if (!currentBusiness) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🏪 [StoreProvider] Loading stores for business:', currentBusiness.name);
      const storeList = await getStores();
      setStores(storeList);
      console.log('✅ [StoreProvider] Stores loaded:', storeList.length);
    } catch (error: any) {
      console.error('❌ [StoreProvider] Error loading stores:', error);
      setError(error.message || 'Không thể tải danh sách cửa hàng');
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách cửa hàng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentBusiness, toast]);

  const createStore = useCallback(async (storeData: CreateStoreRequest): Promise<StoreEntity> => {
    if (!currentBusiness) {
      throw new Error('Không có doanh nghiệp được chọn');
    }

    try {
      setIsLoading(true);
      const newStore = await createStoreAPI(storeData);
      
      // Refresh stores list
      await fetchStores();
      
      toast({
        title: "Thành công",
        description: `Đã tạo cửa hàng "${newStore.name}"`,
      });
      
      return newStore;
    } catch (error: any) {
      console.error('❌ [StoreProvider] Error creating store:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo cửa hàng",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentBusiness, fetchStores, toast]);

  const updateStore = useCallback(async (storeId: number, storeData: UpdateStoreRequest): Promise<StoreEntity> => {
    try {
      setIsLoading(true);
      const updatedStore = await updateStoreAPI(storeId, storeData);
      
      // Update local state
      setStores(prev => prev.map(store => 
        store.id === storeId ? updatedStore : store
      ));
      
      // Update current store if it's the one being updated
      if (currentStore?.id === storeId) {
        setCurrentStore(updatedStore);
      }
      
      toast({
        title: "Thành công",
        description: `Đã cập nhật cửa hàng "${updatedStore.name}"`,
      });
      
      return updatedStore;
    } catch (error: any) {
      console.error('❌ [StoreProvider] Error updating store:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật cửa hàng",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, toast]);

  const deleteStore = useCallback(async (storeId: number): Promise<void> => {
    try {
      setIsLoading(true);
      await deleteStoreAPI(storeId);
      
      // Remove from local state
      setStores(prev => prev.filter(store => store.id !== storeId));
      
      // Clear current store if it's the one being deleted
      if (currentStore?.id === storeId) {
        setCurrentStore(null);
      }
      
      // Remove from selected stores
      setSelectedStoreIds(prev => prev.filter(id => id !== storeId));
      
      toast({
        title: "Thành công",
        description: "Đã xóa cửa hàng",
      });
    } catch (error: any) {
      console.error('❌ [StoreProvider] Error deleting store:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa cửa hàng",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, toast]);

  const selectAllStores = useCallback(() => {
    const activeStoreIds = stores
      .filter(store => store.status === 'active')
      .map(store => store.id);
    setSelectedStoreIds(activeStoreIds);
  }, [stores]);

  const clearStoreSelection = useCallback(() => {
    setSelectedStoreIds([]);
  }, []);

  const getStoreById = useCallback((storeId: number): StoreEntity | undefined => {
    return stores.find(store => store.id === storeId);
  }, [stores]);

  const getActiveStores = useCallback((): StoreEntity[] => {
    return stores.filter(store => store.status === 'active');
  }, [stores]);

  const refreshStores = useCallback(async () => {
    await fetchStores();
  }, [fetchStores]);

  const clearStoreData = useCallback(() => {
    setStores([]);
    setCurrentStore(null);
    setSelectedStoreIds([]);
    setError(null);
  }, []);

  // Memoized context value
  const value: StoreContextType = useMemo(() => ({
    stores,
    currentStore,
    selectedStoreIds,
    isLoading,
    error,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    setCurrentStore,
    setSelectedStoreIds,
    selectAllStores,
    clearStoreSelection,
    getStoreById,
    getActiveStores,
    refreshStores,
    clearStoreData
  }), [
    stores,
    currentStore,
    selectedStoreIds,
    isLoading,
    error,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    selectAllStores,
    clearStoreSelection,
    getStoreById,
    getActiveStores,
    refreshStores,
    clearStoreData
  ]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
