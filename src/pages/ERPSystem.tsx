
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { LoginPage } from './LoginPage';
import { ERPHome } from './ERPHome';
import { CustomerPage } from './CustomerPage';
import { SalesPage } from './SalesPage';
import { VoucherPage } from './VoucherPage';
import { ERPLayout } from '@/components/layout/ERPLayout';
import { ERPModule } from '@/types/auth';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function ERPSystem() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [currentModule, setCurrentModule] = useState<ERPModule>('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <LoginPage />;
  }

  // Check if user is platform admin - redirect them to platform admin
  if (currentUser.role === 'platform-admin') {
    navigate('/platformadmin');
    return null;
  }

  // Update current module based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/Dashboard')) {
      setCurrentModule('dashboard');
    } else if (path.includes('/Customers')) {
      setCurrentModule('customers');
    } else if (path.includes('/Invoices')) {
      setCurrentModule('sales');
    } else if (path.includes('/Voucher')) {
      setCurrentModule('voucher');
    } else if (path.includes('/Products')) {
      setCurrentModule('inventory');
    } else if (path.includes('/Setting')) {
      setCurrentModule('system-settings');
    }
  }, [location.pathname]);

  const handleModuleChange = (module: ERPModule) => {
    setCurrentModule(module);
    
    // Navigate to the correct URL based on module
    switch (module) {
      case 'dashboard':
        navigate('/ERP/Dashboard', { replace: true });
        break;
      case 'customers':
        navigate('/ERP/Customers', { replace: true });
        break;
      case 'sales':
        navigate('/ERP/Invoices', { replace: true });
        break;
      case 'voucher':
        navigate('/ERP/Voucher', { replace: true });
        break;
      case 'inventory':
        navigate('/ERP/Products', { replace: true });
        break;
      case 'system-settings':
        navigate('/ERP/Setting', { replace: true });
        break;
      default:
        navigate('/ERP/Dashboard', { replace: true });
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ERP/Dashboard" replace />} />
      <Route 
        path="/Dashboard" 
        element={
          <ERPLayout
            currentUser={currentUser}
            currentModule="dashboard"
            onModuleChange={handleModuleChange}
            onLogout={logout}
          >
            <ERPHome currentUser={currentUser} onModuleChange={handleModuleChange} />
          </ERPLayout>
        } 
      />
      <Route 
        path="/Customers" 
        element={<CustomerPage onBackToERP={() => navigate('/ERP/Dashboard')} />} 
      />
      <Route 
        path="/Invoices" 
        element={<SalesPage onBackToERP={() => navigate('/ERP/Dashboard')} />} 
      />
      <Route 
        path="/Products" 
        element={
          <ERPLayout
            currentUser={currentUser}
            currentModule="inventory"
            onModuleChange={handleModuleChange}
            onLogout={logout}
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>
              <p>Module đang được phát triển...</p>
            </div>
          </ERPLayout>
        } 
      />
      <Route 
        path="/Voucher" 
        element={<VoucherPage onBackToERP={() => navigate('/ERP/Dashboard')} />} 
      />
      <Route 
        path="/Setting" 
        element={
          <ERPLayout
            currentUser={currentUser}
            currentModule="system-settings"
            onModuleChange={handleModuleChange}
            onLogout={logout}
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold">Cài Đặt Hệ Thống</h1>
              <p>Module đang được phát triển...</p>
            </div>
          </ERPLayout>
        } 
      />
    </Routes>
  );
}
