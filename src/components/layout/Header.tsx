
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Menu, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PageType } from '@/pages/Index';

interface HeaderProps {
  onSidebarToggle: () => void;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const pageLabels = {
  'dashboard': 'Bảng Điều Khiển',
  'issue-voucher': 'Phát Hành Voucher',
  'voucher-list': 'Danh Sách Voucher',
  'analytics': 'Báo Cáo Phân Tích',
  'leaderboard': 'Bảng Xếp Hạng',
  'customer-list': 'Danh Sách Khách Hàng',
  'settings': 'Cài Đặt',
  'user-management': 'Quản Lý Người Dùng',
  'system-settings': 'Cài Đặt Hệ Thống',
  'audit-log': 'Nhật Ký Hoạt Động',
  'role-permissions': 'Phân Quyền',
};

export function Header({ onSidebarToggle, currentPage, onPageChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {pageLabels[currentPage]}
            </h2>
            {currentPage === 'dashboard' && (
              <Badge variant="secondary" className="ml-2">Trực Tuyến</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Issue Voucher Button */}
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            onClick={() => onPageChange('issue-voucher')}
          >
            <Receipt className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Phát Hành Nhanh</span>
          </Button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm voucher, khách hàng..."
              className="pl-10 w-64"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
}
