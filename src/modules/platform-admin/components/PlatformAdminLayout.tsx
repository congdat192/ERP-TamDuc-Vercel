
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Building2, 
  Shield,
  FileText, 
  Users,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformAdminLayoutProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  children: React.ReactNode;
}

const menuItems = [
  { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
  { id: 'tenants', label: 'Tenant Management', icon: Building2 },
  { id: 'licensing', label: 'License Management', icon: Shield },
  { id: 'logs', label: 'System Logs', icon: FileText },
  { id: 'admin-users', label: 'Admin Accounts', icon: Users },
];

export function PlatformAdminLayout({ currentPage, onPageChange, children }: PlatformAdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarCollapsed ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">Platform Admin</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="lg:hidden text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-red-100 text-red-600 text-sm">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Super Admin
                </p>
                <p className="text-xs text-slate-400 truncate">
                  System Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-2">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left h-10",
                      currentPage === item.id 
                        ? "bg-red-600 text-white hover:bg-red-700" 
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                    onClick={() => {
                      onPageChange(item.id);
                      setSidebarCollapsed(false);
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-gray-900">Platform Administration</h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
              Super Admin
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
