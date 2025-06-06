
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Ticket, LogOut, User, Bell, Settings, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationCenter } from '@/components/ui/notification-center';
import { User as UserType } from '@/types/auth';

interface HeaderProps {
  onSidebarToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  currentUser: UserType;
}

export function Header({ onSidebarToggle, currentPage, onPageChange, onLogout, currentUser }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickVoucher, setShowQuickVoucher] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'erp-admin': return 'Quản Trị ERP';
      case 'voucher-admin': return 'Quản Lý Voucher';
      case 'telesales': return 'Nhân Viên Telesales';
      case 'custom': return 'Vai Trò Tùy Chỉnh';
      default: return 'Người Dùng';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement search functionality
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between min-h-[73px]">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900">
              {currentPage}
            </h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">Trực Tuyến</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search - Desktop */}
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm trong hệ thống..."
                className="pl-10 w-64 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="md:hidden p-2"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Quick Voucher Button - only show if user has voucher access */}
          {currentUser.permissions.modules.includes('voucher') && (
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg hidden sm:flex"
              size="sm"
              onClick={() => setShowQuickVoucher(true)}
            >
              <Ticket className="w-4 h-4 mr-2" />
              Phát Hành Nhanh
            </Button>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>

          {/* Language & Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Globe className="mr-2 h-4 w-4" />
                <span>Tiếng Việt</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài Đặt Hệ Thống</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                    {currentUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{currentUser.fullName}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {getRoleDisplayName(currentUser.role)}
                  </p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowUserSettings(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Cài Đặt Cá Nhân</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng Xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tìm Kiếm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(e); setShowSearch(false); }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm trong hệ thống..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full mt-4">
                Tìm Kiếm
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Đăng Xuất</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowLogoutConfirm(false)}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmLogout}
            >
              Đăng Xuất
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Voucher Dialog */}
      <Dialog open={showQuickVoucher} onOpenChange={setShowQuickVoucher}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phát Hành Voucher Nhanh</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600">Tính năng phát hành voucher nhanh sẽ được triển khai.</p>
            <Button className="mt-4" onClick={() => setShowQuickVoucher(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Settings Dialog */}
      <Dialog open={showUserSettings} onOpenChange={setShowUserSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cài Đặt Cá Nhân</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600">Trang cài đặt cá nhân sẽ được triển khai.</p>
            <Button className="mt-4" onClick={() => setShowUserSettings(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
