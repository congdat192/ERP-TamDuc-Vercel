
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { X, Building2 } from 'lucide-react';
import { ERPModule, User } from '@/types/erp';
import { modulePermissions, getIconComponent } from '@/data/erpConfig';

interface ERPMainSidebarProps {
  currentModule: ERPModule;
  onModuleChange: (module: ERPModule) => void;
  isOpen: boolean;
  onToggle: () => void;
  currentUser: User;
}

export function ERPMainSidebar({ 
  currentModule, 
  onModuleChange, 
  isOpen, 
  onToggle, 
  currentUser 
}: ERPMainSidebarProps) {
  const allowedModules = modulePermissions.filter(module => 
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
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Main ERP Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">ERP System</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
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

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Các Module
                </p>
              </div>
              
              {allowedModules.map((module) => {
                const IconComponent = getIconComponent(module.icon);
                return (
                  <Button
                    key={module.module}
                    variant={currentModule === module.module ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left h-11",
                      currentModule === module.module 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                    onClick={() => onModuleChange(module.module)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {module.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700">
            <div className="text-xs text-slate-400 text-center">
              ERP v1.0.0 • © 2024 Company
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
