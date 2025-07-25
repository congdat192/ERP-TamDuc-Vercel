
import { InventoryManagement } from './pages/InventoryManagement';

export function InventoryModule({ currentUser, onBackToModules }: any) {
  return <InventoryManagement currentUser={currentUser} onBackToModules={onBackToModules} />;
}
