import { useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { ERPModule, VoucherFeature } from '@/types/auth';

export function usePermissions() {
  const { currentUser } = useAuth();
  const { currentBusiness } = useBusiness();
  
  const hasPermission = useCallback((featureCode: string): boolean => {
    if (!currentUser || !currentBusiness) return false;
    
    // Platform admin has all permissions
    if (currentUser.role === 'platform-admin') return true;
    
    // Business owner has all permissions in their business
    if (currentBusiness.is_owner) return true;
    
    // Check if user has this specific permission
    // Permissions are loaded from database and stored in currentUser.permissions
    return true; // Placeholder - actual permission check will be in AuthContext
  }, [currentUser, currentBusiness]);
  
  const hasModuleAccess = useCallback((moduleCode: ERPModule): boolean => {
    if (!currentUser) return false;
    
    // Platform admin has all access
    if (currentUser.role === 'platform-admin') return true;
    
    // Check if module is in user's permissions
    return currentUser.permissions.modules.includes(moduleCode);
  }, [currentUser]);
  
  const hasFeatureAccess = useCallback((featureCode: string): boolean => {
    return hasPermission(featureCode);
  }, [hasPermission]);
  
  const hasVoucherFeature = useCallback((feature: VoucherFeature): boolean => {
    if (!currentUser) return false;
    
    // Platform admin has all access
    if (currentUser.role === 'platform-admin') return true;
    
    return currentUser.permissions.voucherFeatures.includes(feature);
  }, [currentUser]);
  
  const canManageUsers = useCallback((): boolean => {
    if (!currentUser || !currentBusiness) return false;
    
    // Platform admin can manage users
    if (currentUser.role === 'platform-admin') return true;
    
    // Business owner can manage users
    if (currentBusiness.is_owner) return true;
    
    return currentUser.permissions.canManageUsers;
  }, [currentUser, currentBusiness]);
  
  return { 
    hasPermission, 
    hasModuleAccess,
    hasFeatureAccess,
    hasVoucherFeature,
    canManageUsers
  };
}
