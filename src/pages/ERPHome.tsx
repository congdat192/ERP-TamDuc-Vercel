import { useState, useEffect } from 'react';
import { Dashboard } from '@/modules/dashboard/pages/Dashboard';
import { CustomerModule } from '@/modules/customer';
import { SalesModule } from '@/modules/sales';
import { InventoryModule } from '@/modules/inventory';
import { VoucherModule } from '@/modules/voucher';
import { MarketingModule } from '@/modules/marketing';
import { UserManagementModule } from '@/modules/user-management';
import { AdminModule } from '@/modules/admin';
import { ModuleEmptyState } from '@/components/layout/ModuleEmptyState';
import { useAuth } from '@/hooks/useAuth';
import { AffiliateModule } from '@/modules/affiliate';

export function ERPHome() {
  const { currentUser } = useAuth();
  const [currentModule, setCurrentModule] = useState<string>('dashboard');

  useEffect(() => {
    const storedModule = localStorage.getItem('currentModule');
    if (storedModule) {
      setCurrentModule(storedModule);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentModule', currentModule);
  }, [currentModule]);

  const handleModuleChange = (module: string) => {
    setCurrentModule(module);
  };

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerModule />;
      case 'sales':
        return <SalesModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'voucher':
        return <VoucherModule currentUser={currentUser} />;
      case 'affiliate':
        return <AffiliateModule />;
      case 'marketing':
        return <MarketingModule />;
      case 'user-management':
        return <UserManagementModule />;
      case 'system-settings':
        return <AdminModule />;
      default:
        return <ModuleEmptyState module={currentModule} />;
    }
  };

  return (
    <div>
      {renderModuleContent()}
    </div>
  );
}
