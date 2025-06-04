
import { CustomerManagement } from './pages/CustomerManagement';

interface CustomerModuleProps {
  onBackToModules: () => void;
}

export function CustomerModule({ onBackToModules }: CustomerModuleProps) {
  return <CustomerManagement onBackToModules={onBackToModules} />;
}
