import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { AccessDenied } from './AccessDenied';

interface FeatureProtectedRouteProps {
  children: ReactNode;
  requiredFeature?: string; // Feature code: 'view_employees', 'create_vouchers'...
  requireFullAccess?: boolean; // Owner-only routes
  fallback?: ReactNode;
}

/**
 * PHASE 3: Feature-Level Protected Route
 * 
 * Usage:
 * <FeatureProtectedRoute requiredFeature="view_vouchers">
 *   <VoucherPage />
 * </FeatureProtectedRoute>
 * 
 * <FeatureProtectedRoute requireFullAccess>
 *   <RolesPage />
 * </FeatureProtectedRoute>
 */
export function FeatureProtectedRoute({ 
  children, 
  requiredFeature,
  requireFullAccess = false,
  fallback
}: FeatureProtectedRouteProps) {
  const { hasFeatureAccess, hasFullAccess } = usePermissions();
  
  // Check Owner-only routes
  if (requireFullAccess && !hasFullAccess()) {
    return fallback || <AccessDenied />;
  }
  
  // Check feature-level permissions
  if (requiredFeature && !hasFullAccess() && !hasFeatureAccess(requiredFeature)) {
    return fallback || <AccessDenied />;
  }
  
  return <>{children}</>;
}
