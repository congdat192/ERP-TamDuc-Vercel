import { useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { ERPModule, VoucherFeature } from '@/types/auth';

/**
 * Hybrid Permissions Hook
 * - Owner/Admin (features includes 'full_access'): Full access bypass
 * - Custom roles: Check actual feature codes from database
 */
export function usePermissions() {
  const { currentUser } = useAuth();

  // Check if user is Owner or Admin (has 'full_access' feature)
  const isOwnerOrAdmin = useCallback((): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions?.features?.includes('full_access') ?? false;
  }, [currentUser]);

  // Check if user has a specific permission/feature
  const hasPermission = useCallback((featureCode: string): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass
    if (currentUser.permissions?.features?.includes('full_access')) return true;
    
    // Custom roles: check actual feature codes
    return currentUser.permissions?.features?.includes(featureCode) ?? false;
  }, [currentUser]);

  const hasModuleAccess = useCallback((moduleCode: ERPModule): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass
    if (currentUser.permissions?.features?.includes('full_access')) return true;
    
    // Custom roles: check modules array
    return currentUser.permissions?.modules?.includes(moduleCode) ?? false;
  }, [currentUser]);

  const hasFeatureAccess = useCallback((featureCode: string): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass
    if (currentUser.permissions?.features?.includes('full_access')) return true;
    
    // Custom roles: check actual feature codes
    return currentUser.permissions?.features?.includes(featureCode) ?? false;
  }, [currentUser]);

  const hasVoucherFeature = useCallback((feature: VoucherFeature): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass
    if (currentUser.permissions?.features?.includes('full_access')) return true;
    
    // Custom roles: check voucher features
    return currentUser.permissions?.voucherFeatures?.includes(feature) ?? false;
  }, [currentUser]);

  const canManageUsers = useCallback((): boolean => {
    if (!currentUser) return false;
    
    // Owner/Admin bypass
    if (currentUser.permissions?.features?.includes('full_access')) return true;
    
    // Custom roles: check specific permission
    return currentUser.permissions?.features?.includes('manage_users') ?? false;
  }, [currentUser]);

  return {
    hasPermission,
    hasModuleAccess,
    hasFeatureAccess,
    hasVoucherFeature,
    canManageUsers,
    hasFullAccess: isOwnerOrAdmin, // For direct checks
  };
}
