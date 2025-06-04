
import { WarehouseModule } from '@/modules/warehouse';
import { useAuth } from '@/components/auth/AuthContext';

export function WarehousePage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <WarehouseModule 
      currentUser={currentUser} 
      onBackToModules={() => {}} // Navigation will be handled by React Router
    />
  );
}
