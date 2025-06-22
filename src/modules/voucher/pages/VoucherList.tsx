
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, RotateCcw, Plus, Eye, Copy, MoreVertical } from 'lucide-react';
import { User } from '@/types/auth';
import { Voucher } from '../types';

interface VoucherListProps {
  currentUser: User;
}

// Mock voucher data based on customer module data
const mockVouchers: Voucher[] = [
  {
    id: 'voucher-001',
    code: 'VCH-2024-001234',
    value: '500.000đ',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901234567',
    status: 'active',
    issueDate: '15/12/2024',
    expiryDate: '15/01/2025',
    issuedBy: 'Trần Thị Lan',
    notes: 'Voucher cho khách hàng VIP'
  },
  {
    id: 'voucher-002',
    code: 'VCH-2024-001235',
    value: '300.000đ',
    customerName: 'Trần Thị Bình',
    customerPhone: '0902345678',
    status: 'used',
    issueDate: '10/12/2024',
    expiryDate: '10/01/2025',
    issuedBy: 'Nguyễn Văn Minh',
    usedDate: '20/12/2024',
    notes: 'Đã sử dụng tại cửa hàng'
  },
  {
    id: 'voucher-003',
    code: 'VCH-2024-001236',
    value: '200.000đ',
    customerName: 'Lê Thị Cúc',
    customerPhone: '0903456789',
    status: 'active',
    issueDate: '18/12/2024',
    expiryDate: '18/01/2025',
    issuedBy: 'Phạm Thị Hoa',
    notes: 'Voucher khuyến mãi'
  },
  {
    id: 'voucher-004',
    code: 'VCH-2024-001237',
    value: '100.000đ',
    customerName: 'Phạm Văn Dũng',
    customerPhone: '0904567890',
    status: 'expired',
    issueDate: '01/11/2024',
    expiryDate: '01/12/2024',
    issuedBy: 'Lê Văn Tú',
    notes: 'Voucher hết hạn'
  },
  {
    id: 'voucher-005',
    code: 'VCH-2024-001238',
    value: '250.000đ',
    customerName: 'Hoàng Thị Em',
    customerPhone: '0905678901',
    status: 'active',
    issueDate: '22/12/2024',
    expiryDate: '22/01/2025',
    issuedBy: 'Đỗ Thị Mai',
    notes: 'Voucher sinh nhật'
  },
  {
    id: 'voucher-006',
    code: 'VCH-2024-001239',
    value: '150.000đ',
    customerName: 'Vũ Văn Phúc',
    customerPhone: '0906789012',
    status: 'cancelled',
    issueDate: '05/12/2024',
    expiryDate: '05/01/2025',
    issuedBy: 'Bùi Thị Nga',
    notes: 'Hủy theo yêu cầu khách hàng'
  },
  {
    id: 'voucher-007',
    code: 'VCH-2024-001240',
    value: '400.000đ',
    customerName: 'Đặng Thị Giang',
    customerPhone: '0907890123',
    status: 'active',
    issueDate: '20/12/2024',
    expiryDate: '20/01/2025',
    issuedBy: 'Trần Văn Hùng',
    notes: 'Voucher khách hàng thân thiết'
  },
  {
    id: 'voucher-008',
    code: 'VCH-2024-001241',
    value: '350.000đ',
    customerName: 'Ngô Văn Hải',
    customerPhone: '0908901234',
    status: 'used',
    issueDate: '08/12/2024',
    expiryDate: '08/01/2025',
    issuedBy: 'Lý Thị Kim',
    usedDate: '18/12/2024',
    notes: 'Đã sử dụng online'
  }
];

