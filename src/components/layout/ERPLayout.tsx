
import { useState, useEffect } from 'react';
import { ERPMainSidebar } from './ERPMainSidebar';
import { Header } from './Header';
import { User, ERPModule } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, X } from 'lucide-react';

interface ERPLayoutProps {
  currentUser: User;
  currentModule: ERPModule;
  onModuleChange: (module: ERPModule) => void;
  onLogout: () => void;
  children: React.ReactNode;
  allowSidebarToggle?: boolean;
}

export function ERPLayout({
  currentUser,
  currentModule,
  onModuleChange,
  onLogout,
  children,
  allowSidebarToggle = true
}: ERPLayoutProps) {
  // Auto-hide sidebar for all modules except dashboard
  const [sidebarOpen, setSidebarOpen] = useState(currentModule === 'dashboard');

  // Update sidebar visibility when module changes
  useEffect(() => {
    setSidebarOpen(currentModule === 'dashboard');
  }, [currentModule]);

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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* ERP Main Sidebar */}
      <ERPMainSidebar 
        currentModule={currentModule}
        onModuleChange={onModuleChange}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Show menu button only when sidebar is hidden and not on dashboard */}
            {!sidebarOpen && currentModule !== 'dashboard' && allowSidebarToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSidebarToggle}
                className="flex items-center space-x-2"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            
            {/* Show back button only when not on dashboard */}
            {currentModule !== 'dashboard' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToModules}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Tổng Quan</span>
              </Button>
            )}
            
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
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
