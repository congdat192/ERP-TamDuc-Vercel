
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  GitBranch, 
  Ticket, 
  CreditCard, 
  FileText, 
  Settings, 
  Shield, 
  Download,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminPortalLayoutProps {
  children?: React.ReactNode;
}

export function AdminPortalLayout({ children }: AdminPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/erp/affiliate/admin', icon: LayoutDashboard },
    { name: 'Duyệt F0', href: '/erp/affiliate/admin/approve-f0', icon: UserCheck },
    { name: 'Quản lý F0', href: '/erp/affiliate/admin/f0-management', icon: Users },
    { name: 'Quản lý Giới thiệu', href: '/erp/affiliate/admin/referral-management', icon: GitBranch },
    { name: 'Quản lý Voucher', href: '/erp/affiliate/admin/voucher-management', icon: Ticket },
    { name: 'Duyệt Rút Tiền', href: '/erp/affiliate/admin/withdrawal-management', icon: CreditCard },
    { name: 'Nhật ký Hoạt động', href: '/erp/affiliate/admin/activity-log', icon: FileText },
    { name: 'Cài đặt Hệ thống', href: '/erp/affiliate/admin/system-settings', icon: Settings },
    { name: 'Quản lý Admin', href: '/erp/affiliate/admin/admin-accounts', icon: Shield },
    { name: 'Báo cáo & Xuất', href: '/erp/affiliate/admin/reporting', icon: Download },
  ];

  const isActive = (href: string) => {
    if (href === '/erp/affiliate/admin') {
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
                  <div className="w-8 h-8 theme-bg-primary rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-semibold theme-text">Admin Portal</h1>
                    <p className="text-xs theme-text-muted">Quản lý Affiliate</p>
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
                      ? 'theme-bg-primary text-white'
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
              <div className="text-xs theme-text-muted text-center">
                Affiliate System v1.0
              </div>
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
