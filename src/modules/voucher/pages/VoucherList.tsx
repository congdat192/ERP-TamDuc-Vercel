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

// Enhanced mock voucher data with reconciliation information
const mockVouchers: Voucher[] = [
  {
    id: 'voucher-001',
    code: 'VCH-2024-001234',
    value: '500.000đ',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901234567',
    status: 'used',
    issueDate: '15/12/2024',
    expiryDate: '15/01/2025',
    issuedBy: 'Trần Thị Lan',
    usedDate: '20/12/2024',
    notes: 'Voucher cho khách hàng VIP',
    invoiceReconciliation: 'reconciled',
    voucherReconciliationResult: 'correct_voucher',
    generatedInvoice: 'HD-2024-5678 (20/12/2024)',
    customerGeneratedInvoice: 'yes'
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
    usedDate: '18/12/2024',
    notes: 'Đã sử dụng tại cửa hàng',
    invoiceReconciliation: 'reconciled',
    voucherReconciliationResult: 'correct_voucher',
    generatedInvoice: 'HD-2024-5679 (18/12/2024)',
    customerGeneratedInvoice: 'yes'
  },
  {
    id: 'voucher-003',
    code: 'VCH-2024-001236',
    value: '200.000đ',
    customerName: 'Lê Thị Cúc',
    customerPhone: '0903456789',
    status: 'used',
    issueDate: '18/12/2024',
    expiryDate: '18/01/2025',
    issuedBy: 'Phạm Thị Hoa',
    usedDate: '22/12/2024',
    notes: 'Voucher khuyến mãi',
    invoiceReconciliation: 'reconciled',
    voucherReconciliationResult: 'wrong_phone',
    generatedInvoice: 'HD-2024-5680 (22/12/2024)',
    customerGeneratedInvoice: 'yes',
    actualUsedPhone: '0987654321'
  },
  {
    id: 'voucher-004',
    code: 'VCH-2024-001237',
    value: '100.000đ',
    customerName: 'Phạm Văn Dũng',
    customerPhone: '0904567890',
    status: 'used',
    issueDate: '01/11/2024',
    expiryDate: '01/12/2024',
    issuedBy: 'Lê Văn Tú',
    usedDate: '25/11/2024',
    notes: 'Voucher hết hạn',
    invoiceReconciliation: 'reconciled',
    voucherReconciliationResult: 'wrong_voucher',
    generatedInvoice: 'HD-2024-5681 (25/11/2024)',
    customerGeneratedInvoice: 'yes',
    actualUsedVoucher: 'VCH-2024-001250'
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
    notes: 'Voucher sinh nhật',
    invoiceReconciliation: 'reconciled',
    voucherReconciliationResult: 'not_used',
    generatedInvoice: 'HD-2024-5682 (23/12/2024)',
    customerGeneratedInvoice: 'yes'
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
    notes: 'Hủy theo yêu cầu khách hàng',
    invoiceReconciliation: 'reconciled',
    voucherReconciliationResult: 'not_used',
    generatedInvoice: 'HD-2024-5683 (10/12/2024)',
    customerGeneratedInvoice: 'yes'
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
    notes: 'Voucher khách hàng thân thiết',
    invoiceReconciliation: 'not_reconciled',
    voucherReconciliationResult: 'no_invoice',
    customerGeneratedInvoice: 'no'
  },
  {
    id: 'voucher-008',
    code: 'VCH-2024-001241',
    value: '350.000đ',
    customerName: 'Ngô Văn Hải',
    customerPhone: '0908901234',
    status: 'active',
    issueDate: '08/12/2024',
    expiryDate: '08/01/2025',
    issuedBy: 'Lý Thị Kim',
    notes: 'Voucher mới phát hành',
    invoiceReconciliation: 'not_reconciled',
    voucherReconciliationResult: 'no_invoice',
    customerGeneratedInvoice: 'no'
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

  const getReconciliationColor = (status: string) => {
    switch (status) {
      case 'reconciled': return 'bg-green-100 text-green-800';
      case 'not_reconciled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReconciliationText = (status: string) => {
    switch (status) {
      case 'reconciled': return 'Đã Đối Soát';
      case 'not_reconciled': return 'Chưa Đối Soát';
      default: return 'Không Xác Định';
    }
  };

  const getReconciliationResultColor = (result: string) => {
    switch (result) {
      case 'correct_voucher': return 'bg-green-100 text-green-800';
      case 'wrong_phone': return 'bg-orange-100 text-orange-800';
      case 'wrong_voucher': return 'bg-red-100 text-red-800';
      case 'not_used': return 'bg-blue-100 text-blue-800';
      case 'no_invoice': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReconciliationResultText = (result: string) => {
    switch (result) {
      case 'correct_voucher': return 'Dùng Đúng Voucher';
      case 'wrong_phone': return 'Dùng Sai SĐT';
      case 'wrong_voucher': return 'Dùng Voucher Khác';
      case 'not_used': return 'Không Sử Dụng';
      case 'no_invoice': return 'Chưa Phát Sinh Đơn';
      default: return 'Không Xác Định';
    }
  };

  const getCustomerInvoiceColor = (hasInvoice: string) => {
    switch (hasInvoice) {
      case 'yes': return 'bg-green-100 text-green-800';
      case 'no': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerInvoiceText = (hasInvoice: string) => {
    switch (hasInvoice) {
      case 'yes': return 'Có';
      case 'no': return 'Không';
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
            <div className="overflow-x-auto">
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
                    <TableHead>Đối Soát HĐ</TableHead>
                    <TableHead>Kết Quả Đối Soát</TableHead>
                    <TableHead>Hóa Đơn Phát Sinh</TableHead>
                    <TableHead>KH Phát Sinh HĐ</TableHead>
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
                      <TableCell>
                        <Badge className={getReconciliationColor(voucher.invoiceReconciliation)}>
                          {getReconciliationText(voucher.invoiceReconciliation)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getReconciliationResultColor(voucher.voucherReconciliationResult)}>
                          {getReconciliationResultText(voucher.voucherReconciliationResult)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {voucher.generatedInvoice || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCustomerInvoiceColor(voucher.customerGeneratedInvoice)}>
                          {getCustomerInvoiceText(voucher.customerGeneratedInvoice)}
                        </Badge>
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
            </div>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="theme-text">Chi Tiết Voucher</DialogTitle>
          </DialogHeader>
          {selectedVoucher && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-semibold theme-text-muted mb-3">Thông Tin Cơ Bản</h4>
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
              </div>

              {/* Reconciliation Information */}
              <div>
                <h4 className="text-sm font-semibold theme-text-muted mb-3">Thông Tin Đối Soát</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium theme-text-muted">Đối Soát Hóa Đơn</Label>
                    <Badge className={getReconciliationColor(selectedVoucher.invoiceReconciliation)}>
                      {getReconciliationText(selectedVoucher.invoiceReconciliation)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium theme-text-muted">Kết Quả Đối Soát</Label>
                    <Badge className={getReconciliationResultColor(selectedVoucher.voucherReconciliationResult)}>
                      {getReconciliationResultText(selectedVoucher.voucherReconciliationResult)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium theme-text-muted">Hóa Đơn Phát Sinh</Label>
                    <p className="text-sm">{selectedVoucher.generatedInvoice || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium theme-text-muted">KH Phát Sinh HĐ</Label>
                    <Badge className={getCustomerInvoiceColor(selectedVoucher.customerGeneratedInvoice)}>
                      {getCustomerInvoiceText(selectedVoucher.customerGeneratedInvoice)}
                    </Badge>
                  </div>
                  {selectedVoucher.actualUsedPhone && (
                    <div>
                      <Label className="text-sm font-medium theme-text-muted">SĐT Sử Dụng Thực Tế</Label>
                      <p className="text-sm font-medium text-orange-600">{selectedVoucher.actualUsedPhone}</p>
                    </div>
                  )}
                  {selectedVoucher.actualUsedVoucher && (
                    <div>
                      <Label className="text-sm font-medium theme-text-muted">Voucher Sử Dụng Thực Tế</Label>
                      <p className="text-sm font-medium text-red-600">{selectedVoucher.actualUsedVoucher}</p>
                    </div>
                  )}
                </div>
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
