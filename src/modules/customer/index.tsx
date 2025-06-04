
import { CustomerManagement } from './pages/CustomerManagement';

interface CustomerModuleProps {
  currentUser?: any;
  onBackToModules: () => void;
}

export function CustomerModule({ currentUser, onBackToModules }: CustomerModuleProps) {
  return <CustomerManagement currentUser={currentUser} onBackToModules={onBackToModules} />;
}
