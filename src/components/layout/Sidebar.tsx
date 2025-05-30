
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
  X,
  Shield,
  Database,
  ClipboardList,
  UserCog
} from 'lucide-react';
import { PageType } from '@/pages/Index';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isOpen: boolean;
  onToggle: () => void;
  userRole: 'admin' | 'telesales';
}

const telesalesItems = [
  { id: 'dashboard' as PageType, label: 'Bảng Điều Khiển', icon: LayoutDashboard },
  { id: 'issue-voucher' as PageType, label: 'Phát Hành Voucher', icon: Receipt },
  { id: 'voucher-list' as PageType, label: 'Danh Sách Voucher', icon: FileText },
  { id: 'analytics' as PageType, label: 'Báo Cáo Phân Tích', icon: BarChart3 },
  { id: 'leaderboard' as PageType, label: 'Bảng Xếp Hạng', icon: Trophy },
  { id: 'customer-list' as PageType, label: 'Danh Sách Khách Hàng', icon: Users },
  { id: 'settings' as PageType, label: 'Cài Đặt Cá Nhân', icon: Settings },
];

const adminItems = [
  { id: 'dashboard' as PageType, label: 'Bảng Điều Khiển', icon: LayoutDashboard },
  { id: 'issue-voucher' as PageType, label: 'Phát Hành Voucher', icon: Receipt },
  { id: 'voucher-list' as PageType, label: 'Danh Sách Voucher', icon: FileText },
  { id: 'analytics' as PageType, label: 'Báo Cáo Phân Tích', icon: BarChart3 },
  { id: 'leaderboard' as PageType, label: 'Bảng Xếp Hạng', icon: Trophy },
  { id: 'customer-list' as PageType, label: 'Danh Sách Khách Hàng', icon: Users },
];

const adminOnlyItems = [
  { id: 'user-management' as PageType, label: 'Quản Lý Người Dùng', icon: UserCog },
  { id: 'system-settings' as PageType, label: 'Cài Đặt Hệ Thống', icon: Database },
  { id: 'audit-log' as PageType, label: 'Nhật Ký Hoạt Động', icon: ClipboardList },
  { id: 'role-permissions' as PageType, label: 'Phân Quyền', icon: Shield },
  { id: 'settings' as PageType, label: 'Cài Đặt', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange, isOpen, onToggle, userRole }: SidebarProps) {
  const menuItems = userRole === 'admin' ? adminItems : telesalesItems;

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
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {userRole === 'admin' ? 'QT' : 'NV'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userRole === 'admin' ? 'Nguyễn Văn Quản' : 'Trần Thị Nhân'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userRole === 'admin' ? 'Quản Trị Viên' : 'Nhân Viên Telesales'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {/* Main Menu Items */}
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

              {/* Admin Only Section */}
              {userRole === 'admin' && (
                <>
                  <Separator className="my-4" />
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quản Trị Hệ Thống
                    </p>
                  </div>
                  {adminOnlyItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentPage === item.id ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left h-11",
                          currentPage === item.id 
                            ? "bg-red-50 text-red-700 border-r-2 border-red-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => onPageChange(item.id)}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </>
              )}
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
