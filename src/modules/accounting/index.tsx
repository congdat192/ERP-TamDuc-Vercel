
import { User } from '@/types/auth';
import { ModuleEmptyState } from '@/components/pages/ModuleEmptyState';

interface AccountingModuleProps {
  currentUser: User;
  onBackToModules: () => void;
}

export function AccountingModule({ currentUser, onBackToModules }: AccountingModuleProps) {
  return (
    <ModuleEmptyState 
      module="accounting" 
      onBackToDashboard={onBackToModules}
    />
  );
}