export function VoucherList({ currentUser }: VoucherListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isReissueDialogOpen, setIsReissueDialogOpen] = useState(false);
  const [reissuePhone, setReissuePhone] = useState('');
  const [reissueReason, setReissueReason] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const canViewAllVouchers = currentUser.permissions.canViewAllVouchers || 
    currentUser.role === 'erp-admin' || 
    currentUser.role === 'voucher-admin';

  // Filter vouchers based on search query
  const filteredVouchers = mockVouchers.filter(voucher => 
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.customerPhone.includes(searchQuery)
  );

  const handleReissueVoucher = () => {
    if (!reissuePhone.trim()) {
      alert('Vui lòng nhập số điện thoại khách hàng');
      return;
    }
    
    console.log('Re-issuing voucher for phone:', reissuePhone);
    console.log('Reason:', reissueReason);
    console.log('Re-issued by:', currentUser.fullName);
    
    // Reset form
    setReissuePhone('');
    setReissueReason('');
    setIsReissueDialogOpen(false);
    
    alert('Voucher đã được cấp lại thành công!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang Hoạt Động';
      case 'used': return 'Đã Sử Dụng';
      case 'expired': return 'Hết Hạn';
      case 'cancelled': return 'Đã Hủy';
      default: return 'Không Xác Định';
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã voucher: ${code}`);
  };

  const handleViewDetail = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold theme-text">Danh Sách Voucher</h2>
          <p className="theme-text-muted">
            {canViewAllVouchers 
              ? 'Quản lý tất cả voucher trong hệ thống' 
              : 'Voucher do bạn phát hành'}
          </p>
        </div>
        <Dialog open={isReissueDialogOpen} onOpenChange={setIsReissueDialogOpen}>
          <DialogTrigger asChild>
            <Button className="voucher-button-primary">
              <RotateCcw className="w-4 h-4 mr-2" />
              Cấp Lại Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md voucher-card">
            <DialogHeader>
              <DialogTitle className="theme-text">Cấp Lại Voucher Cho Khách Hàng</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reissue-phone" className="theme-text">Số Điện Thoại Khách Hàng *</Label>
                <Input
                  id="reissue-phone"
                  placeholder="Nhập số điện thoại"
                  value={reissuePhone}
                  onChange={(e) => setReissuePhone(e.target.value)}
                  className="theme-border-primary/20"
                />
              </div>
              <div>
                <Label htmlFor="reissue-reason" className="theme-text">Lý Do Cấp Lại</Label>
                <Textarea
                  id="reissue-reason"
                  placeholder="Ví dụ: Khách hàng mất voucher gốc"
                  value={reissueReason}
                  onChange={(e) => setReissueReason(e.target.value)}
                  className="theme-border-primary/20"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReissueDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleReissueVoucher} className="voucher-button-primary">
                  Cấp Lại Voucher
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="voucher-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo mã voucher, tên khách hàng, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 theme-border-primary/20"
                />
              </div>
            </div>
            <Button variant="outline" className="whitespace-nowrap theme-border-primary/20">
              <Filter className="w-4 h-4 mr-2" />
              Bộ Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voucher List */}
      <Card className="voucher-card">
        <CardHeader>
          <CardTitle className="theme-text">
            Danh Sách Voucher ({filteredVouchers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVouchers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Voucher</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Số Điện Thoại</TableHead>
                  <TableHead>Giá Trị</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Ngày Phát Hành</TableHead>
                  <TableHead>Hết Hạn</TableHead>
                  <TableHead>Người Phát Hành</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-mono font-medium">
                      {voucher.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {voucher.customerName}
                    </TableCell>
                    <TableCell>{voucher.customerPhone}</TableCell>
                    <TableCell className="font-bold theme-text-primary">
                      {voucher.value}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(voucher.status)}>
                        {getStatusText(voucher.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{voucher.issueDate}</TableCell>
                    <TableCell>{voucher.expiryDate}</TableCell>
                    <TableCell className="text-sm theme-text-muted">
                      {voucher.issuedBy}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(voucher.code)}
                          title="Sao chép mã"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(voucher)}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 theme-bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 theme-text-primary" />
              </div>
              <h3 className="text-lg font-medium theme-text mb-2">
                Không Tìm Thấy Voucher
              </h3>
              <p className="theme-text-muted mb-4">
                {searchQuery 
                  ? 'Không có voucher nào phù hợp với từ khóa tìm kiếm.' 
                  : 'Hệ thống chưa có voucher nào được phát hành.'}
              </p>
              <Badge className="theme-badge-secondary text-sm">
                Vai trò: {currentUser.role === 'erp-admin' ? 'Quản Trị ERP' :
                         currentUser.role === 'voucher-admin' ? 'Quản Lý Voucher' :
                         currentUser.role === 'telesales' ? 'Nhân Viên Telesales' : 'Tùy Chỉnh'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voucher Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="theme-text">Chi Tiết Voucher</DialogTitle>
          </DialogHeader>
          {selectedVoucher && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Mã Voucher</Label>
                  <p className="font-mono font-bold">{selectedVoucher.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Giá Trị</Label>
                  <p className="font-bold theme-text-primary text-lg">{selectedVoucher.value}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Khách Hàng</Label>
                  <p className="font-medium">{selectedVoucher.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Số Điện Thoại</Label>
                  <p>{selectedVoucher.customerPhone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Trạng Thái</Label>
                  <Badge className={getStatusColor(selectedVoucher.status)}>
                    {getStatusText(selectedVoucher.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Người Phát Hành</Label>
                  <p className="text-sm">{selectedVoucher.issuedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Ngày Phát Hành</Label>
                  <p>{selectedVoucher.issueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Hết Hạn</Label>
                  <p>{selectedVoucher.expiryDate}</p>
                </div>
                {selectedVoucher.usedDate && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium theme-text-muted">Ngày Sử Dụng</Label>
                    <p>{selectedVoucher.usedDate}</p>
                  </div>
                )}
              </div>
              {selectedVoucher.notes && (
                <div>
                  <Label className="text-sm font-medium theme-text-muted">Ghi Chú</Label>
                  <p className="text-sm">{selectedVoucher.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
