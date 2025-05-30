
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { SettingsCategory, SettingsMenuItem } from '../../types/settings';
import { GeneralInfo } from './GeneralInfo';
import { EmailSettings } from './EmailSettings';
import { SecuritySettings } from './SecuritySettings';
import { ApiIntegration } from './ApiIntegration';
import { BackupRestore } from './BackupRestore';
import { FeaturesPlans } from './FeaturesPlans';

const settingsMenuItems: SettingsMenuItem[] = [
  { id: 'general-info', label: 'Thông Tin Chung', icon: 'Building2' },
  { id: 'email', label: 'Email', icon: 'Mail' },
  { id: 'security', label: 'Bảo Mật', icon: 'Shield' },
  { id: 'api-integration', label: 'API & Kết Nối', icon: 'Link' },
  { id: 'backup-restore', label: 'Sao Lưu & Khôi Phục', icon: 'Database' },
  { id: 'features-plans', label: 'Tính Năng & Gói Dịch Vụ', icon: 'Crown' }
];

export function SettingsLayout() {
  const [currentCategory, setCurrentCategory] = useState<SettingsCategory>('general-info');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSettingsPage = () => {
    switch (currentCategory) {
      case 'general-info':
        return <GeneralInfo />;
      case 'email':
        return <EmailSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'api-integration':
        return <ApiIntegration />;
      case 'backup-restore':
        return <BackupRestore />;
      case 'features-plans':
        return <FeaturesPlans />;
      default:
        return <GeneralInfo />;
    }
  };

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
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Cài Đặt Hệ Thống</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Settings Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {settingsMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentCategory === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left h-11",
                    currentCategory === item.id 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => {
                    setCurrentCategory(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold text-gray-900">Cài Đặt</h1>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderSettingsPage()}
          </div>
        </div>
      </div>
    </div>
  );
}
