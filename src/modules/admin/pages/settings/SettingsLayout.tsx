
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

// Settings menu structure với URL mapping
const settingsMenuStructure = [
  {
    id: 'general',
    label: 'Thông Tin Chung',
    url: '/ERP/Setting/General',
    type: 'single' as const
  },
  {
    id: 'api',
    label: 'API Keys & Webhooks',
    url: '/ERP/Setting/API',
    type: 'single' as const
  },
  {
    id: 'integrations',
    label: 'Tích Hợp Bên Thứ 3',
    url: '/ERP/Setting/Integrations',
    type: 'single' as const
  },
  {
    id: 'security',
    label: 'Bảo Mật',
    url: '/ERP/Setting/Security',
    type: 'single' as const
  },
  {
    id: 'notifications',
    label: 'Thông Báo',
    url: '/ERP/Setting/Notifications',
    type: 'single' as const
  },
  {
    id: 'appearance',
    label: 'Giao Diện & Thương Hiệu',
    url: '/ERP/Setting/Appearance',
    type: 'single' as const
  }
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Xác định trang hiện tại từ URL
  const getCurrentPage = () => {
    const currentPath = location.pathname;
    const menuItem = settingsMenuStructure.find(item => item.url === currentPath);
    return menuItem?.id || 'general';
  };

  const getCurrentPageLabel = () => {
    const currentPath = location.pathname;
    const menuItem = settingsMenuStructure.find(item => item.url === currentPath);
    return menuItem?.label || 'Cài Đặt Hệ Thống';
  };

  const handleMenuItemClick = (url: string) => {
    navigate(url);
    setSidebarOpen(false);
  };

  const currentPage = getCurrentPage();

  return (
    <div className="flex h-full">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Settings Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 theme-card border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b theme-border">
            <h2 className="text-lg font-semibold theme-text">Cài Đặt Hệ Thống</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden theme-text hover:theme-bg-primary/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {settingsMenuStructure.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left h-11 transition-all duration-200",
                    currentPage === item.id 
                      ? "theme-bg-primary text-white border-r-2 theme-border-primary font-medium" 
                      : "theme-text hover:theme-bg-primary/10 hover:theme-text-primary"
                  )}
                  onClick={() => handleMenuItemClick(item.url)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t theme-border">
            <p className="text-xs theme-text-muted">
              Hướng dẫn cài đặt hệ thống và tài liệu hỗ trợ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Breadcrumb */}
        <div className="lg:hidden flex items-center p-4 border-b theme-border theme-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="theme-text"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="ml-2">
            <h1 className="text-lg font-semibold theme-text">Cài Đặt</h1>
            <p className="text-sm theme-text-muted">{getCurrentPageLabel()}</p>
          </div>
        </div>

        {/* Desktop Breadcrumb */}
        <div className="hidden lg:block p-6 border-b theme-border theme-card">
          <div className="flex items-center space-x-2 text-sm theme-text-muted mb-2">
            <span>Cài Đặt Hệ Thống</span>
            <span>/</span>
            <span className="theme-text font-medium">{getCurrentPageLabel()}</span>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto theme-background">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
