
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { ERPLayout } from '@/components/layout/ERPLayout';
import { ERPModule } from '@/types/auth';

// Module Pages
import { Dashboard } from '@/components/pages/Dashboard';
import { CustomerPage } from '@/pages/CustomerPage';
import { SalesPage } from '@/pages/SalesPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { VoucherPage } from '@/pages/VoucherPage';
import { MarketingPage } from '@/pages/MarketingPage';
import { AffiliatePage } from '@/pages/AffiliatePage';
import { ModuleEmptyState } from '@/components/pages/ModuleEmptyState';

// Admin Pages
import { UserManagement } from '@/modules/admin/pages/UserManagement';
import { Settings } from '@/modules/admin/pages/Settings';

export function ERPHome() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract module from URL path
  const getModuleFromPath = (pathname: string): ERPModule => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 2 && segments[0] === 'ERP') {
      const moduleSegment = segments[1].toLowerCase();
      
      // Map URL segments to modules
      const moduleMap: Record<string, ERPModule> = {
        'dashboard': 'dashboard',
        'customers': 'customers',
        'sales': 'sales',
        'inventory': 'inventory',
        'accounting': 'accounting',
        'hr': 'hr',
        'voucher': 'voucher',
        'marketing': 'marketing',
        'affiliate': 'affiliate',
        'settings': 'system-settings',
        'users': 'user-management'
      };
      
      return moduleMap[moduleSegment] || 'dashboard';
    }
    return 'dashboard';
  };

  const [currentModule, setCurrentModule] = useState<ERPModule>(
    getModuleFromPath(location.pathname)
  );

  // Update current module when URL changes
  useEffect(() => {
    const newModule = getModuleFromPath(location.pathname);
    setCurrentModule(newModule);
  }, [location.pathname]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleModuleChange = (module: ERPModule) => {
    setCurrentModule(module);
    
    // Navigate to the appropriate URL
    const moduleRoutes: Record<ERPModule, string> = {
      'dashboard': '/ERP/Dashboard',
      'customers': '/ERP/Customers',
      'sales': '/ERP/Sales',
      'inventory': '/ERP/Inventory',
      'accounting': '/ERP/Accounting',
      'hr': '/ERP/HR',
      'voucher': '/ERP/Voucher',
      'marketing': '/ERP/Marketing',
      'affiliate': '/ERP/Affiliate',
      'system-settings': '/ERP/Settings',
      'user-management': '/ERP/Users'
    };
    
    navigate(moduleRoutes[module]);
  };

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerPage />;
      case 'sales':
        return <SalesPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'voucher':
        return <VoucherPage />;
      case 'marketing':
        return <MarketingPage />;
      case 'affiliate':
        return <AffiliatePage />;
      case 'user-management':
        return <UserManagement />;
      case 'system-settings':
        return <Settings />;
      case 'accounting':
        return <ModuleEmptyState module="accounting" />;
      case 'hr':
        return <ModuleEmptyState module="hr" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ERPLayout
      currentUser={currentUser}
      currentModule={currentModule}
      onModuleChange={handleModuleChange}
      onLogout={logout}
    >
      {renderModuleContent()}
    </ERPLayout>
  );
}
