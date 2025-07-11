
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Business, BusinessContextType, CreateBusinessRequest, UpdateBusinessRequest } from '@/types/business';
import { getBusinesses, createBusiness as createBusinessAPI, getBusiness, updateBusiness as updateBusinessAPI } from '@/services/businessService';
import { setSelectedBusinessId, clearSelectedBusinessId, getSelectedBusinessId } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

// Storage keys - Updated to use 'cbi' for business ID
const STORAGE_KEYS = {
  CURRENT_BUSINESS: 'erp_current_business',
  BUSINESSES_LIST: 'erp_businesses_list',
};

// Utility functions for localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log('💾 [BusinessContext] Saved to storage:', key);
  } catch (error) {
    console.warn('❌ [BusinessContext] Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    const result = item ? JSON.parse(item) : null;
    console.log('📁 [BusinessContext] Loaded from storage:', key, result ? 'Data found' : 'No data');
    return result;
  } catch (error) {
    console.warn('❌ [BusinessContext] Failed to load from localStorage:', error);
    return null;
  }
};

const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
    console.log('🗑️ [BusinessContext] Removed from storage:', key);
  } catch (error) {
    console.warn('❌ [BusinessContext] Failed to remove from localStorage:', error);
  }
};

// Check if business context is valid
const isBusinessContextValid = (): boolean => {
  const businessId = getSelectedBusinessId();
  const currentBusiness = loadFromStorage(STORAGE_KEYS.CURRENT_BUSINESS);
  
  if (!businessId || !currentBusiness) {
    console.log('⚠️ [BusinessContext] Invalid business context - missing cbi or current business');
    return false;
  }
  
  if (currentBusiness.id.toString() !== businessId) {
    console.log('⚠️ [BusinessContext] Business context mismatch - cbi vs current business');
    return false;
  }
  
  return true;
};

// Clear all business data
const clearAllBusinessData = () => {
  console.log('🧹 [BusinessContext] Clearing all business data');
  clearSelectedBusinessId();
  removeFromStorage(STORAGE_KEYS.CURRENT_BUSINESS);
  removeFromStorage(STORAGE_KEYS.BUSINESSES_LIST);
};

