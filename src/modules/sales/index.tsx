
import { SalesManagement } from './pages/SalesManagement';

interface SalesModuleProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function SalesModule({ currentUser, onBackToModules }: SalesModuleProps) {
  return (
    <div className="flex-1 overflow-auto">
      <SalesManagement currentUser={currentUser} onBackToModules={onBackToModules} />
    </div>
  );
}
