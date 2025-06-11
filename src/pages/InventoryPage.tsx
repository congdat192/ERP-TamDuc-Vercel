
import { InventoryModule } from '@/modules/inventory';
import { useAuth } from '@/components/auth/AuthContext';

interface InventoryPageProps {
  onBackToERP?: () => void;
}

export function InventoryPage({ onBackToERP }: InventoryPageProps) {
  const { currentUser } = useAuth();
  
  return <InventoryModule currentUser={currentUser} onBackToModules={onBackToERP || (() => {})} />;
}
