
import { User } from '@/types/auth';
import { ModuleEmptyState } from '@/components/pages/ModuleEmptyState';

interface WarehouseModuleProps {
  currentUser: User;
  onBackToModules: () => void;
}

export function WarehouseModule({ currentUser, onBackToModules }: WarehouseModuleProps) {
  return (
    <ModuleEmptyState 
      module="inventory" 
      onBackToDashboard={onBackToModules}
    />
  );
}
