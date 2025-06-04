
import { CustomerModule } from '@/modules/customer';
import { useAuth } from '@/components/auth/AuthContext';

export function CustomerPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <CustomerModule 
      currentUser={currentUser} 
      onBackToModules={() => {}} // Navigation will be handled by React Router
    />
  );
}
