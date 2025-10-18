import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Copy, Trash, UserPlus, UserCog, Download, Upload, FileText, Filter, RefreshCcw, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { UserCreateModal } from '../components/UserCreateModal';
import { UserDetailModal } from '../components/UserDetailModal';
import { UserSecurityModal } from '../components/UserSecurityModal';
import { Role, EnhancedUser, UserManagementFilters, BulkOperation } from '@/modules/user-management/types';
import { User, UserStatus, UserRole, UserSecuritySettings } from '@/types/auth';
import { EmptyState } from '@/components/ui/empty-states';
import { RolesTab } from '@/modules/user-management/components/roles/RolesTab';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [filters, setFilters] = useState<UserManagementFilters>({});
  const [bulkOperation, setBulkOperation] = useState<BulkOperation | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const mockUsers: User[] = [
    {
      id: '1',
      fullName: 'Nguyễn Văn Admin',
      username: 'admin',
      email: 'admin@company.com',
      phone: '+84901234567',
      role: 'erp-admin',
      permissions: {
        modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'marketing', 'system-settings', 'user-management'],
        voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
        canManageUsers: true,
        canViewAllVouchers: true
      },
      isActive: true,
      status: 'active',
      createdAt: '2024-01-15T08:00:00Z',
      lastLogin: '2024-05-29T16:30:00Z',
      avatarPath: undefined,
      emailVerified: true,
      securitySettings: {
        twoFactorEnabled: true,
        loginAttemptLimit: 5,
        passwordChangeRequired: false,
        lastPasswordChange: '2024-05-01T10:00:00Z'
      },
      activities: [],
      notes: 'Quản trị viên hệ thống chính'
    },
    {
      id: '2',
      fullName: 'Trần Thị Voucher Manager',
      username: 'voucher_manager',
      email: 'voucher@company.com',
      phone: '+84901234568',
      role: 'voucher-admin',
      permissions: {
        modules: ['dashboard', 'voucher'],
        voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
        canManageUsers: false,
        canViewAllVouchers: true
      },
      isActive: true,
      status: 'active',
      createdAt: '2024-02-01T08:00:00Z',
      lastLogin: '2024-05-29T14:20:00Z',
      avatarPath: undefined,
      emailVerified: true,
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: true
      },
      activities: [],
      notes: 'Chuyên viên quản lý voucher'
    },
    {
      id: '3',
      fullName: 'Lê Văn Telesales',
      username: 'telesales01',
      email: 'telesales@company.com',
      phone: '+84901234569',
      role: 'telesales',
      permissions: {
        modules: ['dashboard', 'customers', 'voucher'],
        voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list'],
        canManageUsers: false,
        canViewAllVouchers: false
      },
      isActive: true,
      status: 'active',
      createdAt: '2024-03-01T08:00:00Z',
      lastLogin: '2024-05-29T12:00:00Z',
      avatarPath: undefined,
      emailVerified: true,
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: false
      },
      activities: [],
      notes: 'Nhân viên telesales'
    },
    {
      id: '4',
      fullName: 'Phạm Thị Inactive',
      username: 'inactive_user',
      email: 'inactive@company.com',
      phone: '+84901234570',
      role: 'custom',
      permissions: {
        modules: ['dashboard'],
        voucherFeatures: [],
        canManageUsers: false,
        canViewAllVouchers: false
      },
      isActive: false,
      status: 'inactive',
      createdAt: '2024-04-01T08:00:00Z',
      avatarPath: undefined,
      emailVerified: false,
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: true
      },
      activities: [],
      notes: 'Tài khoản tạm thời không hoạt động'
    }
  ];

  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);

  const handleCreateUser = (newUser: User) => {
    setAllUsers(prevUsers => [...prevUsers, newUser]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setAllUsers(prevUsers =>
      prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsDetailModalOpen(false);
  };

  const handleSecurityUpdated = (userId: string, newSettings: UserSecuritySettings) => {
    setAllUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, securitySettings: newSettings } : user
      )
    );
    setIsSecurityModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const filteredUsers = allUsers.filter(user => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!user.fullName.toLowerCase().includes(searchLower) &&
        !user.username.toLowerCase().includes(searchLower) &&
        !user.email.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    if (filters.status && filters.status.length > 0 && !filters.status.includes(user.status)) {
      return false;
    }

    return true;
  });

  const handleBulkOperation = () => {
    if (!bulkOperation) return;

    let updatedUsers = [...allUsers];

    switch (bulkOperation.type) {
      case 'activate':
        updatedUsers = updatedUsers.map(user =>
          bulkOperation.userIds.includes(user.id) ? { ...user, isActive: true, status: 'active' } : user
        );
        break;
      case 'deactivate':
        updatedUsers = updatedUsers.map(user =>
          bulkOperation.userIds.includes(user.id) ? { ...user, isActive: false, status: 'inactive' } : user
        );
        break;
      case 'delete':
        updatedUsers = updatedUsers.filter(user => !bulkOperation.userIds.includes(user.id));
        break;
    }

    setAllUsers(updatedUsers);
    setBulkOperation(null);
    setSelectedUserIds([]);
  };

  const isAllSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;
  const isIndeterminate = selectedUserIds.length > 0 && selectedUserIds.length < filteredUsers.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold theme-text">Quản Lý Người Dùng</h1>
          <p className="text-gray-500 theme-text-muted">Quản lý và cấu hình người dùng hệ thống</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="voucher-button-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm Người Dùng
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
          className="voucher-input"
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : [value] }))} defaultValue="all">
          <SelectTrigger className="voucher-input">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
            <SelectItem value="pending_verification">Chờ xác thực</SelectItem>
            <SelectItem value="locked">Đã khóa</SelectItem>
          </SelectContent>
        </Select>
        <div></div>
        <Button variant="outline" className="h-10">
          <Filter className="w-4 h-4 mr-2" />
          Lọc
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedUserIds.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Đã chọn {selectedUserIds.length} người dùng
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8">
                Hành động hàng loạt
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chọn hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setBulkOperation({ type: 'activate', userIds: selectedUserIds })}>
                Kích hoạt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBulkOperation({ type: 'deactivate', userIds: selectedUserIds })}>
                Vô hiệu hóa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBulkOperation({ type: 'delete', userIds: selectedUserIds })}>
                Xóa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleBulkOperation}>
                Xác nhận
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* User Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState 
          icon={<UserCog className="w-12 h-12 text-gray-400" />}
          title="Không có người dùng"
          description="Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại."
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    disabled={filteredUsers.length === 0}
                    aria-describedby="select-all-description"
                    data-indeterminate={isIndeterminate}
                  />
                </TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUserIds([...selectedUserIds, user.id]);
                        } else {
                          setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                        }
                      }}
                      aria-label={`Select user ${user.fullName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsDetailModalOpen(true); }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsSecurityModalOpen(true); }}>
                          <UserCog className="w-4 h-4 mr-2" />
                          Bảo mật
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                          <Trash className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <UserCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onUserCreated={handleCreateUser} />
      <UserDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} user={selectedUser} onUserUpdated={handleUpdateUser} />
      <UserSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        user={selectedUser}
        onSecurityUpdated={handleSecurityUpdated}
      />
    </div>
  );
}
