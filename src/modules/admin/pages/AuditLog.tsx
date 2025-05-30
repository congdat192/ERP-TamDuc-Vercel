
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { LoadingSpinner, PageLoading } from '@/components/ui/loading';
import { EmptyAuditLogState, EmptySearchState } from '@/components/ui/empty-states';
import { FormError } from '@/components/ui/form-errors';
import { 
  Search, 
  Download, 
  Eye,
  Shield,
  FileText,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';

// Mock data types
interface AuditLogEntry {
  id: number;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent?: string;
  status: 'success' | 'failed' | 'warning';
  module: 'voucher' | 'customer' | 'auth' | 'system' | 'admin';
  sessionId?: string;
  changes?: Record<string, any>;
}

// Mock audit log data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 1,
    timestamp: '2024-05-30 14:30:25',
    user: 'Nguyễn Văn An',
    userRole: 'admin',
    action: 'Phát hành voucher',
    resource: 'VCH-2024-001',
    details: 'Phát hành voucher 500.000đ cho khách hàng Nguyễn Thị Hoa',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    module: 'voucher',
    sessionId: 'sess_12345',
    changes: { amount: 500000, customer: 'Nguyễn Thị Hoa', code: 'VCH-2024-001' }
  },
  {
    id: 2,
    timestamp: '2024-05-30 14:15:12',
    user: 'Trần Thị Lan',
    userRole: 'telesales',
    action: 'Cập nhật thông tin khách hàng',
    resource: 'KH-001234',
    details: 'Cập nhật số điện thoại khách hàng từ 0901234567 thành 0901234568',
    ipAddress: '192.168.1.105',
    status: 'success',
    module: 'customer',
    sessionId: 'sess_12346'
  },
  {
    id: 3,
    timestamp: '2024-05-30 13:45:33',
    user: 'Lê Minh Cường',
    userRole: 'telesales',
    action: 'Đăng nhập hệ thống',
    resource: 'AUTH',
    details: 'Đăng nhập thành công vào hệ thống',
    ipAddress: '192.168.1.102',
    status: 'success',
    module: 'auth',
    sessionId: 'sess_12347'
  },
  {
    id: 4,
    timestamp: '2024-05-30 13:30:45',
    user: 'Phạm Thị Minh',
    userRole: 'telesales',
    action: 'Thêm khách hàng mới',
    resource: 'KH-001235',
    details: 'Tạo mới khách hàng: Trần Văn Nam - 0907654321',
    ipAddress: '192.168.1.103',
    status: 'success',
    module: 'customer',
    sessionId: 'sess_12348'
  },
  {
    id: 5,
    timestamp: '2024-05-30 12:15:20',
    user: 'Vũ Thanh Hải',
    userRole: 'telesales',
    action: 'Cố gắng truy cập trang admin',
    resource: 'ADMIN_PANEL',
    details: 'Cố gắng truy cập trang quản trị hệ thống mà không có quyền',
    ipAddress: '192.168.1.104',
    status: 'failed',
    module: 'auth',
    sessionId: 'sess_12349'
  },
  {
    id: 6,
    timestamp: '2024-05-30 11:45:10',
    user: 'Nguyễn Văn An',
    userRole: 'admin',
    action: 'Cập nhật cài đặt hệ thống',
    resource: 'SYSTEM_CONFIG',
    details: 'Thay đổi thời gian hết hạn mặc định voucher từ 30 ngày thành 45 ngày',
    ipAddress: '192.168.1.100',
    status: 'success',
    module: 'system',
    sessionId: 'sess_12345'
  },
  {
    id: 7,
    timestamp: '2024-05-30 10:30:15',
    user: 'Trần Thị Lan',
    userRole: 'telesales',
    action: 'Hủy voucher',
    resource: 'VCH-2024-002',
    details: 'Hủy voucher theo yêu cầu khách hàng',
    ipAddress: '192.168.1.105',
    status: 'warning',
    module: 'voucher',
    sessionId: 'sess_12346'
  }
];

