
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ERPMainSidebar } from './ERPMainSidebar';
import { Header } from './Header';
import { User } from '@/types/auth';

interface ERPLayoutProps {
  currentUser: User;
  currentModule?: string; // Made optional since we'll derive from URL
  onModuleChange?: (module: any) => void; // Made optional
  onLogout?: () => void; // Made optional
  children: React.ReactNode;
}

export function ERPLayout({
  currentUser,
  children
}: ERPLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/erp':
        return 'Tổng Quan ERP';
      case '/customer':
        return 'Module Khách Hàng';
      case '/sales':
        return 'Module Hóa Đơn';
      case '/voucher':
        return 'Module Voucher';
      case '/warehouse':
        return 'Module Kho Hàng';
      case '/accounting':
        return 'Module Kế Toán';
      case '/admin/settings':
        return 'Cài Đặt Hệ Thống';
      case '/admin/users':
        return 'Quản Lý Người Dùng';
      case '/admin/audit':
        return 'Nhật Ký Hệ Thống';
      case '/admin/roles':
        return 'Phân Quyền';
      default:
        return 'ERP System';
    }
  };

  // For voucher, customers, and sales modules, don't render the main sidebar since they have their own layout
  if (location.pathname === '/voucher' || location.pathname === '/customer' || location.pathname === '/sales') {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <ERPMainSidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPage={getPageTitle()}
          onPageChange={() => {}} // Not used in routing mode
          onLogout={() => {}} // Handled by sidebar
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
