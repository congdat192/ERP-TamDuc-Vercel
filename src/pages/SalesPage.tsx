
import { SalesModule } from '@/modules/sales';
import { useAuth } from '@/components/auth/AuthContext';

export function SalesPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <SalesModule 
      currentUser={currentUser} 
      onBackToModules={() => {}} // Navigation will be handled by React Router
    />
  );
}
