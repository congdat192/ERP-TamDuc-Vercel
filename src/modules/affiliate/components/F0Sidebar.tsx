
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  UserPlus, 
  History, 
  Wallet, 
  User, 
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/ERP/Affiliate/f0-dashboard' },
  { id: 'referral', label: 'Giới Thiệu KH', icon: UserPlus, path: '/ERP/Affiliate/f0-referral' },
  { id: 'history', label: 'Lịch Sử Giới Thiệu', icon: History, path: '/ERP/Affiliate/f0-referral-history' },
  { id: 'withdrawal', label: 'Rút Tiền', icon: Wallet, path: '/ERP/Affiliate/f0-withdrawal' },
  { id: 'account', label: 'Thông Tin Tài Khoản', icon: User, path: '/ERP/Affiliate/f0-account-info' },
  { id: 'notifications', label: 'Thông Báo', icon: Bell, path: '/ERP/Affiliate/f0-notifications' }
];

export function F0Sidebar() {
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
              Portal F0
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
            const isActive = location.pathname === item.path;
            
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
