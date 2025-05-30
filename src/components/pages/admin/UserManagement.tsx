
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
  AlertCircle
} from 'lucide-react';

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
    lastLogin: '29/05/2024 14:30'
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
    lastLogin: '29/05/2024 16:45'
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
    lastLogin: '25/05/2024 09:15'
  }
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản Lý Người Dùng</h2>
          <p className="text-gray-600">Quản lý tài khoản và phân quyền người dùng hệ thống</p>
        </div>
        
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

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
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
                <SelectItem value="Quản Trị Viên">Quản Trị Viên</SelectItem>
                <SelectItem value="Nhân Viên Telesales">Nhân Viên Telesales</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                <SelectItem value="Tạm khóa">Tạm khóa</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Lần Đăng Nhập Cuối</TableHead>
                <TableHead>Ngày Tạo</TableHead>
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
        </CardContent>
      </Card>
    </div>
  );
}