// Redirect to business selection
const redirectToBusinessSelection = () => {
  console.log('🔄 [BusinessContext] Redirecting to business selection');
  window.location.href = '/business-selection';
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Add fetching state to prevent multiple calls
  const { toast } = useToast();

  // Calculate if user has own business
  const hasOwnBusiness = businesses.some(business => business.is_owner);

  // Initialize business context cleanup function for API service
  useEffect(() => {
    window.clearBusinessContext = clearBusinessData;
    return () => {
      delete window.clearBusinessContext;
    };
  }, []);

  // Load businesses from storage on mount and validate business context
  useEffect(() => {
    console.log('🚀 [BusinessContext] Initializing...');
    
    // Check if business context is valid
    if (!isBusinessContextValid()) {
      console.log('⚠️ [BusinessContext] Invalid business context detected, clearing and redirecting');
      clearAllBusinessData();
      // Don't redirect immediately, let the route handler decide
      return;
    }
    
    const storedBusinesses = loadFromStorage(STORAGE_KEYS.BUSINESSES_LIST);
    const storedCurrentBusiness = loadFromStorage(STORAGE_KEYS.CURRENT_BUSINESS);
    
    if (storedBusinesses) {
      setBusinesses(storedBusinesses);
    }
    
    if (storedCurrentBusiness) {
      setCurrentBusiness(storedCurrentBusiness);
      console.log('✅ [BusinessContext] Restored valid business context:', storedCurrentBusiness.name);
    }
  }, []);

  const fetchBusinesses = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isFetching) {
      console.log('⚠️ [BusinessContext] Already fetching businesses, skipping...');
      return;
    }

    setIsFetching(true);
    setIsLoading(true);
    
    try {
      console.log('🔄 [BusinessContext] Fetching businesses...');
      const businessList = await getBusinesses();
      setBusinesses(businessList);
      saveToStorage(STORAGE_KEYS.BUSINESSES_LIST, businessList);
      
      console.log('✅ [BusinessContext] Fetched businesses:', businessList.length);
    } catch (error) {
      console.error('❌ [BusinessContext] Failed to fetch businesses:', error);
      
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải danh sách doanh nghiệp",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [toast, isFetching]);

  const createBusiness = useCallback(async (data: CreateBusinessRequest): Promise<Business> => {
    console.log('🏗️ [BusinessContext] Creating business:', data.name);
    
    setIsLoading(true);
    try {
      console.log('🔄 [BusinessContext] Calling createBusinessAPI...');
      const newBusiness = await createBusinessAPI(data);
      
      // Update businesses list
      const updatedBusinesses = [...businesses, newBusiness];
      setBusinesses(updatedBusinesses);
      saveToStorage(STORAGE_KEYS.BUSINESSES_LIST, updatedBusinesses);
      
      toast({
        title: "Thành công",
        description: "Tạo doanh nghiệp thành công!",
      });
      
      console.log('✅ [BusinessContext] Created business:', newBusiness.name);
      return newBusiness;
    } catch (error) {
      console.error('❌ [BusinessContext] Failed to create business:', error);
      const errorMessage = error instanceof Error ? error.message : "Tạo doanh nghiệp thất bại";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [businesses, toast]);

  const selectBusiness = useCallback(async (businessId: number) => {
    setIsLoading(true);
    try {
      const business = await getBusiness(businessId);
      setCurrentBusiness(business);
      saveToStorage(STORAGE_KEYS.CURRENT_BUSINESS, business);
      
      // Update cbi storage
      setSelectedBusinessId(business.id.toString());
      
      console.log('✅ [BusinessContext] Selected business:', business.name);
    } catch (error) {
      console.error('❌ [BusinessContext] Failed to select business:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể chọn doanh nghiệp",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateBusiness = useCallback(async (businessId: number, data: UpdateBusinessRequest): Promise<Business> => {
    setIsLoading(true);
    try {
      const updatedBusiness = await updateBusinessAPI(businessId, data);
      
      // Update businesses list
      const updatedBusinesses = businesses.map(business => 
        business.id === businessId ? updatedBusiness : business
      );
      setBusinesses(updatedBusinesses);
      saveToStorage(STORAGE_KEYS.BUSINESSES_LIST, updatedBusinesses);
      
      // Update current business if it's the one being updated
      if (currentBusiness?.id === businessId) {
        setCurrentBusiness(updatedBusiness);
        saveToStorage(STORAGE_KEYS.CURRENT_BUSINESS, updatedBusiness);
      }
      
      toast({
        title: "Thành công",
        description: "Cập nhật doanh nghiệp thành công!",
      });
      
      console.log('✅ [BusinessContext] Updated business:', updatedBusiness.name);
      return updatedBusiness;
    } catch (error) {
      console.error('❌ [BusinessContext] Failed to update business:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Cập nhật doanh nghiệp thất bại",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [businesses, currentBusiness, toast]);

  const refreshCurrentBusiness = useCallback(async () => {
    if (!currentBusiness) return;
    
    try {
      const refreshedBusiness = await getBusiness(currentBusiness.id);
      setCurrentBusiness(refreshedBusiness);
      saveToStorage(STORAGE_KEYS.CURRENT_BUSINESS, refreshedBusiness);
      
      console.log('✅ [BusinessContext] Refreshed current business:', refreshedBusiness.name);
    } catch (error) {
      console.error('❌ [BusinessContext] Failed to refresh current business:', error);
    }
  }, [currentBusiness]);

  // Clear business data when logout or error
  const clearBusinessData = useCallback(() => {
    console.log('🧹 [BusinessContext] Clearing business data');
    setBusinesses([]);
    setCurrentBusiness(null);
    clearAllBusinessData();
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        currentBusiness,
        isLoading,
        hasOwnBusiness,
        fetchBusinesses,
        createBusiness,
        selectBusiness,
        updateBusiness,
        refreshCurrentBusiness,
        clearBusinessData,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
