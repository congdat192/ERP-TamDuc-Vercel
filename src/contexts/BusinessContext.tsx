
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business } from '../types/business';
import { businessService } from '../services/businessService';
import { getSelectedBusinessId, setSelectedBusinessId } from '../services/apiService';
import { useToast } from '@/hooks/use-toast';

interface BusinessContextType {
  currentBusiness: Business | null;
  businesses: Business[];
  isLoading: boolean;
  error: string | null;
  setCurrentBusiness: (business: Business) => void;
  refreshBusinesses: () => Promise<void>;
  clearCurrentBusiness: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBusiness, setCurrentBusinessState] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // FIX: Improve business context recovery từ localStorage
  const initializeBusinessContext = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🏢 [BusinessProvider] Initializing business context...');
      
      // Load all businesses first
      const businessesData = await businessService.getBusinesses();
      console.log('✅ [BusinessProvider] Businesses loaded:', businessesData);
      setBusinesses(businessesData);
      
      // Try to recover selected business từ localStorage
      const storedBusinessId = getSelectedBusinessId();
      console.log('🔄 [BusinessProvider] Stored business ID:', storedBusinessId);
      
      if (storedBusinessId && businessesData.length > 0) {
        // Find business by stored ID
        const selectedBusiness = businessesData.find(
          business => business.id.toString() === storedBusinessId
        );
        
        if (selectedBusiness) {
          console.log('✅ [BusinessProvider] Recovered business from storage:', selectedBusiness.name);
          setCurrentBusinessState(selectedBusiness);
        } else {
          console.log('⚠️ [BusinessProvider] Stored business not found, clearing storage');
          // Clear invalid business ID
          localStorage.removeItem('selectedBusinessId');
          setCurrentBusinessState(null);
        }
      } else {
        console.log('⚠️ [BusinessProvider] No valid stored business found');
        setCurrentBusinessState(null);
      }
      
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Error initializing business context:', error);
      setError(error.message || 'Không thể tải thông tin doanh nghiệp');
      
      // Clear invalid storage data on error
      localStorage.removeItem('selectedBusinessId');
      setCurrentBusinessState(null);
      
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin doanh nghiệp",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeBusinessContext();
  }, []);

  const setCurrentBusiness = (business: Business) => {
    console.log('🏢 [BusinessProvider] Setting current business:', business.name);
    setCurrentBusinessState(business);
    setSelectedBusinessId(business.id.toString());
  };

  const refreshBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 [BusinessProvider] Refreshing businesses...');
      const businessesData = await businessService.getBusinesses();
      console.log('✅ [BusinessProvider] Businesses refreshed:', businessesData);
      setBusinesses(businessesData);
      
      // Verify current business still exists
      if (currentBusiness) {
        const stillExists = businessesData.find(b => b.id === currentBusiness.id);
        if (!stillExists) {
          console.log('⚠️ [BusinessProvider] Current business no longer exists, clearing');
          setCurrentBusinessState(null);
          localStorage.removeItem('selectedBusinessId');
        }
      }
      
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Error refreshing businesses:', error);
      setError(error.message || 'Không thể tải lại danh sách doanh nghiệp');
      
      toast({
        title: "Lỗi",
        description: "Không thể tải lại danh sách doanh nghiệp",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCurrentBusiness = () => {
    console.log('🏢 [BusinessProvider] Clearing current business');
    setCurrentBusinessState(null);
    localStorage.removeItem('selectedBusinessId');
  };

  const value: BusinessContextType = {
    currentBusiness,
    businesses,
    isLoading,
    error,
    setCurrentBusiness,
    refreshBusinesses,
    clearCurrentBusiness
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};
