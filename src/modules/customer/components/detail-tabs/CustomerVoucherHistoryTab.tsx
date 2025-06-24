
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface VoucherHistory {
  id: string;
  voucherCode: string;
  value: number;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  invoiceReconciliation: string;
  reconciliationResult: 'correct_voucher' | 'wrong_phone' | 'wrong_voucher' | 'not_used' | 'no_invoice';
  generatedInvoice: string;
  customerGeneratedInvoice: 'yes' | 'no';
  actualUsedPhone?: string;
  actualUsedVoucher?: string;
  notes?: string;
}

interface CustomerVoucherHistoryTabProps {
  customerId: string;
}

// Move mock data outside component to avoid re-creation on every render
const mockVoucherHistory: VoucherHistory[] = [
  {
    id: '1',
    voucherCode: 'VC240624001',
    value: 50000,
    status: 'used',
    issuedBy: 'Nguyễn Văn A',
    issueDate: '2024-06-20',
    expiryDate: '2024-07-20',
    invoiceReconciliation: 'HD001234',
    reconciliationResult: 'correct_voucher',
    generatedInvoice: 'HD001234',
    customerGeneratedInvoice: 'yes',
    notes: 'Sử dụng đúng quy định'
  },
  {
    id: '2',
    voucherCode: 'VC240624002',
    value: 100000,
    status: 'used',
    issuedBy: 'Trần Thị B',
    issueDate: '2024-06-18',
    expiryDate: '2024-07-18',
    invoiceReconciliation: 'HD001235',
    reconciliationResult: 'wrong_phone',
    generatedInvoice: 'HD001235',
    customerGeneratedInvoice: 'yes',
    actualUsedPhone: '0987654321',
    notes: 'Khách sử dụng voucher cho số điện thoại khác'
  },
  {
    id: '3',
    voucherCode: 'VC240624003',
    value: 200000,
    status: 'used',
    issuedBy: 'Lê Văn C',
    issueDate: '2024-06-15',
    expiryDate: '2024-07-15',
    invoiceReconciliation: 'HD001236',
    reconciliationResult: 'wrong_voucher',
    generatedInvoice: 'HD001236',
    customerGeneratedInvoice: 'yes',
    actualUsedVoucher: 'VC240624010',
    notes: 'Khách sử dụng voucher khác thay vì voucher được cấp'
  },
  {
    id: '4',
    voucherCode: 'VC240624004',
    value: 300000,
    status: 'active',
    issuedBy: 'Phạm Thị D',
    issueDate: '2024-06-22',
    expiryDate: '2024-07-22',
    invoiceReconciliation: '',
    reconciliationResult: 'not_used',
    generatedInvoice: '',
    customerGeneratedInvoice: 'no',
    notes: 'Voucher chưa được sử dụng'
  },
  {
    id: '5',
    voucherCode: 'VC240624005',
    value: 500000,
    status: 'expired',
    issuedBy: 'Hoàng Văn E',
    issueDate: '2024-05-15',
    expiryDate: '2024-06-15',
    invoiceReconciliation: '',
    reconciliationResult: 'not_used',
    generatedInvoice: 'HD001237',
    customerGeneratedInvoice: 'yes',
    notes: 'Khách phát sinh hóa đơn nhưng không sử dụng voucher'
  },
  {
    id: '6',
    voucherCode: 'VC240624006',
    value: 50000,
    status: 'cancelled',
    issuedBy: 'Nguyễn Thị F',
    issueDate: '2024-06-10',
    expiryDate: '2024-07-10',
    invoiceReconciliation: '',
    reconciliationResult: 'no_invoice',
    generatedInvoice: '',
    customerGeneratedInvoice: 'no',
    notes: 'Voucher bị hủy do yêu cầu khách hàng'
  }
];

