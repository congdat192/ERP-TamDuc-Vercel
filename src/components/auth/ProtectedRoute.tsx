
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ERPModule } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredModule?: ERPModule;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredModule, requiredRole }: ProtectedRouteProps) {
  const { isLoggedIn, currentUser } = useAuth();
  const location = useLocation();

  if (!isLoggedIn || !currentUser) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required module access
  if (requiredModule && !currentUser.permissions.modules.includes(requiredModule)) {
    return <Navigate to="/403" replace />;
  }

  // Check if user has required role
  if (requiredRole && !requiredRole.includes(currentUser.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
