
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Ticket, 
  Wallet, 
  Activity, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, path: '/ERP/Affiliate' },
  { id: 'f0-approval', label: 'Duyệt F0', icon: UserCheck, path: '/ERP/Affiliate/f0-approval' },
  { id: 'referral-management', label: 'Quản Lý Giới Thiệu', icon: Users, path: '/ERP/Affiliate/referral-management' },
  { id: 'voucher-management', label: 'Quản Lý Voucher', icon: Ticket, path: '/ERP/Affiliate/voucher-management' },
  { id: 'withdrawal-management', label: 'Quản Lý Rút Tiền', icon: Wallet, path: '/ERP/Affiliate/withdrawal-management' },
  { id: 'activity-log', label: 'Nhật Ký Hoạt Động', icon: Activity, path: '/ERP/Affiliate/activity-log' },
  { id: 'reports', label: 'Báo Cáo/Xuất File', icon: FileText, path: '/ERP/Affiliate/reports' }
];

export function AffiliateModuleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Affiliate
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/ERP/Affiliate' && location.pathname === '/ERP/Affiliate/');
            
            return (
              <Link key={item.id} to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                    isActive && "theme-bg-primary text-white hover:theme-bg-primary/90",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
