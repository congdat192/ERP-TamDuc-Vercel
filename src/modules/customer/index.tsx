
import { CustomerManagement } from './pages/CustomerManagement';

interface CustomerModuleProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function CustomerModule({ currentUser, onBackToModules }: CustomerModuleProps) {
  return (
    <div className="flex-1 overflow-auto">
      <CustomerManagement currentUser={currentUser} onBackToModules={onBackToModules} />
    </div>
  );
}
