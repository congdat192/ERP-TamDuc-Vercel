import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Activity, 
  Users, 
  Settings,
  Menu,
  X,
  Shield,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformAdminLayoutProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  children: React.ReactNode;
}

const menuItems = [
  { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
  { id: 'tenants', label: 'Quản Lý Khách Hàng', icon: Building2 },
  { id: 'module-licensing', label: 'Licensing & Module', icon: Package },
  { id: 'billing', label: 'Thanh Toán & Hóa Đơn', icon: CreditCard },
  { id: 'support', label: 'Hỗ Trợ Khách Hàng', icon: MessageSquare },
  { id: 'audit-logs', label: 'Nhật Ký Hệ Thống', icon: FileText },
  { id: 'system-health', label: 'Tình Trạng Hệ Thống', icon: Activity },
  { id: 'admin-users', label: 'Quản Lý Admin', icon: Shield },
  { id: 'settings', label: 'Cài Đặt Nền Tảng', icon: Settings },
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
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarCollapsed ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Platform Admin</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="lg:hidden text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-red-100 text-red-600">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Super Administrator
                </p>
                <p className="text-xs text-slate-400 truncate">
                  Quản trị viên nền tảng
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Quản Lý Nền Tảng
                </p>
              </div>
              
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left h-11",
                      currentPage === item.id 
                        ? "bg-red-600 text-white hover:bg-red-700" 
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                    onClick={() => {
                      onPageChange(item.id);
                      setSidebarCollapsed(false);
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700">
            <div className="text-xs text-slate-400 text-center">
              Platform Admin v1.0.0 • © 2024
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Platform Administration</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              Super Admin Mode
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
