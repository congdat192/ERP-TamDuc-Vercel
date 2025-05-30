
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Key,
  Users,
  Shield,
  AlertCircle,
  Settings,
  LogOut,
  Clock,
  Mail
} from 'lucide-react';
import { User, UserStatus, UserRole } from '@/types/auth';
import { UserCreateModal } from '../components/UserCreateModal';
import { UserEditModal } from '../components/UserEditModal';
import { UserDetailModal } from '../components/UserDetailModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { UserSecurityModal } from '../components/UserSecurityModal';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin_nguyen',
    fullName: 'Nguyễn Văn An',
    role: 'erp-admin',
    email: 'admin@company.com',
    phone: '0901234567',
    status: 'active',
    notes: 'System Administrator',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-05-29T14:30:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'system-settings', 'user-management'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      canManageUsers: true,
      canViewAllVouchers: true
    },
    securitySettings: {
      twoFactorEnabled: true,
      loginAttemptLimit: 5,
      passwordChangeRequired: false,
      lastPasswordChange: new Date('2024-01-15'),
      sessionTimeoutMinutes: 480
    },
    activities: []
  },
  {
    id: '2',
    username: 'voucher_manager',
    fullName: 'Trần Thị Bình',
    role: 'voucher-admin',
    email: 'voucher.manager@company.com',
    phone: '0901234568',
    status: 'active',
    notes: 'Voucher Module Manager',
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date('2024-05-29T16:45:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      canManageUsers: false,
      canViewAllVouchers: true
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: false,
      sessionTimeoutMinutes: 240
    },
    activities: []
  },
  {
    id: '3',
    username: 'telesales_01',
    fullName: 'Lê Văn Cường',
    role: 'telesales',
    email: 'telesales01@company.com',
    phone: '0901234569',
    status: 'locked',
    notes: 'Telesales Staff - Temporary Lock',
    createdAt: new Date('2024-03-05'),
    lastLogin: new Date('2024-05-25T09:15:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-leaderboard'],
      canManageUsers: false,
      canViewAllVouchers: false
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: true,
      sessionTimeoutMinutes: 120
    },
    activities: []
  },
  {
    id: '4',
    username: 'new_user',
    fullName: 'Phạm Thị Dung',
    role: 'telesales',
    email: 'newuser@company.com',
    phone: '0901234570',
    status: 'pending_verification',
    notes: 'New employee - pending email verification',
    createdAt: new Date('2024-05-28'),
    lastLogin: undefined,
    emailVerified: false,
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list'],
      canManageUsers: false,
      canViewAllVouchers: false
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: true,
      sessionTimeoutMinutes: 120
    },
    activities: []
  }
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone && user.phone.includes(searchTerm));
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800", label: "Hoạt Động" },
      inactive: { className: "bg-gray-100 text-gray-800", label: "Không Hoạt Động" },
      locked: { className: "bg-red-100 text-red-800", label: "Bị Khóa" },
      pending_verification: { className: "bg-yellow-100 text-yellow-800", label: "Chờ Xác Thực" }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      'erp-admin': { className: "bg-purple-100 text-purple-800", label: "Quản Trị ERP" },
      'voucher-admin': { className: "bg-blue-100 text-blue-800", label: "Quản Lý Voucher" },
      'telesales': { className: "bg-orange-100 text-orange-800", label: "Telesales" },
      'custom': { className: "bg-gray-100 text-gray-800", label: "Tùy Chỉnh" }
    };
    
    const config = roleConfig[role];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleToggleUserStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    const action = newStatus === 'active' ? 'mở khóa' : 'khóa';
    
    setConfirmDialog({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Tài Khoản`,
      message: `Bạn có chắc chắn muốn ${action} tài khoản "${user.fullName}"?`,
      onConfirm: () => {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const handleDeleteUser = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xóa Người Dùng',
      message: `Bạn có chắc chắn muốn xóa người dùng "${user.fullName}"? Hành động này không thể hoàn tác.`,
      onConfirm: () => {
        setUsers(users.filter(u => u.id !== user.id));
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const handleResetPassword = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Đặt Lại Mật Khẩu',
      message: `Gửi email đặt lại mật khẩu cho "${user.fullName}"?`,
      onConfirm: () => {
        // Here you would implement password reset logic
        console.log('Password reset email sent to:', user.email);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const handleForceLogout = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Đăng Xuất Cưỡng Chế',
      message: `Đăng xuất tất cả phiên đăng nhập của "${user.fullName}"?`,
      onConfirm: () => {
        // Here you would implement force logout logic
        console.log('Force logout user:', user.id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const getStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const locked = users.filter(u => u.status === 'locked').length;
    const pending = users.filter(u => u.status === 'pending_verification').length;
    const admins = users.filter(u => u.role === 'erp-admin').length;
    
    return { total, active, locked, pending, admins };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản Lý Người Dùng ERP</h1>
            <p className="text-blue-100">
              Quản lý tài khoản và phân quyền toàn hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Tổng Số</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Hoạt Động</p>
                <p className="text-xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Bị Khóa</p>
                <p className="text-xl font-bold text-gray-900">{stats.locked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Chờ Xác Thực</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Quản Trị</p>
                <p className="text-xl font-bold text-gray-900">{stats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, SĐT, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="erp-admin">Quản Trị ERP</SelectItem>
                  <SelectItem value="voucher-admin">Quản Lý Voucher</SelectItem>
                  <SelectItem value="telesales">Telesales</SelectItem>
                  <SelectItem value="custom">Tùy Chỉnh</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="locked">Bị khóa</SelectItem>
                  <SelectItem value="pending_verification">Chờ xác thực</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm Người Dùng
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Người Dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người Dùng</TableHead>
                <TableHead>Vai Trò</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Xác Thực Email</TableHead>
                <TableHead>Lần Đăng Nhập Cuối</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.phone && (
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Badge className="bg-green-100 text-green-800">Đã Xác Thực</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Chưa Xác Thực</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.lastLogin ? user.lastLogin.toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                  </TableCell>
                  <TableCell>
                    {user.securitySettings.twoFactorEnabled ? (
                      <Badge className="bg-green-100 text-green-800">Bật</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Tắt</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDetailModalOpen(true);
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsSecurityModalOpen(true);
                        }}
                        title="Cài đặt bảo mật"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResetPassword(user)}
                        title="Đặt lại mật khẩu"
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleForceLogout(user)}
                        title="Đăng xuất cưỡng chế"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleUserStatus(user)}
                        className={user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {user.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-700"
                        title="Xóa người dùng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <UserCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={(newUser) => {
          setUsers([...users, newUser]);
          setIsCreateModalOpen(false);
        }}
      />

      <UserEditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserUpdated={(updatedUser) => {
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <UserDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <UserSecurityModal 
        isOpen={isSecurityModalOpen}
        onClose={() => {
          setIsSecurityModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSecurityUpdated={(userId, settings) => {
          setUsers(users.map(u => u.id === userId ? { ...u, securitySettings: settings } : u));
          setIsSecurityModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <ConfirmationDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  );
}
