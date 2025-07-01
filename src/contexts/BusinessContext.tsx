import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

// Storage keys - MUST MATCH AuthContext
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'erp_current_user',
  CURRENT_BUSINESS: 'erp_current_business',
  BUSINESSES_LIST: 'erp_businesses_list',
  SESSION_TIMESTAMP: 'erp_session_timestamp'
};

// Session timeout (in milliseconds) - 8 hours
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

// Error handling state
let lastAuthError: string | null = null;
let lastErrorTime = 0;
const ERROR_DEBOUNCE_TIME = 30000; // 30 seconds

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

// Check if session is valid
const isSessionValid = () => {
  const timestamp = loadFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);
  if (!timestamp) {
    return false;
  }
  
  const now = Date.now();
  const sessionAge = now - timestamp;
  const isValid = sessionAge < SESSION_TIMEOUT;
  return isValid;
};

// Check if user is authenticated by checking localStorage directly
const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  const hasValidSession = isSessionValid();
  const isAuth = !!(token && user && hasValidSession);
  return isAuth;
};

// Debounced error handler
const handleAuthError = (toast: any, errorMessage: string) => {
  const now = Date.now();
  
  // Skip if same error within debounce time
  if (lastAuthError === errorMessage && (now - lastErrorTime) < ERROR_DEBOUNCE_TIME) {
    console.log('🔇 [BusinessContext] Skipping duplicate error toast');
    return;
  }
  
  lastAuthError = errorMessage;
  lastErrorTime = now;
  
  toast({
    title: "Phiên đăng nhập hết hạn",
    description: "Vui lòng đăng nhập lại để tiếp tục",
    variant: "destructive",
  });
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const authCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate if user has own business - check for is_owner: true
  const hasOwnBusiness = businesses.some(business => business.is_owner === true);

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

  // Optimized auth check - only run every 30 seconds instead of every second
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        console.log('🧹 [BusinessContext] User logged out, clearing business data');
        setBusinesses([]);
        setCurrentBusiness(null);
        removeFromStorage(STORAGE_KEYS.BUSINESSES_LIST);
        removeFromStorage(STORAGE_KEYS.CURRENT_BUSINESS);
        
        // Clear interval to stop checking
        if (authCheckIntervalRef.current) {
          clearInterval(authCheckIntervalRef.current);
          authCheckIntervalRef.current = null;
        }
        
        handleAuthError(toast, "auth_expired");
      }
    };

    // Only start interval if authenticated
    if (isAuthenticated()) {
      authCheckIntervalRef.current = setInterval(checkAuth, 30000); // Check every 30 seconds
    }

    return () => {
      if (authCheckIntervalRef.current) {
        clearInterval(authCheckIntervalRef.current);
      }
    };
  }, [toast]);

  const fetchBusinesses = async () => {
    if (!isAuthenticated()) {
      console.log('⚠️ [BusinessContext] Cannot fetch businesses - user not authenticated');
      handleAuthError(toast, "fetch_businesses_auth_error");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('🔄 [BusinessContext] Fetching businesses...');
      const businessList = await getBusinesses();
      setBusinesses(businessList);
      saveToStorage(STORAGE_KEYS.BUSINESSES_LIST, businessList);
      
      console.log('✅ [BusinessContext] Fetched businesses:', businessList.length);
      console.log('🏢 [BusinessContext] Owned businesses:', businessList.filter(b => b.is_owner).length);
      console.log('👥 [BusinessContext] Invited businesses:', businessList.filter(b => !b.is_owner).length);
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
    
    if (!isAuthenticated()) {
      console.error('❌ [BusinessContext] Cannot create business - user not authenticated');
      const errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      handleAuthError(toast, errorMsg);
      throw new Error(errorMsg);
    }

    // Check if user already has own business
    if (hasOwnBusiness) {
      const errorMsg = 'Bạn đã có doanh nghiệp riêng. Mỗi tài khoản chỉ được tạo tối đa 1 doanh nghiệp.';
      toast({
        title: "Giới hạn tạo doanh nghiệp",
        description: errorMsg,
        variant: "destructive",
      });
      throw new Error(errorMsg);
    }

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
  };

  const selectBusiness = async (businessId: number) => {
    if (!isAuthenticated()) {
      console.log('⚠️ [BusinessContext] Cannot select business - user not authenticated');
      handleAuthError(toast, "select_business_auth_error");
      return;
    }
    
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
    if (!isAuthenticated()) {
      console.log('⚠️ [BusinessContext] Cannot update business - user not authenticated');
      throw new Error('User not authenticated');
    }
    
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
    if (!currentBusiness || !isAuthenticated()) return;
    
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