export function CustomerVoucherHistoryTab({ customerId }: CustomerVoucherHistoryTabProps) {
  const [loading, setLoading] = useState(false); // Remove initial loading state
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherHistory | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800", label: "Đang Hoạt Động" },
      used: { className: "bg-blue-100 text-blue-800", label: "Đã Sử Dụng" },
      expired: { className: "bg-red-100 text-red-800", label: "Hết Hạn" },
      cancelled: { className: "bg-gray-100 text-gray-800", label: "Đã Hủy" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getReconciliationResultBadge = (result: string) => {
    const resultConfig = {
      correct_voucher: { className: "bg-green-100 text-green-800", label: "Dùng Đúng Voucher" },
      wrong_phone: { className: "bg-orange-100 text-orange-800", label: "Dùng Sai SĐT" },
      wrong_voucher: { className: "bg-red-100 text-red-800", label: "Dùng Voucher Khác" },
      not_used: { className: "bg-gray-100 text-gray-800", label: "Không Sử Dụng" },
      no_invoice: { className: "bg-yellow-100 text-yellow-800", label: "Chưa Phát Sinh Đơn" }
    };
    const config = resultConfig[result as keyof typeof resultConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleVoucherClick = (voucher: VoucherHistory) => {
    setSelectedVoucher(voucher);
    setIsDetailModalOpen(true);
  };

  const handleInvoiceClick = (invoiceCode: string) => {
    // Open in new tab instead of navigation
    window.open(`/ERP/Invoices/${invoiceCode}`, '_blank');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold theme-text">Lịch Sử Phát/Sử Dụng Voucher</h3>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Mã Voucher</TableHead>
              <TableHead className="font-medium">Giá Trị</TableHead>
              <TableHead className="font-medium">Trạng Thái</TableHead>
              <TableHead className="font-medium">Người Phát Hành</TableHead>
              <TableHead className="font-medium">Ngày Phát Hành</TableHead>
              <TableHead className="font-medium">Ngày Hết Hạn</TableHead>
              <TableHead className="font-medium">Đối Soát HĐ</TableHead>
              <TableHead className="font-medium">Kết Quả Đối Soát</TableHead>
              <TableHead className="font-medium">Hóa Đơn Phát Sinh</TableHead>
              <TableHead className="font-medium">KH Phát Sinh HĐ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVoucherHistory.map((voucher) => (
              <TableRow 
                key={voucher.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleVoucherClick(voucher)}
              >
                <TableCell className="font-medium text-blue-600">{voucher.voucherCode}</TableCell>
                <TableCell>{formatCurrency(voucher.value)}</TableCell>
                <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                <TableCell>{voucher.issuedBy}</TableCell>
                <TableCell>{new Date(voucher.issueDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{voucher.invoiceReconciliation || '-'}</TableCell>
                <TableCell>{getReconciliationResultBadge(voucher.reconciliationResult)}</TableCell>
                <TableCell>
                  {voucher.generatedInvoice ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInvoiceClick(voucher.generatedInvoice);
                      }}
                    >
                      {voucher.generatedInvoice}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={voucher.customerGeneratedInvoice === 'yes' ? 'default' : 'secondary'}>
                    {voucher.customerGeneratedInvoice === 'yes' ? 'Có' : 'Không'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Voucher Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Voucher</DialogTitle>
          </DialogHeader>
          {selectedVoucher && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Mã Voucher:</label>
                  <p className="font-semibold">{selectedVoucher.voucherCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Giá Trị:</label>
                  <p className="font-semibold">{formatCurrency(selectedVoucher.value)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng Thái:</label>
                  <div className="mt-1">{getStatusBadge(selectedVoucher.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Người Phát Hành:</label>
                  <p className="font-semibold">{selectedVoucher.issuedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày Phát Hành:</label>
                  <p className="font-semibold">{new Date(selectedVoucher.issueDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày Hết Hạn:</label>
                  <p className="font-semibold">{new Date(selectedVoucher.expiryDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Thông Tin Đối Soát</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Kết Quả Đối Soát:</label>
                    <div className="mt-1">{getReconciliationResultBadge(selectedVoucher.reconciliationResult)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Hóa Đơn Liên Kết:</label>
                    <p className="font-semibold">{selectedVoucher.invoiceReconciliation || 'Chưa có'}</p>
                  </div>
                  {selectedVoucher.actualUsedPhone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">SĐT Sử Dụng Thực Tế:</label>
                      <p className="font-semibold text-orange-600">{selectedVoucher.actualUsedPhone}</p>
                    </div>
                  )}
                  {selectedVoucher.actualUsedVoucher && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Voucher Sử Dụng Thực Tế:</label>
                      <p className="font-semibold text-red-600">{selectedVoucher.actualUsedVoucher}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedVoucher.notes && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-600">Ghi Chú:</label>
                  <p className="mt-1 text-gray-800">{selectedVoucher.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
