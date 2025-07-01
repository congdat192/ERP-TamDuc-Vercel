import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, BusinessContextType, CreateBusinessRequest, UpdateBusinessRequest } from '@/types/business';
import { getBusinesses, createBusiness as createBusinessAPI, getBusiness, updateBusiness as updateBusinessAPI } from '@/services/businessService';
import { useToast } from '@/hooks/use-toast';

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

// Storage keys
const STORAGE_KEYS = {
  CURRENT_BUSINESS: 'erp_current_business',
  BUSINESSES_LIST: 'erp_businesses_list'
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

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate if user has own business
  const hasOwnBusiness = businesses.some(business => business.is_owner);

  // Check if user is authenticated by checking localStorage directly
  const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('erp_current_user');
    console.log('🔐 [BusinessContext] Auth check - Token:', token ? 'exists' : 'missing', 'User:', user ? 'exists' : 'missing');
    return !!(token && user);
  };

  // Load businesses from storage on mount
  useEffect(() => {
    console.log('🚀 [BusinessContext] Initializing...');
    if (isAuthenticated()) {
      const storedBusinesses = loadFromStorage(STORAGE_KEYS.BUSINESSES_LIST);
      const storedCurrentBusiness = loadFromStorage(STORAGE_KEYS.CURRENT_BUSINESS);
      
      if (storedBusinesses) {
        setBusinesses(storedBusinesses);
      }
      
      if (storedCurrentBusiness) {
        setCurrentBusiness(storedCurrentBusiness);
      }
    } else {
      console.log('⚠️ [BusinessContext] User not authenticated, skipping initialization');
    }
  }, []);

  // Clear business data when user logs out
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        console.log('🧹 [BusinessContext] User logged out, clearing business data');
        setBusinesses([]);
        setCurrentBusiness(null);
        removeFromStorage(STORAGE_KEYS.BUSINESSES_LIST);
        removeFromStorage(STORAGE_KEYS.CURRENT_BUSINESS);
      }
    };

    // Check auth status periodically
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchBusinesses = async () => {
    if (!isAuthenticated()) {
      console.log('⚠️ [BusinessContext] Cannot fetch businesses - user not authenticated');
      return;
    }
    
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
    } finally {
      setIsLoading(false);
    }
  };

  const createBusiness = async (data: CreateBusinessRequest): Promise<Business> => {
    console.log('🏗️ [BusinessContext] Creating business:', data.name);
    console.log('🔍 [BusinessContext] Auth check before create:', isAuthenticated() ? 'Authenticated' : 'Not authenticated');
    
    if (!isAuthenticated()) {
      console.error('❌ [BusinessContext] Cannot create business - user not authenticated');
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    try {
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
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Tạo doanh nghiệp thất bại",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const selectBusiness = async (businessId: number) => {
    setIsLoading(true);
    try {
      const business = await getBusiness(businessId);
      setCurrentBusiness(business);
      saveToStorage(STORAGE_KEYS.CURRENT_BUSINESS, business);
      
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
  };

  const updateBusiness = async (businessId: number, data: UpdateBusinessRequest): Promise<Business> => {
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
  };

  const refreshCurrentBusiness = async () => {
    if (!currentBusiness) return;
    
    try {
      const refreshedBusiness = await getBusiness(currentBusiness.id);
      setCurrentBusiness(refreshedBusiness);
      saveToStorage(STORAGE_KEYS.CURRENT_BUSINESS, refreshedBusiness);
      
      console.log('✅ [BusinessContext] Refreshed current business:', refreshedBusiness.name);
    } catch (error) {
      console.error('❌ [BusinessContext] Failed to refresh current business:', error);
    }
  };

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
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
