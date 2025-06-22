import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { User } from '@/types/auth';
import { Voucher } from '../types';
import { VoucherTable } from '../components/VoucherTable';
import { VoucherFilters, VoucherFilters as VoucherFiltersType } from '../components/VoucherFilters';
import { VoucherSearchActions } from '../components/VoucherSearchActions';
import { toast } from '@/hooks/use-toast';

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
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  
  // Selection states
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState<VoucherFiltersType>({
    search: '',
    status: [],
    issuedBy: [],
    denomination: [],
    invoiceReconciliation: 'all',
    customerGeneratedInvoice: 'all',
    voucherReconciliationResult: 'all',
    issueDateFrom: null,
    issueDateTo: null,
    expiryDateFrom: null,
    expiryDateTo: null,
    usedDateFrom: null,
    usedDateTo: null,
    valueFrom: '',
    valueTo: ''
  });

  // Detail modal states
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const canViewAllVouchers = currentUser.permissions.canViewAllVouchers || 
    currentUser.role === 'erp-admin' || 
    currentUser.role === 'voucher-admin';

  // Get available issuers for filter
  const availableIssuers = useMemo(() => {
    const issuers = [...new Set(mockVouchers.map(voucher => voucher.issuedBy))];
    return issuers;
  }, []);

  // Filter vouchers based on all filter criteria
  const filteredVouchers = useMemo(() => {
    let result = mockVouchers;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(voucher => 
        voucher.code.toLowerCase().includes(searchLower) ||
        voucher.customerName.toLowerCase().includes(searchLower) ||
        voucher.customerPhone.includes(searchLower)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(voucher => filters.status.includes(voucher.status));
    }

    // Issued by filter
    if (filters.issuedBy.length > 0) {
      result = result.filter(voucher => filters.issuedBy.includes(voucher.issuedBy));
    }

    // Denomination filter
    if (filters.denomination.length > 0) {
      result = result.filter(voucher => {
        const value = voucher.value.replace(/[^\d]/g, '');
        return filters.denomination.includes(value);
      });
    }

    // Reconciliation filters
    if (filters.invoiceReconciliation !== 'all') {
      result = result.filter(voucher => voucher.invoiceReconciliation === filters.invoiceReconciliation);
    }

    if (filters.customerGeneratedInvoice !== 'all') {
      result = result.filter(voucher => voucher.customerGeneratedInvoice === filters.customerGeneratedInvoice);
    }

    if (filters.voucherReconciliationResult !== 'all') {
      result = result.filter(voucher => voucher.voucherReconciliationResult === filters.voucherReconciliationResult);
    }

    // Value range filter
    if (filters.valueFrom || filters.valueTo) {
      result = result.filter(voucher => {
        const value = parseInt(voucher.value.replace(/[^\d]/g, ''));
        const minValue = filters.valueFrom ? parseInt(filters.valueFrom) : 0;
        const maxValue = filters.valueTo ? parseInt(filters.valueTo) : Infinity;
        return value >= minValue && value <= maxValue;
      });
    }

    // Date filters (implement as needed)
    // Add date filtering logic here

    return result;
  }, [filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);

  // Selection handlers
  const handleSelectVoucher = (voucherId: string, checked: boolean) => {
    if (checked) {
      setSelectedVouchers(prev => [...prev, voucherId]);
    } else {
      setSelectedVouchers(prev => prev.filter(id => id !== voucherId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageVouchers = filteredVouchers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      setSelectedVouchers(pageVouchers.map(voucher => voucher.id));
    } else {
      setSelectedVouchers([]);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Đã sao chép",
      description: `Đã sao chép mã voucher: ${code}`,
    });
  };

  const handleViewDetail = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDetailDialogOpen(true);
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
        <VoucherSearchActions
          filteredVouchers={filteredVouchers}
          selectedVouchers={selectedVouchers}
        />
      </div>

      {/* Search and Filters */}
      <Card className="voucher-card">
        <CardContent className="pt-6">
          <VoucherFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableIssuers={availableIssuers}
          />
        </CardContent>
      </Card>

      {/* Voucher Table */}
      <Card className="voucher-card">
        <CardHeader>
          <CardTitle className="theme-text">
            Danh Sách Voucher ({filteredVouchers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredVouchers.length > 0 ? (
            <VoucherTable
              vouchers={filteredVouchers}
              selectedVouchers={selectedVouchers}
              handleSelectVoucher={handleSelectVoucher}
              handleSelectAll={handleSelectAll}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalVouchers={filteredVouchers.length}
              totalPages={totalPages}
              onViewDetail={handleViewDetail}
              onCopyCode={handleCopyCode}
            />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 theme-bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 theme-text-primary" />
              </div>
              <h3 className="text-lg font-medium theme-text mb-2">
                Không Tìm Thấy Voucher
              </h3>
              <p className="theme-text-muted mb-4">
                {filters.search || filters.status.length > 0 || filters.issuedBy.length > 0 
                  ? 'Không có voucher nào phù hợp với bộ lọc hiện tại.' 
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
