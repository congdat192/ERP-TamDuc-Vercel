import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';

// This component is no longer needed since we moved routing to App.tsx
// But keeping it for backward compatibility - it just redirects to Dashboard
export function ERPSystem() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is platform admin - redirect them to platform admin
  if (currentUser.role === 'platform-admin') {
    return <Navigate to="/platformadmin" replace />;
  }

  // Redirect to Dashboard by default
  return <Navigate to="/ERP/Dashboard" replace />;
}
