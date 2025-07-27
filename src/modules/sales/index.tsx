
import { SalesManagement } from './pages/SalesManagement';

interface SalesModuleProps {
  currentUser?: any;
  onBackToModules: () => void;
}

export function SalesModule({ currentUser, onBackToModules }: SalesModuleProps) {
  return <SalesManagement currentUser={currentUser} onBackToModules={onBackToModules} />;
}
