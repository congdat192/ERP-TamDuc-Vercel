import { useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { ERPModule, VoucherFeature } from '@/types/auth';

export function usePermissions() {
  const { currentUser } = useAuth();
  
  const hasPermission = useCallback((featureCode: string): boolean => {
    if (!currentUser) return false;
    
    // Check if user has this specific permission
    return true; // Placeholder - actual permission check will be in AuthContext
  }, [currentUser]);
  
  const hasModuleAccess = useCallback((moduleCode: ERPModule): boolean => {
    if (!currentUser) return false;
    
    // Check if module is in user's permissions
    return currentUser.permissions.modules.includes(moduleCode);
  }, [currentUser]);
  
  const hasFeatureAccess = useCallback((featureCode: string): boolean => {
    return hasPermission(featureCode);
  }, [hasPermission]);
  
  const hasVoucherFeature = useCallback((feature: VoucherFeature): boolean => {
    if (!currentUser) return false;
    
    return currentUser.permissions.voucherFeatures.includes(feature);
  }, [currentUser]);
  
  const canManageUsers = useCallback((): boolean => {
    if (!currentUser) return false;
    
    return currentUser.permissions.canManageUsers;
  }, [currentUser]);
  
  return { 
    hasPermission, 
    hasModuleAccess,
    hasFeatureAccess,
    hasVoucherFeature,
    canManageUsers
  };
}
