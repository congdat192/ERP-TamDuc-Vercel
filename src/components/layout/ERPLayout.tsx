
import { useState } from 'react';
import { ERPMainSidebar } from './ERPMainSidebar';
import { Header } from './Header';
import { User, ERPModule } from '@/types/auth';

interface ERPLayoutProps {
  currentUser: User;
  currentModule: ERPModule;
  onModuleChange: (module: ERPModule) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function ERPLayout({
  currentUser,
  currentModule,
  onModuleChange,
  onLogout,
  children
}: ERPLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getPageTitle = () => {
    if (currentModule === 'dashboard') {
      return 'Tổng Quan ERP';
    }
    
    if (currentModule === 'voucher') {
      return 'Module Voucher';
    }

    const moduleTitles = {
      customers: 'Khách Hàng',
      sales: 'Bán Hàng',
      inventory: 'Kho Hàng',
      accounting: 'Kế Toán',
      hr: 'Nhân Sự',
      voucher: 'Module Voucher',
      'system-settings': 'Cài Đặt Hệ Thống',
      'user-management': 'Quản Lý Người Dùng'
    };
    
    return moduleTitles[currentModule as keyof typeof moduleTitles] || 'ERP System';
  };

  // For voucher module, don't render the main sidebar since VoucherModule has its own layout
  if (currentModule === 'voucher') {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <ERPMainSidebar 
        currentModule={currentModule}
        onModuleChange={onModuleChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPage={getPageTitle()}
          onPageChange={() => {}} // Not used in ERP mode
          onLogout={onLogout}
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
