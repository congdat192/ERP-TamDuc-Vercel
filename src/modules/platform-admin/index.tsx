
import React, { useState } from 'react';
import { PlatformAdminLayout } from './components/PlatformAdminLayout';
import { PlatformAdminDashboard } from './pages/Dashboard';
import { TenantManagement } from './pages/TenantManagement';
import { AuditLogs } from './pages/AuditLogs';
import { SupportTickets } from './pages/SupportTickets';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-states';
import { Settings, Activity, Users, CreditCard } from 'lucide-react';

export function PlatformAdmin() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <PlatformAdminDashboard />;
      case 'tenants':
        return <TenantManagement />;
      case 'audit-logs':
        return <AuditLogs />;
      case 'support':
        return <SupportTickets />;
      case 'billing':
        return (
          <EnhancedEmptyState
            variant="custom"
            title="Quản Lý Thanh Toán"
            description="Tính năng quản lý thanh toán và hóa đơn sẽ được triển khai trong phiên bản tiếp theo."
            actionLabel="Quay Lại Dashboard"
            onAction={() => setCurrentPage('dashboard')}
          >
            <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
          </EnhancedEmptyState>
        );
      case 'system-health':
        return (
          <EnhancedEmptyState
            variant="custom"
            title="Giám Sát Hệ Thống"
            description="Tính năng giám sát chi tiết tình trạng hệ thống sẽ được triển khai trong phiên bản tiếp theo."
            actionLabel="Quay Lại Dashboard"
            onAction={() => setCurrentPage('dashboard')}
          >
            <Activity className="w-12 h-12 text-gray-400 mb-4" />
          </EnhancedEmptyState>
        );
      case 'admin-users':
        return (
          <EnhancedEmptyState
            variant="custom"
            title="Quản Lý Admin Users"
            description="Tính năng quản lý người dùng admin sẽ được triển khai trong phiên bản tiếp theo."
            actionLabel="Quay Lại Dashboard"
            onAction={() => setCurrentPage('dashboard')}
          >
            <Users className="w-12 h-12 text-gray-400 mb-4" />
          </EnhancedEmptyState>
        );
      case 'settings':
        return (
          <EnhancedEmptyState
            variant="custom"
            title="Cài Đặt Nền Tảng"
            description="Tính năng cài đặt nền tảng sẽ được triển khai trong phiên bản tiếp theo."
            actionLabel="Quay Lại Dashboard"
            onAction={() => setCurrentPage('dashboard')}
          >
            <Settings className="w-12 h-12 text-gray-400 mb-4" />
          </EnhancedEmptyState>
        );
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
