import { useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { ERPModule, VoucherFeature } from '@/types/auth';

/**
 * Ultra-Simple Permissions Hook
 * - Owner/Admin (level <= 2): Full access to everything
 * - Other roles: Controlled by role level and own data only
 * - Permission codes are for UI display only, not enforced here
 */
export function usePermissions() {
  const { currentUser } = useAuth();

  // Check if user is Owner or Admin (role level <= 2)
  const isOwnerOrAdmin = useCallback((): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions?.features?.includes('full_access') ?? false;
  }, [currentUser]);

  // All permission checks bypass for Owner/Admin
  const hasPermission = useCallback((featureCode: string): boolean => {
    return isOwnerOrAdmin();
  }, [isOwnerOrAdmin]);

  const hasModuleAccess = useCallback((moduleCode: ERPModule): boolean => {
    return isOwnerOrAdmin();
  }, [isOwnerOrAdmin]);

  const hasFeatureAccess = useCallback((featureCode: string): boolean => {
    return isOwnerOrAdmin();
  }, [isOwnerOrAdmin]);

  const hasVoucherFeature = useCallback((feature: VoucherFeature): boolean => {
    return isOwnerOrAdmin();
  }, [isOwnerOrAdmin]);

  const canManageUsers = useCallback((): boolean => {
    return isOwnerOrAdmin();
  }, [isOwnerOrAdmin]);

  return {
    hasPermission,
    hasModuleAccess,
    hasFeatureAccess,
    hasVoucherFeature,
    canManageUsers,
    hasFullAccess: isOwnerOrAdmin, // For direct checks
  };
}
