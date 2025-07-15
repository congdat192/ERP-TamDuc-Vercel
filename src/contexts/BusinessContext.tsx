
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

  // Lưu business context với intended route
  const saveIntendedRoute = (intendedRoute?: string) => {
    if (intendedRoute) {
      sessionStorage.setItem('intendedRoute', intendedRoute);
    }
  };

  // Khôi phục business context từ localStorage
  const restoreBusinessContext = () => {
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
  };

  // CHỈ tải businesses khi user đã authenticated
  const initializeBusinessContext = async () => {
    if (!isAuthenticated || !currentUser) {
      console.log('🏢 [BusinessProvider] User not authenticated, skipping business initialization');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🏢 [BusinessProvider] Loading businesses for authenticated user...');
      
      const businessList = await getBusinesses();
      console.log('✅ [BusinessProvider] Businesses loaded:', businessList);
      setBusinesses(businessList);

      // Khôi phục business context sau khi load xong
      if (!restoreBusinessContext() && businessList.length > 0) {
        // Nếu không có saved business và có businesses, chọn business đầu tiên
        setSelectedBusiness(businessList[0]);
        setSelectedBusinessId(businessList[0].id.toString());
      }
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Error loading businesses:', error);
      setError(error.message || 'Không thể tải danh sách doanh nghiệp');
      
      // CHỈ hiển thị toast error nếu user đã authenticated và đang ở trang cần business context
      if (isAuthenticated && window.location.pathname.startsWith('/ERP/')) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin doanh nghiệp",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Effect để initialize business context khi user login
  useEffect(() => {
    console.log('🏢 [BusinessProvider] Auth state changed:', { isAuthenticated, user: currentUser?.email });
    
    if (isAuthenticated && currentUser) {
      initializeBusinessContext();
    } else {
      // Reset business context khi logout
      setBusinesses([]);
      setSelectedBusiness(null);
      setError(null);
      clearSelectedBusinessId();
      sessionStorage.removeItem('intendedRoute');
    }
  }, [isAuthenticated, currentUser]);

  const fetchBusinesses = async () => {
    if (!isAuthenticated) return;
    await initializeBusinessContext();
  };

  const selectBusiness = async (businessId: number): Promise<void> => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) {
      throw new Error(`Business with ID ${businessId} not found`);
    }

    try {
      console.log('🏢 [BusinessProvider] Selecting business:', business.name);
      setSelectedBusiness(business);
      setSelectedBusinessId(business.id.toString());
      console.log('✅ [BusinessProvider] Business selected successfully');
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Failed to select business:', error);
      throw error;
    }
  };

  const createBusiness = async (businessData: { name: string; description?: string }) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      const newBusiness = await createBusinessAPI({
        name: businessData.name,
        description: businessData.description || ''
      });
      
      // Refresh businesses list
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
  };

  const hasOwnBusiness = businesses.some(b => b.is_owner);

  const value: BusinessContextType = {
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
    refreshCurrentBusiness: async () => {
      if (selectedBusiness) {
        await selectBusiness(selectedBusiness.id);
      }
    },
    clearCurrentBusiness: () => {
      setSelectedBusiness(null);
      clearSelectedBusinessId();
    },
    clearBusinessData: () => {
      setBusinesses([]);
      setSelectedBusiness(null);
      setError(null);
      clearSelectedBusinessId();
      sessionStorage.removeItem('intendedRoute');
    }
  };

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
