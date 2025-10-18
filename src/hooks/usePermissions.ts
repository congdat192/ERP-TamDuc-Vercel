import { useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { ERPModule, VoucherFeature } from '@/types/auth';

export function usePermissions() {
  const { currentUser } = useAuth();
  
  const hasPermission = useCallback((featureCode: string): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass - check for full_access feature or admin role
    const hasFullAccess = currentUser.permissions?.features?.includes('full_access');
    if (hasFullAccess) return true;
    
    // Check specific feature permission
    return currentUser.permissions?.features?.includes(featureCode) ?? false;
  }, [currentUser]);
  
  const hasModuleAccess = useCallback((moduleCode: ERPModule): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass
    const hasFullAccess = currentUser.permissions?.features?.includes('full_access');
    if (hasFullAccess) return true;
    
    // Check if module is in user's permissions
    return currentUser.permissions.modules.includes(moduleCode);
  }, [currentUser]);
  
  const hasFeatureAccess = useCallback((featureCode: string): boolean => {
    return hasPermission(featureCode);
  }, [hasPermission]);
  
  const hasVoucherFeature = useCallback((feature: VoucherFeature): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass
    const hasFullAccess = currentUser.permissions?.features?.includes('full_access');
    if (hasFullAccess) return true;
    
    return currentUser.permissions.voucherFeatures.includes(feature);
  }, [currentUser]);
  
  const canManageUsers = useCallback((): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass
    const hasFullAccess = currentUser.permissions?.features?.includes('full_access');
    if (hasFullAccess) return true;
    
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
