
import { SalesModule } from '@/modules/sales';
import { useAuth } from '@/components/auth/AuthContext';

interface SalesPageProps {
  onBackToERP: () => void;
}

export function SalesPage({ onBackToERP }: SalesPageProps) {
  const { currentUser } = useAuth();
  
  return <SalesModule currentUser={currentUser} onBackToModules={onBackToERP} />;
}
