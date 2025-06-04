
import { SalesManagement } from './pages/SalesManagement';

interface SalesModuleProps {
  onBackToModules: () => void;
}

export function SalesModule({ onBackToModules }: SalesModuleProps) {
  return <SalesManagement onBackToModules={onBackToModules} />;
}
