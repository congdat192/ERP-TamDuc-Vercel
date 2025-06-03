
import { useEffect } from 'react';
import { CustomerManagement } from './pages/CustomerManagement';

interface CustomerModuleProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function CustomerModule({ currentUser, onBackToModules }: CustomerModuleProps) {
  // Auto-collapse sidebar when entering customer module
  useEffect(() => {
    const sidebarToggle = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
    if (sidebarToggle) {
      sidebarToggle.click();
    }
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <CustomerManagement currentUser={currentUser} onBackToModules={onBackToModules} />
    </div>
  );
}
