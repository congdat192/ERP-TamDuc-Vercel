
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/pages/Dashboard';
import { CustomerPage } from '@/pages/CustomerPage';
import { SalesPage } from '@/pages/SalesPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { InvoiceDetailPage } from '@/pages/InvoiceDetailPage';
import { MarketingPage } from '@/pages/MarketingPage';
import { VoucherPage } from '@/pages/VoucherPage';
import { AffiliatePage } from '@/pages/AffiliatePage';
import { Settings } from '@/modules/admin/pages/Settings';
import { SystemSettings } from '@/modules/admin/pages/SystemSettings';
import { AuditLog } from '@/modules/admin/pages/AuditLog';
import { RolePermissions } from '@/modules/admin/pages/RolePermissions';
import { UserManagement } from '@/modules/admin/pages/UserManagement';
import { UserProfilePage } from '@/pages/UserProfilePage';
import { InvitationManagementPage } from './InvitationManagementPage';
import { NotFound } from '@/pages/NotFound';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ModuleEmptyStateProps {
  module: string;
  onBackToDashboard: () => void;
}

const ModuleEmptyState: React.FC<ModuleEmptyStateProps> = ({ module, onBackToDashboard }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Tính năng chưa phát triển</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Module <b>{module}</b> đang trong quá trình phát triển.
            </p>
            <Button onClick={onBackToDashboard}>
              Quay lại Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple topbar component
const Topbar: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => {
  return (
    <div className="bg-white border-b px-4 py-3 flex items-center">
      <Button variant="ghost" size="sm" onClick={onSidebarToggle}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>
      <h1 className="ml-4 font-semibold">ERP System</h1>
    </div>
  );
};

export function ERPHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không thể tải thông tin người dùng</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Về Trang Đăng Nhập
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Convert user role to sidebar compatible format
  const sidebarUser = {
    username: currentUser.username,
    role: currentUser.role === 'erp-admin' ? 'admin' as const : 'telesales' as const,
    fullName: currentUser.fullName
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        {isSidebarOpen && (
          <Sidebar
            onLogout={handleLogout}
            currentUser={sidebarUser}
            location={location}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <Topbar onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<CustomerPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="marketing" element={<MarketingPage />} />
              <Route path="voucher/*" element={<VoucherPage />} />
              <Route path="affiliate/*" element={<AffiliatePage />} />
              <Route path="user-management/*" element={<InvitationManagementPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="settings/*" element={<Settings />} />
              <Route path="system-settings" element={<SystemSettings />} />
              <Route path="audit-log" element={<AuditLog />} />
              <Route path="role-permissions" element={<RolePermissions />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="accounting" element={<ModuleEmptyState module="accounting" onBackToDashboard={() => navigate('/erp/dashboard')} />} />
              <Route path="hr" element={<ModuleEmptyState module="hr" onBackToDashboard={() => navigate('/erp/dashboard')} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
