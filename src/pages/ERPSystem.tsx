
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { LoginPage } from '@/components/pages/LoginPage';
import { ERPHome } from './ERPHome';
import { CustomerPage } from './CustomerPage';
import { SalesPage } from './SalesPage';
import { VoucherPage } from './VoucherPage';
import { ERPLayout } from '@/components/layout/ERPLayout';
import { ERPModule } from '@/types/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ERPSystem() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [currentModule, setCurrentModule] = useState<ERPModule>('dashboard');
  const navigate = useNavigate();

  if (!isAuthenticated || !currentUser) {
    return <LoginPage />;
  }

  // Check if user is platform admin - redirect them to platform admin
  if (currentUser.role === 'platform-admin') {
    navigate('/platformadmin');
    return null;
  }

  const handleModuleChange = (module: ERPModule) => {
    setCurrentModule(module);
    
    // Navigate to the correct URL based on module
    switch (module) {
      case 'dashboard':
        navigate('/ERP/Dashboard');
        break;
      case 'customers':
        navigate('/ERP/Customers');
        break;
      case 'sales':
        navigate('/ERP/Invoices');
        break;
      case 'voucher':
        navigate('/ERP/Voucher');
        break;
      case 'inventory':
        navigate('/ERP/Products');
        break;
      case 'system-settings':
        navigate('/ERP/Setting');
        break;
      default:
        navigate('/ERP/Dashboard');
    }
  };

  return (
    <ERPLayout
      currentUser={currentUser}
      currentModule={currentModule}
      onModuleChange={handleModuleChange}
      onLogout={logout}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/ERP/Dashboard" replace />} />
        <Route path="/Dashboard" element={<ERPHome currentUser={currentUser} onModuleChange={handleModuleChange} />} />
        <Route path="/Customers" element={<CustomerPage onBackToERP={() => navigate('/ERP/Dashboard')} />} />
        <Route path="/Invoices" element={<SalesPage onBackToERP={() => navigate('/ERP/Dashboard')} />} />
        <Route path="/Products" element={<div className="p-6"><h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1><p>Module đang được phát triển...</p></div>} />
        <Route path="/Voucher" element={<VoucherPage onBackToERP={() => navigate('/ERP/Dashboard')} />} />
        <Route path="/Setting" element={<div className="p-6"><h1 className="text-2xl font-bold">Cài Đặt Hệ Thống</h1><p>Module đang được phát triển...</p></div>} />
      </Routes>
    </ERPLayout>
  );
}
