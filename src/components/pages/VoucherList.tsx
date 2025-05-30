
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye,
  Edit,
  Calendar,
  Phone,
  User
} from 'lucide-react';

const voucherData = [
  {
    id: 1,
    code: 'VCH-2024-001',
    customerName: 'Nguyễn Thị Hoa',
    customerPhone: '0901234567',
    customerType: 'Premium',
    value: '500.000đ',
    status: 'active',
    issuedBy: 'Nguyễn Văn An',
    issueDate: '20/01/2024',
    expiryDate: '20/02/2024',
    notes: 'Khuyến mãi khách hàng lần đầu'
  },
  {
    id: 2,
    code: 'VCH-2024-002',
    customerName: 'Trần Văn Nam',
    customerPhone: '0907654321',
    customerType: 'Thường',
    value: '250.000đ',
    status: 'used',
    issuedBy: 'Trần Thị Lan',
    issueDate: '19/01/2024',
    expiryDate: '19/02/2024',
    notes: 'Thưởng giới thiệu'
  },
  {
    id: 3,
    code: 'VCH-2024-003',
    customerName: 'Lê Thị Minh',
    customerPhone: '0909876543',
    customerType: 'VIP',
    value: '1.000.000đ',
    status: 'active',
    issuedBy: 'Lê Minh Cường',
    issueDate: '18/01/2024',
    expiryDate: '18/02/2024',
    notes: 'Phần thưởng khách hàng VIP'
  },
  {
    id: 4,
    code: 'VCH-2024-004',
    customerName: 'Phạm Văn Tuấn',
    customerPhone: '0902468135',
    customerType: 'Mới',
    value: '300.000đ',
    status: 'expired',
    issuedBy: 'Phạm Thị Minh',
    issueDate: '01/01/2024',
    expiryDate: '15/01/2024',
    notes: 'Ưu đãi chào mừng'
  },
  {
    id: 5,
    code: 'VCH-2024-005',
    customerName: 'Vũ Thị Nga',
    customerPhone: '0905432109',
    customerType: 'Premium',
    value: '750.000đ',
    status: 'cancelled',
    issuedBy: 'Vũ Thanh Hải',
    issueDate: '17/01/2024',
    expiryDate: '17/02/2024',
    notes: 'Khách hàng yêu cầu hủy'
  }
];

export function VoucherList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang Hoạt Động';
      case 'used':
        return 'Đã Sử Dụng';
      case 'expired':
        return 'Hết Hạn';
      case 'cancelled':
        return 'Đã Hủy';
      default:
        return status;
    }
  };

  const filteredVouchers = voucherData.filter(voucher => {
    const matchesSearch = 
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;
    const matchesType = typeFilter === 'all' || voucher.customerType.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (voucher: any) => {
    setSelectedVoucher(voucher);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quản Lý Voucher</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Xuất File
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                In
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo mã, tên khách hàng, hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
                <SelectItem value="active">Đang Hoạt Động</SelectItem>
                <SelectItem value="used">Đã Sử Dụng</SelectItem>
                <SelectItem value="expired">Hết Hạn</SelectItem>
                <SelectItem value="cancelled">Đã Hủy</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Loại khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Loại</SelectItem>
                <SelectItem value="mới">Mới</SelectItem>
                <SelectItem value="thường">Thường</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Voucher Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Danh Sách Voucher ({filteredVouchers.length})</span>
            <Badge variant="secondary">
              {filteredVouchers.filter(v => v.status === 'active').length} Đang Hoạt Động
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Voucher</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá Trị</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Người Phát Hành</TableHead>
                  <TableHead>Ngày Phát Hành</TableHead>
                  <TableHead>Ngày Hết Hạn</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((voucher) => (
                  <TableRow key={voucher.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono font-medium">
                      {voucher.code}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{voucher.customerName}</div>
                        <div className="text-sm text-gray-500">{voucher.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{voucher.customerType}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {voucher.value}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(voucher.status)}>
                        {getStatusText(voucher.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{voucher.issuedBy}</TableCell>
                    <TableCell>{voucher.issueDate}</TableCell>
                    <TableCell>{voucher.expiryDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(voucher)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Voucher Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Voucher</DialogTitle>
          </DialogHeader>
          
          {selectedVoucher && (
            <div className="space-y-6">
              {/* Voucher Code Display */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <div className="text-3xl font-mono font-bold text-blue-800 mb-2">
                  {selectedVoucher.code}
                </div>
                <div className="text-xl font-semibold text-green-600">
                  {selectedVoucher.value}
                </div>
                <Badge className={`mt-2 ${getStatusColor(selectedVoucher.status)}`}>
                  {getStatusText(selectedVoucher.status)}
                </Badge>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Thông Tin Khách Hàng
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên:</span>
                      <span className="font-medium">{selectedVoucher.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="font-medium">{selectedVoucher.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại:</span>
                      <Badge variant="outline">{selectedVoucher.customerType}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Thông Tin Voucher
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Người phát hành:</span>
                      <span className="font-medium">{selectedVoucher.issuedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày phát hành:</span>
                      <span className="font-medium">{selectedVoucher.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày hết hạn:</span>
                      <span className="font-medium">{selectedVoucher.expiryDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Ghi Chú</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedVoucher.notes || 'Không có ghi chú'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  In Voucher
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh Sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
