
import React, { useState } from 'react';
import { PlatformAdminLayout } from './components/PlatformAdminLayout';
import { PlatformAdminDashboard } from './pages/Dashboard';
import { TenantManagement } from './pages/TenantManagement';
import { ModuleLicensing } from './pages/ModuleLicensing';
import { SystemLogs } from './pages/SystemLogs';
import { PlatformAdminUsers } from './pages/PlatformAdminUsers';

export function PlatformAdmin() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <PlatformAdminDashboard />;
      case 'tenants':
        return <TenantManagement />;
      case 'licensing':
        return <ModuleLicensing />;
      case 'logs':
        return <SystemLogs />;
      case 'admin-users':
        return <PlatformAdminUsers />;
      default:
        return <PlatformAdminDashboard />;
    }
  };

  return (
    <PlatformAdminLayout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
    >
      {renderPage()}
    </PlatformAdminLayout>
  );
}
