
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Settings, 
  Building2,
  Palette, 
  Shield, 
  Bell, 
  Plug, 
  Code2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsNavigation = [
  {
    name: 'Thông Tin Chung',
    href: '/ERP/Setting/General',
    icon: Settings,
  },
  {
    name: 'Quản Lý Cửa Hàng',
    href: '/ERP/Setting/Stores',
    icon: Building2,
  },
  {
    name: 'API',
    href: '/ERP/Setting/API',
    icon: Code2,
  },
  {
    name: 'Tích Hợp',
    href: '/ERP/Setting/Integrations',
    icon: Plug,
  },
  {
    name: 'Bảo Mật',
    href: '/ERP/Setting/Security',
    icon: Shield,
  },
  {
    name: 'Thông Báo',
    href: '/ERP/Setting/Notifications',
    icon: Bell,
  },
  {
    name: 'Giao Diện',
    href: '/ERP/Setting/Appearance',
    icon: Palette,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Hệ Thống</h1>
        <p className="text-gray-600">
          Quản lý cài đặt và cấu hình cho doanh nghiệp của bạn
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1 p-4">
                {settingsNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
