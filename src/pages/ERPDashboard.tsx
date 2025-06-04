
import { ERPLayout } from '@/components/layout/ERPLayout';
import { ERPHome } from './ERPHome';
import { useAuth } from '@/components/auth/AuthContext';

export function ERPDashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <ERPLayout
      currentUser={currentUser}
      currentModule="dashboard"
      onModuleChange={() => {}} // Navigation will be handled by React Router
      onLogout={() => {}} // Logout will be handled by AuthContext
    >
      <ERPHome 
        currentUser={currentUser} 
        onModuleChange={() => {}} // Navigation will be handled by React Router
      />
    </ERPLayout>
  );
}
