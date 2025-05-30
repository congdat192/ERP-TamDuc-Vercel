
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Download, 
  Eye,
  Shield,
  Receipt,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

const auditLogData = [
  {
    id: 1,
    timestamp: '29/05/2024 14:30:25',
    user: 'Nguyễn Văn An',
    userRole: 'admin',
    action: 'Phát hành voucher',
    resource: 'VCH-2024-001',
    details: 'Phát hành voucher 500.000đ cho khách hàng Nguyễn Thị Hoa',
    ipAddress: '192.168.1.100',
    status: 'success',
    module: 'voucher'
  },
  {
    id: 2,
    timestamp: '29/05/2024 14:15:12',
    user: 'Trần Thị Lan',
    userRole: 'telesales',
    action: 'Cập nhật thông tin khách hàng',
    resource: 'KH-001234',
    details: 'Cập nhật số điện thoại khách hàng từ 0901234567 thành 0901234568',
    ipAddress: '192.168.1.105',
    status: 'success',
    module: 'customer'
  },
  {
    id: 3,
    timestamp: '29/05/2024 13:45:33',
    user: 'Lê Minh Cường',
    userRole: 'telesales',
    action: 'Đăng nhập hệ thống',
    resource: 'AUTH',
    details: 'Đăng nhập thành công vào hệ thống',
    ipAddress: '192.168.1.102',
    status: 'success',
    module: 'auth'
  },
  {
    id: 4,
    timestamp: '29/05/2024 13:30:45',
    user: 'Phạm Thị Minh',
    userRole: 'telesales',
    action: 'Thêm khách hàng mới',
    resource: 'KH-001235',
    details: 'Tạo mới khách hàng: Trần Văn Nam - 0907654321',
    ipAddress: '192.168.1.103',
    status: 'success',
    module: 'customer'
  },
  {
    id: 5,
    timestamp: '29/05/2024 12:15:20',
    user: 'Vũ Thanh Hải',
    userRole: 'telesales',
    action: 'Cố gắng truy cập trang admin',
    resource: 'ADMIN_PANEL',
    details: 'Cố gắng truy cập trang quản trị hệ thống mà không có quyền',
    ipAddress: '192.168.1.104',
    status: 'failed',
    module: 'auth'
  },
  {
    id: 6,
    timestamp: '29/05/2024 11:45:10',
    user: 'Nguyễn Văn An',
    userRole: 'admin',
    action: 'Cập nhật cài đặt hệ thống',
    resource: 'SYSTEM_CONFIG',
    details: 'Thay đổi thời gian hết hạn mặc định voucher từ 30 ngày thành 45 ngày',
    ipAddress: '192.168.1.100',
    status: 'success',
    module: 'system'
  },
  {
    id: 7,
    timestamp: '29/05/2024 10:30:15',
    user: 'Trần Thị Lan',
    userRole: 'telesales',
    action: 'Hủy voucher',
    resource: 'VCH-2024-002',
    details: 'Hủy voucher theo yêu cầu khách hàng',
    ipAddress: '192.168.1.105',
    status: 'warning',
    module: 'voucher'
  }
];

export function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Thành Công';
      case 'failed':
        return 'Thất Bại';
      case 'warning':
        return 'Cảnh Báo';
      default:
        return status;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'voucher':
        return <Receipt className="w-4 h-4" />;
      case 'customer':
        return <Users className="w-4 h-4" />;
      case 'auth':
        return <Shield className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const filteredLogs = auditLogData.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = userFilter === 'all' || log.user === userFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    
    return matchesSearch && matchesUser && matchesAction && matchesStatus && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nhật Ký Hoạt Động</h2>
          <p className="text-gray-600">Theo dõi tất cả hoạt động trong hệ thống</p>
        </div>
        
        <Button variant="outline">
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
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng Hoạt Động</p>
                <p className="text-2xl font-bold text-gray-900">1.247</p>
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
                <p className="text-2xl font-bold text-gray-900">1.198</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Thất Bại</p>
                <p className="text-2xl font-bold text-gray-900">38</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cảnh Báo</p>
                <p className="text-2xl font-bold text-gray-900">11</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm hoạt động..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Người dùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Người Dùng</SelectItem>
                <SelectItem value="Nguyễn Văn An">Nguyễn Văn An</SelectItem>
                <SelectItem value="Trần Thị Lan">Trần Thị Lan</SelectItem>
                <SelectItem value="Lê Minh Cường">Lê Minh Cường</SelectItem>
                <SelectItem value="Phạm Thị Minh">Phạm Thị Minh</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Hành động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Hành Động</SelectItem>
                <SelectItem value="Phát hành voucher">Phát Hành Voucher</SelectItem>
                <SelectItem value="Đăng nhập hệ thống">Đăng Nhập</SelectItem>
                <SelectItem value="Cập nhật thông tin">Cập Nhật Thông Tin</SelectItem>
                <SelectItem value="Thêm khách hàng mới">Thêm Khách Hàng</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
                <SelectItem value="success">Thành Công</SelectItem>
                <SelectItem value="failed">Thất Bại</SelectItem>
                <SelectItem value="warning">Cảnh Báo</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Mô-đun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Mô-đun</SelectItem>
                <SelectItem value="voucher">Voucher</SelectItem>
                <SelectItem value="customer">Khách Hàng</SelectItem>
                <SelectItem value="auth">Xác Thực</SelectItem>
                <SelectItem value="system">Hệ Thống</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật Ký Chi Tiết ({filteredLogs.length} hoạt động)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời Gian</TableHead>
                  <TableHead>Người Dùng</TableHead>
                  <TableHead>Hành Động</TableHead>
                  <TableHead>Tài Nguyên</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Mô-đun</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Chi Tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {log.user.split(' ').slice(-1)[0].charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{log.user}</div>
                          <div className="text-xs text-gray-500">
                            {log.userRole === 'admin' ? 'Quản Trị Viên' : 'Telesales'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{log.action}</span>
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {log.resource}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <Badge className={getStatusColor(log.status)}>
                          {getStatusText(log.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getModuleIcon(log.module)}
                        <span className="capitalize">{log.module}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={log.details}>
                        {log.details}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
