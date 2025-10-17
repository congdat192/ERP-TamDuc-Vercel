import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission: string;
  fallback?: ReactNode;
  showError?: boolean;
}

export function PermissionGuard({ 
  children, 
  requiredPermission, 
  fallback,
  showError = true
}: PermissionGuardProps) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(requiredPermission)) {
    if (fallback) return <>{fallback}</>;
    
    if (!showError) return null;
    
    return (
      <Alert variant="destructive" className="my-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Bạn không có quyền truy cập tính năng này.
        </AlertDescription>
      </Alert>
    );
  }
  
  return <>{children}</>;
}
