
import { useState } from 'react';
import { ERPMainSidebar } from './ERPMainSidebar';
import { Header } from './Header';
import { User, ERPModule } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ERPLayoutProps {
  currentUser: User;
  currentModule: ERPModule;
  onModuleChange: (module: ERPModule) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

// Configuration for modules that should hide the sidebar
const SIDEBAR_HIDDEN_MODULES: ERPModule[] = ['voucher'];

export function ERPLayout({
  currentUser,
  currentModule,
  onModuleChange,
  onLogout,
  children
}: ERPLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Check if current module should hide sidebar
  const shouldHideSidebar = SIDEBAR_HIDDEN_MODULES.includes(currentModule);

  const getPageTitle = () => {
    const moduleTitles = {
      dashboard: 'Tổng Quan ERP',
      customers: 'Khách Hàng',
      sales: 'Hóa Đơn',
      inventory: 'Sản Phẩm',
      accounting: 'Kế Toán',
      hr: 'Nhân Sự',
      voucher: 'Voucher',
      'system-settings': 'Cài Đặt Hệ Thống',
      'user-management': 'Quản Lý Người Dùng',
      'security-settings': 'Cài Đặt Bảo Mật'
    };
    
    return moduleTitles[currentModule as keyof typeof moduleTitles] || 'ERP System';
  };

  const handleBackToModules = () => {
    onModuleChange('dashboard');
  };

  // Full-width layout for modules that hide sidebar
  if (shouldHideSidebar) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col w-full">
        {/* Simple header for full-width modules */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToModules}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Module</span>
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {currentUser.fullName}
            </span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Đăng xuất
            </Button>
          </div>
        </div>
        
        {/* Full-width content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  // Standard layout with sidebar
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
