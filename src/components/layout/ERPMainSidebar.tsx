
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ERPModule, User } from '@/types/auth';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { getIconComponent } from '@/lib/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ERPMainSidebarProps {
  currentModule: ERPModule;
  onModuleChange: (module: ERPModule) => void;
  isExpanded: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
  onMobileToggle: () => void;
  currentUser: User;
}

export function ERPMainSidebar({ 
  currentModule, 
  onModuleChange, 
  isExpanded,
  isMobileOpen,
  onToggle,
  onMobileToggle,
  currentUser 
}: ERPMainSidebarProps) {
  const allowedModules = MODULE_PERMISSIONS.filter(module => 
    currentUser.permissions.modules.includes(module.module)
  );

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
    <TooltipProvider>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}
      
      {/* Main ERP Sidebar */}
      <div className={cn(
        "bg-slate-900 text-white transition-all duration-300 ease-in-out relative",
        // Desktop behavior
        "hidden lg:flex lg:flex-col",
        isExpanded ? "lg:w-72" : "lg:w-16",
        // Mobile behavior
        "lg:relative lg:translate-x-0",
        // Mobile overlay
        isMobileOpen && "fixed inset-y-0 left-0 z-50 w-72 flex flex-col lg:hidden"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 min-h-[73px]">
            {(isExpanded || isMobileOpen) ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">ERP System</h1>
              </div>
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
            
            {/* Toggle buttons */}
            <div className="flex items-center space-x-2">
              {/* Desktop toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="hidden lg:flex text-white hover:bg-slate-700 p-1"
              >
                {isExpanded ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              
              {/* Mobile close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileToggle}
                className="lg:hidden text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* User Profile */}
          {(isExpanded || isMobileOpen) && (
            <div className="p-4 border-b border-slate-700">
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
            </div>
          )}

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {(isExpanded || isMobileOpen) && (
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Các Module
                  </p>
                </div>
              )}
              
              {allowedModules.map((module) => {
                const IconComponent = getIconComponent(module.icon);
                const isActive = currentModule === module.module;
                
                const buttonContent = (
                  <Button
                    key={module.module}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full h-11 transition-all duration-200",
                      isExpanded || isMobileOpen ? "justify-start text-left" : "justify-center p-0",
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                    onClick={() => {
                      onModuleChange(module.module);
                      if (isMobileOpen) {
                        onMobileToggle();
                      }
                    }}
                  >
                    <IconComponent className={cn(
                      "w-5 h-5",
                      (isExpanded || isMobileOpen) ? "mr-3" : ""
                    )} />
                    {(isExpanded || isMobileOpen) && (
                      <span>{module.label}</span>
                    )}
                  </Button>
                );

                // Wrap with tooltip when collapsed on desktop
                if (!isExpanded && !isMobileOpen) {
                  return (
                    <Tooltip key={module.module}>
                      <TooltipTrigger asChild>
                        {buttonContent}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="ml-2">
                        <p>{module.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return buttonContent;
              })}
            </nav>
          </div>

          {/* Footer */}
          {(isExpanded || isMobileOpen) && (
            <div className="p-4 border-t border-slate-700">
              <div className="text-xs text-slate-400 text-center">
                ERP v1.0.0 • © 2024 Company
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
