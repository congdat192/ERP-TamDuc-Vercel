
import { CustomerModule } from '@/modules/customer';
import { useAuth } from '@/components/auth/AuthContext';

interface CustomerPageProps {
  onBackToERP: () => void;
}

export function CustomerPage({ onBackToERP }: CustomerPageProps) {
  const { currentUser } = useAuth();
  
  return <CustomerModule currentUser={currentUser} onBackToModules={onBackToERP} />;
}
