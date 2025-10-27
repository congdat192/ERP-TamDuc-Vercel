
import { useState, useEffect } from 'react';
import { ERPMainSidebar } from './ERPMainSidebar';
import { Header } from './Header';
import { User, ERPModule } from '@/types/auth';

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
  // Sidebar luôn hiển thị, trạng thái mặc định là mở rộng
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // Load trạng thái sidebar từ localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('erp-sidebar-expanded');
    if (savedState !== null) {
      setSidebarExpanded(JSON.parse(savedState));
    }
  }, []);

  // Lưu trạng thái sidebar vào localStorage
  useEffect(() => {
    localStorage.setItem('erp-sidebar-expanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  const getPageTitle = () => {
    const moduleTitles = {
      dashboard: 'Tổng Quan ERP',
      customers: 'Khách Hàng',
      sales: 'Hóa Đơn',
      inventory: 'Sản Phẩm',
      accounting: 'Kế Toán',
      hr: 'Nhân Sự',
      marketing: 'Marketing',
      operations: 'Vận Hành',
      affiliate: 'Affiliate',
      'system-settings': 'Cài Đặt Hệ Thống',
      'user-management': 'Quản Lý Người Dùng',
      'security-settings': 'Cài Đặt Bảo Mật'
    };
    
    return moduleTitles[currentModule as keyof typeof moduleTitles] || 'ERP System';
  };

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleMobileSidebarToggle = () => {
    setSidebarMobileOpen(!sidebarMobileOpen);
  };

  // Keyboard shortcut (Ctrl+B) để toggle sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        handleSidebarToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* ERP Main Sidebar - Luôn hiển thị */}
      <ERPMainSidebar 
        currentModule={currentModule}
        onModuleChange={onModuleChange}
        isExpanded={sidebarExpanded}
        isMobileOpen={sidebarMobileOpen}
        onToggle={handleSidebarToggle}
        onMobileToggle={handleMobileSidebarToggle}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header - Luôn cố định */}
        <Header
          onSidebarToggle={handleMobileSidebarToggle}
          currentPage={getPageTitle()}
          onPageChange={() => {}}
          onLogout={onLogout}
          currentUser={currentUser}
        />
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
