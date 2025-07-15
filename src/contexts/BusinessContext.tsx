
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, BusinessContextType } from '../types/business';
import { getBusinesses, getBusiness, createBusiness as createBusinessService, updateBusiness as updateBusinessService } from '../services/businessService';
import { getSelectedBusinessId, setSelectedBusinessId } from '../services/apiService';
import { useToast } from '@/hooks/use-toast';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Calculate hasOwnBusiness based on businesses array
  const hasOwnBusiness = businesses.some(business => business.is_owner);

  // FIX: Improve business context recovery với better persistence
  const initializeBusinessContext = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🏢 [BusinessProvider] Initializing business context...');
      
      // Load all businesses first
      const businessesData = await getBusinesses();
      console.log('✅ [BusinessProvider] Businesses loaded:', businessesData);
      setBusinesses(businessesData);
      
      // Try to recover selected business từ localStorage or URL
      const storedBusinessId = getSelectedBusinessId();
      console.log('🔄 [BusinessProvider] Stored business ID:', storedBusinessId);
      
      // Check if we're on an ERP route that requires business context
      const currentPath = window.location.pathname;
      const isERPRoute = currentPath.startsWith('/ERP/') && !currentPath.includes('/Profile');
      
      if (storedBusinessId && businessesData.length > 0) {
        // Find business by stored ID
        const selectedBusiness = businessesData.find(
          business => business.id.toString() === storedBusinessId
        );
        
        if (selectedBusiness) {
          console.log('✅ [BusinessProvider] Recovered business from storage:', selectedBusiness.name);
          setCurrentBusinessState(selectedBusiness);
          
          // Save current path để restore sau khi context ready
          const currentRoute = sessionStorage.getItem('currentRoute');
          if (currentRoute && isERPRoute) {
            console.log('🔄 [BusinessProvider] Will restore route:', currentRoute);
          }
          
        } else {
          console.log('⚠️ [BusinessProvider] Stored business not found, clearing storage');
          // Clear invalid business ID
          localStorage.removeItem('selectedBusinessId');
          setCurrentBusinessState(null);
          
          // Only redirect if we're on ERP route
          if (isERPRoute) {
            // Save current route before redirect
            sessionStorage.setItem('intendedRoute', currentPath);
          }
        }
      } else {
        console.log('⚠️ [BusinessProvider] No valid stored business found');
        setCurrentBusinessState(null);
        
        // Only redirect if we're on ERP route
        if (isERPRoute) {
          // Save current route before redirect
          sessionStorage.setItem('intendedRoute', currentPath);
        }
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
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    // Save current route để restore later
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/ERP/') && !currentPath.includes('/Profile')) {
      sessionStorage.setItem('currentRoute', currentPath);
    }
    
    initializeBusinessContext();
  }, []);

  const setCurrentBusiness = (business: Business) => {
    console.log('🏢 [BusinessProvider] Setting current business:', business.name);
    setCurrentBusinessState(business);
    setSelectedBusinessId(business.id.toString());
    
    // Check for intended route after setting business
    const intendedRoute = sessionStorage.getItem('intendedRoute');
    if (intendedRoute && intendedRoute !== '/ERP/Dashboard') {
      console.log('🔄 [BusinessProvider] Restoring intended route:', intendedRoute);
      sessionStorage.removeItem('intendedRoute');
      // Don't navigate here, let the calling component handle it
    }
  };

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 [BusinessProvider] Fetching businesses...');
      const businessesData = await getBusinesses();
      console.log('✅ [BusinessProvider] Businesses fetched:', businessesData);
      setBusinesses(businessesData);
      
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Error fetching businesses:', error);
      setError(error.message || 'Không thể tải danh sách doanh nghiệp');
      
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách doanh nghiệp",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 [BusinessProvider] Refreshing businesses...');
      const businessesData = await getBusinesses();
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

  const selectBusiness = async (businessId: number) => {
    try {
      setIsLoading(true);
      console.log('🏢 [BusinessProvider] Selecting business ID:', businessId);
      
      // Get fresh business data
      const business = await getBusiness(businessId);
      console.log('✅ [BusinessProvider] Business selected:', business.name);
      
      setCurrentBusinessState(business);
      setSelectedBusinessId(business.id.toString());
      
      // Update businesses array if needed
      setBusinesses(prev => 
        prev.map(b => b.id === business.id ? business : b)
      );
      
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Error selecting business:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createBusiness = async (data: { name: string; description: string }) => {
    try {
      setIsLoading(true);
      console.log('🏗️ [BusinessProvider] Creating business:', data.name);
      
      const newBusiness = await createBusinessService(data);
      console.log('✅ [BusinessProvider] Business created:', newBusiness.name);
      
      // Add to businesses list and set as current
      setBusinesses(prev => [...prev, newBusiness]);
      setCurrentBusinessState(newBusiness);
      setSelectedBusinessId(newBusiness.id.toString());
      
      return newBusiness;
      
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Error creating business:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBusiness = async (businessId: number, data: { name: string; description: string }) => {
    try {
      setIsLoading(true);
      console.log('📝 [BusinessProvider] Updating business ID:', businessId);
      
      const updatedBusiness = await updateBusinessService(businessId, data);
      console.log('✅ [BusinessProvider] Business updated:', updatedBusiness.name);
      
      // Update businesses array
      setBusinesses(prev => 
        prev.map(b => b.id === businessId ? updatedBusiness : b)
      );
      
      // Update current business if it's the one being updated
      if (currentBusiness?.id === businessId) {
        setCurrentBusinessState(updatedBusiness);
      }
      
      return updatedBusiness;
      
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Error updating business:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCurrentBusiness = async () => {
    if (!currentBusiness) return;
    
    try {
      console.log('🔄 [BusinessProvider] Refreshing current business');
      const refreshedBusiness = await getBusiness(currentBusiness.id);
      setCurrentBusinessState(refreshedBusiness);
      
      // Update in businesses array too
      setBusinesses(prev => 
        prev.map(b => b.id === refreshedBusiness.id ? refreshedBusiness : b)
      );
      
    } catch (error: any) {
      console.error('❌ [BusinessProvider] Error refreshing current business:', error);
    }
  };

  const clearCurrentBusiness = () => {
    console.log('🏢 [BusinessProvider] Clearing current business');
    setCurrentBusinessState(null);
    localStorage.removeItem('selectedBusinessId');
    // Clear intended route as well
    sessionStorage.removeItem('intendedRoute');
    sessionStorage.removeItem('currentRoute');
  };

  const clearBusinessData = () => {
    console.log('🧹 [BusinessProvider] Clearing all business data');
    setCurrentBusinessState(null);
    setBusinesses([]);
    setError(null);
    setIsInitialized(false);
    localStorage.removeItem('selectedBusinessId');
    sessionStorage.removeItem('intendedRoute');
    sessionStorage.removeItem('currentRoute');
  };

  const value: BusinessContextType = {
    currentBusiness,
    businesses,
    isLoading,
    hasOwnBusiness,
    error,
    setCurrentBusiness,
    fetchBusinesses,
    selectBusiness,
    createBusiness,
    updateBusiness,
    refreshBusinesses,
    refreshCurrentBusiness,
    clearCurrentBusiness,
    clearBusinessData
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};
