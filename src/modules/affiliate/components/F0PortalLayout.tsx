
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  History, 
  CreditCard, 
  User, 
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface F0PortalLayoutProps {
  children?: React.ReactNode;
}

export function F0PortalLayout({ children }: F0PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/erp/affiliate/f0', icon: LayoutDashboard },
    { name: 'Giới thiệu khách hàng', href: '/erp/affiliate/f0/refer-customer', icon: UserPlus },
    { name: 'Lịch sử giới thiệu', href: '/erp/affiliate/f0/referral-history', icon: History },
    { name: 'Rút tiền', href: '/erp/affiliate/f0/withdrawal', icon: CreditCard },
    { name: 'Thông tin cá nhân', href: '/erp/affiliate/f0/profile', icon: User },
    { name: 'Thông báo', href: '/erp/affiliate/f0/notifications', icon: Bell },
  ];

  const isActive = (href: string) => {
    if (href === '/erp/affiliate/f0') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 theme-bg-secondary rounded-lg flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-semibold theme-text">F0 Portal</h1>
                    <p className="text-xs theme-text-muted">Người giới thiệu</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="theme-bg-secondary text-white">
                    F0
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium theme-text">Demo User</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'theme-bg-secondary text-white'
                      : 'theme-text hover:bg-gray-100'
                  }`}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}