export function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 10;

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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        return <FileText className="w-4 h-4" />;
      case 'customer':
        return <Users className="w-4 h-4" />;
      case 'auth':
        return <Shield className="w-4 h-4" />;
      case 'system':
      case 'admin':
        return <Settings className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getModuleText = (module: string) => {
    switch (module) {
      case 'voucher':
        return 'Voucher';
      case 'customer':
        return 'Khách Hàng';
      case 'auth':
        return 'Xác Thực';
      case 'system':
        return 'Hệ Thống';
      case 'admin':
        return 'Quản Trị';
      default:
        return module;
    }
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = userFilter === 'all' || log.user === userFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    
    // Date filtering (simplified for demo)
    let matchesDateRange = true;
    if (dateFromFilter && dateToFilter) {
      const logDate = new Date(log.timestamp.replace(' ', 'T'));
      const fromDate = new Date(dateFromFilter);
      const toDate = new Date(dateToFilter);
      matchesDateRange = logDate >= fromDate && logDate <= toDate;
    }
    
    return matchesSearch && matchesUser && matchesAction && matchesStatus && matchesModule && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (entry: AuditLogEntry) => {
    setSelectedEntry(entry);
    setIsDetailModalOpen(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Exporting audit logs...');
      // In real implementation, this would trigger file download
    } catch (err) {
      setError('Lỗi khi xuất dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Lỗi khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setUserFilter('all');
    setActionFilter('all');
    setStatusFilter('all');
    setModuleFilter('all');
    setDateFromFilter('');
    setDateToFilter('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return <PageLoading text="Đang tải nhật ký hoạt động..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nhật Ký Hoạt Động</h1>
              <p className="text-purple-100">
                Theo dõi và ghi lại tất cả hoạt động trong hệ thống
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm Mới
            </Button>
            <Button 
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {isExporting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Xuất Báo Cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <FormError message={error} />
      )}

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
                <p className="text-xs text-green-600">+12% so với hôm qua</p>
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
                <p className="text-xs text-gray-500">96.1% tổng số</p>
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
                <p className="text-xs text-red-600">3.0% tổng số</p>
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
                <p className="text-xs text-orange-600">0.9% tổng số</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Bộ Lọc Tìm Kiếm</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Xóa Bộ Lọc
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo người dùng, hành động, chi tiết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất Cả Người Dùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Người Dùng</SelectItem>
                <SelectItem value="Nguyễn Văn An">Nguyễn Văn An</SelectItem>
                <SelectItem value="Trần Thị Lan">Trần Thị Lan</SelectItem>
                <SelectItem value="Lê Minh Cường">Lê Minh Cường</SelectItem>
                <SelectItem value="Phạm Thị Minh">Phạm Thị Minh</SelectItem>
                <SelectItem value="Vũ Thanh Hải">Vũ Thanh Hải</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất Cả Mô-đun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Mô-đun</SelectItem>
                <SelectItem value="voucher">Voucher</SelectItem>
                <SelectItem value="customer">Khách Hàng</SelectItem>
                <SelectItem value="auth">Xác Thực</SelectItem>
                <SelectItem value="system">Hệ Thống</SelectItem>
                <SelectItem value="admin">Quản Trị</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất Cả Hành Động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Hành Động</SelectItem>
                <SelectItem value="Phát hành voucher">Phát Hành Voucher</SelectItem>
                <SelectItem value="Đăng nhập hệ thống">Đăng Nhập</SelectItem>
                <SelectItem value="Cập nhật thông tin khách hàng">Cập Nhật Thông Tin</SelectItem>
                <SelectItem value="Thêm khách hàng mới">Thêm Khách Hàng</SelectItem>
                <SelectItem value="Hủy voucher">Hủy Voucher</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất Cả Trạng Thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
                <SelectItem value="success">Thành Công</SelectItem>
                <SelectItem value="failed">Thất Bại</SelectItem>
                <SelectItem value="warning">Cảnh Báo</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Từ ngày"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />

            <Input
              type="date"
              placeholder="Đến ngày"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Nhật Ký Chi Tiết ({filteredLogs.length} hoạt động)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            searchTerm || userFilter !== 'all' || actionFilter !== 'all' || statusFilter !== 'all' || moduleFilter !== 'all' ? (
              <EmptySearchState searchTerm={searchTerm || "bộ lọc hiện tại"} />
            ) : (
              <EmptyAuditLogState />
            )
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thời Gian</TableHead>
                      <TableHead>Người Dùng</TableHead>
                      <TableHead>Hành Động</TableHead>
                      <TableHead>Tài Nguyên</TableHead>
                      <TableHead>Mô-đun</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Chi Tiết</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log) => (
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
                            {getModuleIcon(log.module)}
                            <span>{getModuleText(log.module)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(log.status)}
                            <Badge className={getStatusColor(log.status)}>
                              {getStatusText(log.status)}
                            </Badge>
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
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(log)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi Tiết Hoạt Động</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Thời Gian</label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {selectedEntry.timestamp}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Người Dùng</label>
                  <p className="text-sm bg-gray-100 p-2 rounded">
                    {selectedEntry.user} ({selectedEntry.userRole === 'admin' ? 'Quản Trị Viên' : 'Telesales'})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hành Động</label>
                  <p className="text-sm bg-gray-100 p-2 rounded">
                    {selectedEntry.action}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tài Nguyên</label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {selectedEntry.resource}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mô-đun</label>
                  <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                    {getModuleIcon(selectedEntry.module)}
                    <span className="text-sm">{getModuleText(selectedEntry.module)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Trạng Thái</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedEntry.status)}
                    <Badge className={getStatusColor(selectedEntry.status)}>
                      {getStatusText(selectedEntry.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IP Address</label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {selectedEntry.ipAddress}
                  </p>
                </div>
                {selectedEntry.sessionId && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Session ID</label>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                      {selectedEntry.sessionId}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Mô Tả Chi Tiết</label>
                <p className="text-sm bg-gray-100 p-3 rounded mt-1">
                  {selectedEntry.details}
                </p>
              </div>

              {selectedEntry.userAgent && (
                <div>
                  <label className="text-sm font-medium text-gray-700">User Agent</label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                    {selectedEntry.userAgent}
                  </p>
                </div>
              )}

              {selectedEntry.changes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Thay Đổi Dữ Liệu</label>
                  <pre className="text-sm bg-gray-100 p-3 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(selectedEntry.changes, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
