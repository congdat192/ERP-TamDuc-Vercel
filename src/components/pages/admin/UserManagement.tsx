import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { BulkOperationsBar, BulkSelectCheckbox, BulkSelectHeader } from '@/components/ui/bulk-operations';
import { AdvancedSearch } from '@/components/ui/advanced-search';
import { KeyboardShortcutsDialog } from '@/components/ui/keyboard-shortcuts';
import { EmptyState, EmptyTableState, EmptySearchState } from '@/components/ui/empty-states';
import { TableLoadingSkeleton } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/page-transitions';

const mockUsers = [
  {
    id: 1,
    username: 'nguyenvana',
    fullName: 'Nguyễn Văn An',
    role: 'Quản Trị Viên',
    status: 'Hoạt động',
    email: 'nguyenvana@company.com',
    phone: '0901234567',
    createdDate: '15/03/2024',
    lastLogin: '29/05/2024 14:30',
    permissions: {
      modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'marketing', 'system-settings', 'user-management'],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      affiliateFeatures: ['affiliate-dashboard', 'referrer-management', 'voucher-monitoring', 'commission-tracking', 'affiliate-analytics', 'affiliate-reports'],
      canManageUsers: true,
      canViewAllVouchers: true,
    }
  },
  {
    id: 2,
    username: 'tranthib',
    fullName: 'Trần Thị Bình',
    role: 'Nhân Viên Telesales',
    status: 'Hoạt động',
    email: 'tranthib@company.com',
    phone: '0901234568',
    createdDate: '10/03/2024',
    lastLogin: '29/05/2024 16:45',
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      affiliateFeatures: [],
      canManageUsers: false,
      canViewAllVouchers: true,
    }
  },
  {
    id: 3,
    username: 'levancuong',
    fullName: 'Lê Văn Cường',
    role: 'Nhân Viên Telesales',
    status: 'Tạm khóa',
    email: 'levancuong@company.com',
    phone: '0901234569',
    createdDate: '05/03/2024',
    lastLogin: '25/05/2024 09:15',
    permissions: {
      modules: ['dashboard', 'customers', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list'],
      affiliateFeatures: [],
      canManageUsers: false,
      canViewAllVouchers: false,
    }
  },
  {
    id: 4,
    username: 'phamthid',
    fullName: 'Phạm Thị Dung',
    role: 'Affiliate Admin',
    status: 'Hoạt động',
    email: 'phamthid@company.com',
    phone: '0901234570',
    createdDate: '20/04/2024',
    lastLogin: '28/05/2024 10:20',
    permissions: {
      modules: ['dashboard'],
      voucherFeatures: [],
      affiliateFeatures: [],
      canManageUsers: false,
      canViewAllVouchers: false,
    }
  }
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Advanced search configuration
  const searchFields = [
    {
      key: 'name',
      label: 'Tên người dùng',
      type: 'text' as const,
      operators: ['contains', 'equals', 'starts_with']
    },
    {
      key: 'role',
      label: 'Vai trò',
      type: 'select' as const,
      options: [
        { label: 'Quản Trị Viên', value: 'admin' },
        { label: 'Nhân Viên Telesales', value: 'telesales' }
      ]
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select' as const,
      options: [
        { label: 'Hoạt động', value: 'active' },
        { label: 'Tạm khóa', value: 'locked' }
      ]
    },
    {
      key: 'created_date',
      label: 'Ngày tạo',
      type: 'date' as const
    }
  ];

  const quickFilters = [
    {
      label: 'Người dùng mới',
      icon: <UserPlus className="w-4 h-4" />,
      filters: [{
        id: 'new_users',
        field: 'created_date',
        operator: 'after',
        value: '2024-05-01',
        label: 'Người dùng mới trong tháng'
      }]
    },
    {
      label: 'Tài khoản bị khóa',
      icon: <EyeOff className="w-4 h-4" />,
      filters: [{
        id: 'locked_users',
        field: 'status',
        operator: 'equals',
        value: 'locked',
        label: 'Trạng thái = Tạm khóa'
      }]
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: number, checked: boolean) => {
    setSelectedUsers(prev => 
      checked 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(filteredUsers.map(user => user.id));
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete users:', selectedUsers);
    setSelectedUsers([]);
  };

  const handleBulkActivate = () => {
    console.log('Bulk activate users:', selectedUsers);
    setSelectedUsers([]);
  };

  const handleBulkDeactivate = () => {
    console.log('Bulk deactivate users:', selectedUsers);
    setSelectedUsers([]);
  };

  const handleBulkExport = () => {
    console.log('Bulk export users:', selectedUsers);
  };

  const handleAdvancedSearch = (query: string, filters: any[]) => {
    console.log('Advanced search:', { query, filters });
    setSearchTerm(query);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoạt động':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'Tạm khóa':
        return <Badge className="bg-red-100 text-red-800">Tạm khóa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Quản Trị Viên':
        return <Badge className="bg-purple-100 text-purple-800">Quản Trị Viên</Badge>;
      case 'Nhân Viên Telesales':
        return <Badge className="bg-blue-100 text-blue-800">Nhân Viên Telesales</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role}</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản Lý Người Dùng</h2>
            <p className="text-gray-600">Quản lý tài khoản và phân quyền người dùng hệ thống</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <KeyboardShortcutsDialog />
            
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Thêm Người Dùng
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tên đăng nhập</Label>
                    <Input placeholder="Nhập tên đăng nhập" />
                  </div>
                  <div className="space-y-2">
                    <Label>Họ và tên</Label>
                    <Input placeholder="Nhập họ và tên đầy đủ" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="user@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input placeholder="0901234567" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vai trò</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Quản Trị Viên</SelectItem>
                        <SelectItem value="telesales">Nhân Viên Telesales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mật khẩu tạm thời</Label>
                    <Input type="password" placeholder="Nhập mật khẩu" />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1">Tạo Tài Khoản</Button>
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Hủy
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng Người Dùng</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đang Hoạt Động</p>
                  <p className="text-2xl font-bold text-gray-900">22</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <EyeOff className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bị Khóa</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quản Trị Viên</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Search */}
        <AdvancedSearch
          onSearch={handleAdvancedSearch}
          onClear={handleClearSearch}
          placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
          searchFields={searchFields}
          quickFilters={quickFilters}
        />

        {/* Bulk Operations */}
        <BulkOperationsBar
          selectedCount={selectedUsers.length}
          totalCount={filteredUsers.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          onBulkActivate={handleBulkActivate}
          onBulkDeactivate={handleBulkDeactivate}
          entityName="người dùng"
        />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Người Dùng ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableLoadingSkeleton />
            ) : filteredUsers.length === 0 ? (
              searchTerm ? (
                <EmptySearchState searchTerm={searchTerm} />
              ) : (
                <EmptyTableState 
                  entityName="người dùng"
                  onAdd={() => setIsAddUserOpen(true)}
                />
              )
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <BulkSelectHeader
                        selectedCount={selectedUsers.length}
                        totalCount={filteredUsers.length}
                        onSelectAll={handleSelectAll}
                        onDeselectAll={handleDeselectAll}
                      />
                    </TableHead>
                    <TableHead>Người Dùng</TableHead>
                    <TableHead>Vai Trò</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Lần Đăng Nhập Cuối</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <BulkSelectCheckbox
                          checked={selectedUsers.includes(user.id)}
                          onChange={(checked) => handleSelectUser(user.id, checked)}
                        />
                      </TableCell>
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
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.createdDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Key className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            {user.status === 'Hoạt động' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
