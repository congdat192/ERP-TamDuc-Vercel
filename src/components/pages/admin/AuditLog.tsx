
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Search, 
  Filter, 
  Download, 
  CalendarIcon,
  ClipboardList,
  User,
  Receipt,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const mockAuditLogs = [
  {
    id: 1,
    action: 'Phát hành voucher',
    description: 'Phát hành voucher V240529001 cho khách hàng 0901234567',
    user: 'Trần Thị Bình',
    userRole: 'Nhân Viên Telesales',
    timestamp: '29/05/2024 16:45:23',
    ipAddress: '192.168.1.45',
    status: 'Thành công',
    category: 'Voucher',
    details: {
      voucherCode: 'V240529001',
      customerPhone: '0901234567',
      voucherValue: '100,000 VNĐ'
    }
  },
  {
    id: 2,
    action: 'Đăng nhập hệ thống',
    description: 'Đăng nhập vào hệ thống',
    user: 'Nguyễn Văn An',
    userRole: 'Quản Trị Viên',
    timestamp: '29/05/2024 14:30:15',
    ipAddress: '192.168.1.12',
    status: 'Thành công',
    category: 'Xác thực',
    details: {
      browser: 'Chrome 124.0',
      device: 'Windows 11'
    }
  },
  {
    id: 3,
    action: 'Cập nhật thông tin khách hàng',
    description: 'Sửa thông tin khách hàng Lê Văn Cường',
    user: 'Trần Thị Bình',
    userRole: 'Nhân Viên Telesales',
    timestamp: '29/05/2024 13:22:10',
    ipAddress: '192.168.1.45',
    status: 'Thành công',
    category: 'Khách hàng',
    details: {
      customerId: 'KH001234',
      changedFields: 'Số điện thoại, Email'
    }
  },
  {
    id: 4,
    action: 'Thay đổi cấu hình hệ thống',
    description: 'Cập nhật thời hạn voucher mặc định từ 30 ngày thành 45 ngày',
    user: 'Nguyễn Văn An',
    userRole: 'Quản Trị Viên',
    timestamp: '29/05/2024 11:15:45',
    ipAddress: '192.168.1.12',
    status: 'Thành công',
    category: 'Cấu hình',
    details: {
      setting: 'Thời hạn voucher mặc định',
      oldValue: '30 ngày',
      newValue: '45 ngày'
    }
  },
  {
    id: 5,
    action: 'Đăng nhập thất bại',
    description: 'Thử đăng nhập với mật khẩu không đúng',
    user: 'levancuong',
    userRole: 'Nhân Viên Telesales',
    timestamp: '29/05/2024 09:30:22',
    ipAddress: '192.168.1.78',
    status: 'Thất bại',
    category: 'Xác thực',
    details: {
      reason: 'Mật khẩu không chính xác',
      attempts: '3/5'
    }
  }
];

export function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
    const matchesUser = selectedUser === 'all' || log.user === selectedUser;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesUser;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Thành công':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Thành công
          </Badge>
        );
      case 'Thất bại':
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Thất bại
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Info className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Voucher':
        return <Receipt className="w-4 h-4 text-blue-600" />;
      case 'Khách hàng':
        return <User className="w-4 h-4 text-green-600" />;
      case 'Cấu hình':
        return <Settings className="w-4 h-4 text-purple-600" />;
      case 'Xác thực':
        return <Shield className="w-4 h-4 text-orange-600" />;
      default:
        return <ClipboardList className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nhật Ký Hoạt Động</h2>
          <p className="text-gray-600">Theo dõi và kiểm toán tất cả hoạt động trong hệ thống</p>
        </div>
        
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Xuất Báo Cáo
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng Hoạt Động</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Thành Công</p>
                <p className="text-2xl font-bold text-gray-900">1,201</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lỗi/Thất Bại</p>
                <p className="text-2xl font-bold text-gray-900">46</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Người Dùng Hoạt Động</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm hoạt động, người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="Voucher">Voucher</SelectItem>
                <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                <SelectItem value="Cấu hình">Cấu hình</SelectItem>
                <SelectItem value="Xác thực">Xác thực</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Thành công">Thành công</SelectItem>
                <SelectItem value="Thất bại">Thất bại</SelectItem>
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Người dùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả người dùng</SelectItem>
                <SelectItem value="Nguyễn Văn An">Nguyễn Văn An</SelectItem>
                <SelectItem value="Trần Thị Bình">Trần Thị Bình</SelectItem>
                <SelectItem value="Lê Văn Cường">Lê Văn Cường</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateFrom ? format(dateFrom, 'dd/MM', { locale: vi }) : 'Từ ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateTo ? format(dateTo, 'dd/MM', { locale: vi }) : 'Đến ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật Ký Hoạt Động ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời Gian</TableHead>
                <TableHead>Người Dùng</TableHead>
                <TableHead>Hoạt Động</TableHead>
                <TableHead>Danh Mục</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Chi Tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-gray-600">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {log.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{log.user}</p>
                        <p className="text-xs text-gray-500">{log.userRole}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{log.action}</p>
                      <p className="text-xs text-gray-600">{log.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(log.category)}
                      <span className="text-sm">{log.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(log.status)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Info className="w-4 h-4" />
                    </Button>
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
