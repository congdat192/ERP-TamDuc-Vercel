
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { SettingsCategory, SettingsMenuItem } from '../../types/settings';
import { GeneralInfo } from './GeneralInfo';
import { EmailSettings } from './EmailSettings';
import { SecuritySettings } from './SecuritySettings';
import { ApiIntegration } from './ApiIntegration';
import { BackupRestore } from './BackupRestore';
import { FeaturesPlans } from './FeaturesPlans';

// Settings menu structure with nested categories for scalability
const settingsMenuStructure = [
  {
    id: 'general-info',
    label: 'Thông Tin Chung',
    icon: 'Building2',
    type: 'single' as const
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'Mail',
    type: 'single' as const
  },
  {
    id: 'security',
    label: 'Bảo Mật',
    icon: 'Shield',
    type: 'single' as const
  },
  {
    id: 'api-integration',
    label: 'API & Kết Nối',
    icon: 'Link',
    type: 'expandable' as const,
    subItems: [
      { id: 'api-keys', label: 'API Keys' },
      { id: 'webhooks', label: 'Webhooks' },
      { id: 'third-party', label: 'Tích Hợp Bên Thứ 3' }
    ]
  },
  {
    id: 'backup-restore',
    label: 'Sao Lưu & Khôi Phục',
    icon: 'Database',
    type: 'single' as const
  },
  {
    id: 'features-plans',
    label: 'Tính Năng & Gói Dịch Vụ',
    icon: 'Crown',
    type: 'single' as const
  }
];

export function SettingsLayout() {
  const [currentCategory, setCurrentCategory] = useState<SettingsCategory>('general-info');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleMenuItemClick = (categoryId: SettingsCategory) => {
    setCurrentCategory(categoryId);
    setSidebarOpen(false);
  };

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

  const getCurrentCategoryLabel = () => {
    const findLabel = (items: typeof settingsMenuStructure): string => {
      for (const item of items) {
        if (item.id === currentCategory) {
          return item.label;
        }
        if (item.type === 'expandable' && item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.id === currentCategory) {
              return `${item.label} > ${subItem.label}`;
            }
          }
        }
      }
      return 'Cài Đặt Hệ Thống';
    };
    return findLabel(settingsMenuStructure);
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
      
      {/* Settings Sidebar with Accordion Navigation */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
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

          {/* Accordion Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {settingsMenuStructure.map((item) => {
                if (item.type === 'single') {
                  return (
                    <Button
                      key={item.id}
                      variant={currentCategory === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left h-11",
                        currentCategory === item.id 
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                      onClick={() => handleMenuItemClick(item.id as SettingsCategory)}
                    >
                      {item.label}
                    </Button>
                  );
                }

                // Expandable section with sub-items
                return (
                  <Collapsible
                    key={item.id}
                    open={expandedSections[item.id]}
                    onOpenChange={() => toggleSection(item.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant={currentCategory === item.id ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-between text-left h-11",
                          currentCategory === item.id 
                            ? "bg-blue-50 text-blue-700" 
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => {
                          if (!expandedSections[item.id]) {
                            handleMenuItemClick(item.id as SettingsCategory);
                          }
                        }}
                      >
                        <span>{item.label}</span>
                        {expandedSections[item.id] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-1">
                      {item.subItems?.map((subItem) => (
                        <Button
                          key={subItem.id}
                          variant={currentCategory === subItem.id ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start text-left h-10 pl-8",
                            currentCategory === subItem.id 
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                          onClick={() => handleMenuItemClick(subItem.id as SettingsCategory)}
                        >
                          {subItem.label}
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer - Help/Documentation Link */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Hướng dẫn cài đặt hệ thống và tài liệu hỗ trợ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Breadcrumb */}
        <div className="lg:hidden flex items-center p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="ml-2">
            <h1 className="text-lg font-semibold text-gray-900">Cài Đặt</h1>
            <p className="text-sm text-gray-600">{getCurrentCategoryLabel()}</p>
          </div>
        </div>

        {/* Desktop Breadcrumb */}
        <div className="hidden lg:block p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <span>Cài Đặt Hệ Thống</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{getCurrentCategoryLabel()}</span>
          </div>
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
