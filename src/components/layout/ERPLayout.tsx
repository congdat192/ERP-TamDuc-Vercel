
import { useState } from 'react';
import { UnifiedSidebar } from './UnifiedSidebar';
import { Header } from './Header';
import { User, ERPModule } from '@/types/auth';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { getIconComponent } from '@/lib/icons';

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

  // For customer module, don't render the main sidebar since CustomerModule has its own layout  
  if (currentModule === 'customers') {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        {children}
      </div>
    );
  }

  const allowedModules = MODULE_PERMISSIONS.filter(module => 
    currentUser.permissions.modules.includes(module.module)
  );

  const sidebarItems = allowedModules.map((module) => {
    const IconComponent = getIconComponent(module.icon);
    return {
      id: module.module,
      label: module.label,
      icon: IconComponent,
      onClick: () => onModuleChange(module.module),
      isActive: currentModule === module.module
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <UnifiedSidebar
        title="ERP System"
        subtitle="Hệ thống quản lý tổng hợp"
        items={sidebarItems}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onSidebarToggle={() => {}} // Not used with unified sidebar
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
