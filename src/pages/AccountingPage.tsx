
import { AccountingModule } from '@/modules/accounting';
import { useAuth } from '@/components/auth/AuthContext';

export function AccountingPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <AccountingModule 
      currentUser={currentUser} 
      onBackToModules={() => {}} // Navigation will be handled by React Router
    />
  );
}
