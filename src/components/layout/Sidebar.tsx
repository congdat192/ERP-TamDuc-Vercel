
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Receipt, 
  FileText, 
  BarChart3, 
  Trophy, 
  Users, 
  Settings,
  X
} from 'lucide-react';
import { PageType } from '@/pages/Index';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'issue-voucher' as PageType, label: 'Issue Voucher', icon: Receipt },
  { id: 'voucher-list' as PageType, label: 'Voucher List', icon: FileText },
  { id: 'analytics' as PageType, label: 'Analytics', icon: BarChart3 },
  { id: 'leaderboard' as PageType, label: 'Leaderboard', icon: Trophy },
  { id: 'customer-list' as PageType, label: 'Customer List', icon: Users },
  { id: 'settings' as PageType, label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">VoucherCRM</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-100 text-blue-600">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Smith</p>
                <p className="text-xs text-gray-500 truncate">Telesales Agent</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left h-11",
                      currentPage === item.id 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => onPageChange(item.id)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              v2.1.0 • © 2024 VoucherCRM
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
