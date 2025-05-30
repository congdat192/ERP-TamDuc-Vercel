
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Menu, Ticket, LogOut, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserType } from '@/types/erp';

interface HeaderProps {
  onSidebarToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  currentUser: UserType;
}

export function Header({ onSidebarToggle, currentPage, onLogout, currentUser }: HeaderProps) {
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
              {currentPage}
            </h2>
            <Badge variant="secondary" className="ml-2">Trực Tuyến</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Voucher Button - only show if user has voucher access */}
          {currentUser.permissions.modules.includes('voucher') && (
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
              onClick={() => {/* This will be handled by parent component */}}
            >
              <Ticket className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Phát Hành Nhanh</span>
            </Button>
          )}

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm trong hệ thống..."
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

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {currentUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{currentUser.fullName}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {getRoleDisplayName(currentUser.role)}
                  </p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Cài Đặt Cá Nhân</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng Xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
