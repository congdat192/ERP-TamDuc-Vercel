import { usePermissions } from '@/hooks/usePermissions';
import { AccessDenied } from '@/components/auth/AccessDenied';

interface ProtectedHRRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
}

export function ProtectedHRRoute({ children, requiredPermission }: ProtectedHRRouteProps) {
  const { hasFeatureAccess } = usePermissions();

  if (!hasFeatureAccess(requiredPermission)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
