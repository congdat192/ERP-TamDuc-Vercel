
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react';
import { Business, BusinessContextType } from '@/types/business';
import { getBusinesses, createBusiness as createBusinessAPI } from '@/services/businessService';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { setSelectedBusinessId, clearSelectedBusinessId, getSelectedBusinessId } from '@/services/apiService';

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  
  // Refs for optimization and preventing duplicate calls
  const isMountedRef = useRef(true);
  const isInitializingRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const businessesCacheRef = useRef<{ data: Business[]; timestamp: number } | null>(null);
  
  // Cache duration: 30 seconds
  const CACHE_DURATION = 30 * 1000;
  const MIN_REQUEST_DELAY = 1000; // Minimum 1 second between requests

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Check if cache is valid
  const isCacheValid = useCallback(() => {
    if (!businessesCacheRef.current) return false;
    return Date.now() - businessesCacheRef.current.timestamp < CACHE_DURATION;
  }, []);

  // Throttled business initialization with retry mechanism
  const initializeBusinessContext = useCallback(async (retryCount = 0) => {
    if (!isAuthenticated || !currentUser || !isMountedRef.current) {
      console.log('🏢 [BusinessProvider] User not authenticated, skipping business initialization');
      return;
    }

    // Prevent concurrent requests
    if (isInitializingRef.current) {
      console.log('🏢 [BusinessProvider] Already initializing, skipping...');
      return;
    }

    // Check cache first
    if (isCacheValid() && businessesCacheRef.current) {
      console.log('🏢 [BusinessProvider] Using cached businesses data');
      setBusinesses(businessesCacheRef.current.data);
      
      // Restore business context from cache
      if (!restoreBusinessContext() && businessesCacheRef.current.data.length > 0) {
        setSelectedBusiness(businessesCacheRef.current.data[0]);
        setSelectedBusinessId(businessesCacheRef.current.data[0].id.toString());
      }
      return;
    }

    // Rate limiting: ensure minimum delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastFetchTimeRef.current;
    if (timeSinceLastRequest < MIN_REQUEST_DELAY) {
      const delayNeeded = MIN_REQUEST_DELAY - timeSinceLastRequest;
      console.log(`🏢 [BusinessProvider] Rate limiting: waiting ${delayNeeded}ms`);
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }

    isInitializingRef.current = true;
    lastFetchTimeRef.current = Date.now();

    try {
      setIsLoading(true);
      setError(null);
      console.log('🏢 [BusinessProvider] Loading businesses for authenticated user...');
      
      const businessList = await getBusinesses();
      
      if (!isMountedRef.current) return;
      
      console.log('✅ [BusinessProvider] Businesses loaded:', businessList);
      setBusinesses(businessList);
      
      // Update cache
      businessesCacheRef.current = {
        data: businessList,
        timestamp: Date.now()
      };

      // Restore business context after loading
      if (!restoreBusinessContext() && businessList.length > 0) {
        setSelectedBusiness(businessList[0]);
        setSelectedBusinessId(businessList[0].id.toString());
      }
    } catch (error: any) {
      if (!isMountedRef.current) return;
      
      console.error('❌ [BusinessProvider] Error loading businesses:', error);
      
      // Handle 429 (Too Many Requests) with exponential backoff
      if (error.message?.includes('429') || error.message?.includes('Too many requests')) {
        if (retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
          console.log(`🔄 [BusinessProvider] Rate limited, retrying in ${retryDelay}ms (attempt ${retryCount + 1}/3)`);
          
          setTimeout(() => {
            if (isMountedRef.current) {
              initializeBusinessContext(retryCount + 1);
            }
          }, retryDelay);
          return;
        } else {
          setError('Quá nhiều yêu cầu. Vui lòng đợi một chút và thử lại.');
        }
      } else {
        setError(error.message || 'Không thể tải danh sách doanh nghiệp');
      }
      
      // Only show toast error if user is on ERP pages
      if (isAuthenticated && window.location.pathname.startsWith('/ERP/')) {
        toast({
          title: "Lỗi",
          description: error.message?.includes('429') 
            ? "Quá nhiều yêu cầu. Vui lòng đợi một chút và thử lại."
            : "Không thể tải thông tin doanh nghiệp",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      isInitializingRef.current = false;
    }
  }, [isAuthenticated, currentUser, toast, isCacheValid]);

  // Restore business context from localStorage
  const restoreBusinessContext = useCallback(() => {
    const savedBusinessId = getSelectedBusinessId();
    if (savedBusinessId && businesses.length > 0) {
      const savedBusiness = businesses.find(b => b.id.toString() === savedBusinessId);
      if (savedBusiness) {
        console.log('🔄 [BusinessProvider] Restoring business from storage:', savedBusiness.name);
        setSelectedBusiness(savedBusiness);
        return true;
      }
    }
    return false;
  }, [businesses]);

  // Optimized effect with proper dependencies
  useEffect(() => {
    console.log('🏢 [BusinessProvider] Auth state changed:', { isAuthenticated, user: currentUser?.email });
    
    if (isAuthenticated && currentUser) {
      // Debounce initialization to prevent rapid calls
      const timeoutId = setTimeout(() => {
        initializeBusinessContext();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Reset business context when logout
      setBusinesses([]);
      setSelectedBusiness(null);
      setError(null);
      clearSelectedBusinessId();
      sessionStorage.removeItem('intendedRoute');
      businessesCacheRef.current = null;
    }
  }, [isAuthenticated, currentUser?.id]); // Only depend on essential values

  // Memoized functions to prevent unnecessary re-renders
  const fetchBusinesses = useCallback(async () => {
    if (!isAuthenticated) return;
    // Clear cache to force fresh data
    businessesCacheRef.current = null;
    await initializeBusinessContext();
  }, [isAuthenticated, initializeBusinessContext]);

  const selectBusiness = useCallback(async (businessId: string): Promise<void> => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) {
      throw new Error(`Business with ID ${businessId} not found`);
    }

    try {
      console.log('🏢 [BusinessProvider] Selecting business:', business.name);
      setSelectedBusiness(business);
      setSelectedBusinessId(business.id.toString());
      
      // Dispatch custom event to trigger permission refresh
      window.dispatchEvent(new Event('businessChanged'));
      
      console.log('✅ [BusinessProvider] Business selected successfully');
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Failed to select business:', error);
      throw error;
    }
  }, [businesses]);

  const createBusiness = useCallback(async (businessData: { name: string; description?: string }) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      const newBusiness = await createBusinessAPI({
        name: businessData.name,
        description: businessData.description || ''
      });
      
      // Clear cache and refresh businesses list
      businessesCacheRef.current = null;
      await fetchBusinesses();
      
      // Select the new business
      await selectBusiness(newBusiness.id);
      
      return newBusiness;
    } catch (error: any) {
      setError(error.message || 'Không thể tạo doanh nghiệp');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchBusinesses, selectBusiness]);

  // Memoized computed values
  const hasOwnBusiness = useMemo(() => 
    businesses.some(b => b.is_owner), 
    [businesses]
  );

  const refreshCurrentBusiness = useCallback(async () => {
    if (selectedBusiness) {
      await selectBusiness(selectedBusiness.id);
    }
  }, [selectedBusiness, selectBusiness]);

  const clearCurrentBusiness = useCallback(() => {
    setSelectedBusiness(null);
    clearSelectedBusinessId();
  }, []);

  const clearBusinessData = useCallback(() => {
    setBusinesses([]);
    setSelectedBusiness(null);
    setError(null);
    clearSelectedBusinessId();
    sessionStorage.removeItem('intendedRoute');
    businessesCacheRef.current = null;
  }, []);

  // Memoized context value
  const value: BusinessContextType = useMemo(() => ({
    businesses,
    currentBusiness: selectedBusiness,
    isLoading,
    error,
    hasOwnBusiness,
    setCurrentBusiness: setSelectedBusiness,
    fetchBusinesses,
    selectBusiness,
    createBusiness,
    updateBusiness: async () => { throw new Error('Not implemented'); },
    refreshBusinesses: fetchBusinesses,
    refreshCurrentBusiness,
    clearCurrentBusiness,
    clearBusinessData
  }), [
    businesses,
    selectedBusiness,
    isLoading,
    error,
    hasOwnBusiness,
    fetchBusinesses,
    selectBusiness,
    createBusiness,
    refreshCurrentBusiness,
    clearCurrentBusiness,
    clearBusinessData
  ]);

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
