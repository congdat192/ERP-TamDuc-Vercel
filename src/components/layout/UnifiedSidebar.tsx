
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '@/types/auth';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  isActive?: boolean;
}

interface UnifiedSidebarProps {
  title: string;
  subtitle?: string;
  items: SidebarItem[];
  currentUser: User;
  onBackToModules?: () => void;
  className?: string;
}

export function UnifiedSidebar({ 
  title, 
  subtitle, 
  items, 
  currentUser, 
  onBackToModules,
  className 
}: UnifiedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldShow = !isCollapsed || isHovered || isMobile;

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'erp-admin': return 'Quản Trị ERP';
      case 'voucher-admin': return 'Quản Lý Voucher';
      case 'telesales': return 'Nhân Viên Telesales';
      case 'custom': return 'Vai Trò Tùy Chỉnh';
      default: return 'Người Dùng';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && shouldShow && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out",
          isMobile ? "lg:relative" : "relative",
          shouldShow ? "w-72" : "w-16",
          isMobile && isCollapsed && "-translate-x-full lg:translate-x-0",
          className
        )}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 min-h-[73px]">
            <div className={cn(
              "flex items-center space-x-3 transition-opacity duration-200",
              shouldShow ? "opacity-100" : "opacity-0"
            )}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {shouldShow && (
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-white truncate">{title}</h1>
                  {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
                </div>
              )}
            </div>
            
            {/* Toggle button for desktop */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white hover:bg-slate-700 flex-shrink-0 w-8 h-8 p-0"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
            )}
            
            {/* Close button for mobile */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="text-white hover:bg-slate-700 lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* User Profile */}
          <div className={cn(
            "p-4 border-b border-slate-700 transition-opacity duration-200",
            shouldShow ? "opacity-100" : "opacity-0"
          )}>
            {shouldShow && (
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {currentUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser.fullName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {getRoleDisplayName(currentUser.role)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Back to modules button */}
          {onBackToModules && (
            <div className="p-3 border-b border-slate-700">
              <Button
                variant="ghost"
                onClick={onBackToModules}
                className={cn(
                  "w-full text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200",
                  shouldShow ? "justify-start" : "justify-center px-0"
                )}
              >
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                {shouldShow && <span className="ml-2">Quay lại Module</span>}
              </Button>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={item.isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full transition-all duration-200",
                      shouldShow ? "justify-start h-11" : "justify-center h-11 px-0",
                      item.isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                    onClick={item.onClick}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {shouldShow && <span className="ml-3 truncate">{item.label}</span>}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className={cn(
            "p-4 border-t border-slate-700 transition-opacity duration-200",
            shouldShow ? "opacity-100" : "opacity-0"
          )}>
            {shouldShow && (
              <div className="text-xs text-slate-400 text-center">
                ERP v1.0.0 • © 2024 Company
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile toggle button */}
      {isMobile && isCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 bg-slate-900 text-white hover:bg-slate-700 lg:hidden"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </>
  );
}
