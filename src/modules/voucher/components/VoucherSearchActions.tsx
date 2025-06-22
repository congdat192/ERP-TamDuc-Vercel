
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, RotateCcw, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Voucher } from '../types';
import { toast } from '@/hooks/use-toast';

interface VoucherSearchActionsProps {
  filteredVouchers: Voucher[];
  selectedVouchers: string[];
  onExportSuccess?: () => void;
}

export function VoucherSearchActions({ 
  filteredVouchers, 
  selectedVouchers, 
  onExportSuccess 
}: VoucherSearchActionsProps) {
  const [isReissueDialogOpen, setIsReissueDialogOpen] = useState(false);
  const [reissuePhone, setReissuePhone] = useState('');
  const [reissueReason, setReissueReason] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleReissueVoucher = () => {
    if (!reissuePhone.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại khách hàng",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Re-issuing voucher for phone:', reissuePhone);
    console.log('Reason:', reissueReason);
    
    // Reset form
    setReissuePhone('');
    setReissueReason('');
    setIsReissueDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Voucher đã được cấp lại thành công!",
    });
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    
    try {
      // Prepare data for export - include all columns
      const exportData = filteredVouchers.map(voucher => ({
        'Mã Voucher': voucher.code,
        'Tên Khách Hàng': voucher.customerName,
        'Số Điện Thoại': voucher.customerPhone,
        'Giá Trị': voucher.value,
        'Trạng Thái': getStatusText(voucher.status),
        'Ngày Phát Hành': voucher.issueDate,
        'Ngày Hết Hạn': voucher.expiryDate,
        'Người Phát Hành': voucher.issuedBy,
        'Ngày Sử Dụng': voucher.usedDate || '',
        'Ghi Chú': voucher.notes || '',
        'Đối Soát Hóa Đơn': getReconciliationText(voucher.invoiceReconciliation),
        'Kết Quả Đối Soát': getReconciliationResultText(voucher.voucherReconciliationResult),
        'Hóa Đơn Phát Sinh': voucher.generatedInvoice || '',
        'KH Phát Sinh HĐ': getCustomerInvoiceText(voucher.customerGeneratedInvoice),
        'SĐT Sử Dụng Thực Tế': voucher.actualUsedPhone || '',
        'Voucher Sử Dụng Thực Tế': voucher.actualUsedVoucher || ''
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 18 }, // Mã Voucher
        { wch: 20 }, // Tên Khách Hàng
        { wch: 15 }, // Số Điện Thoại
        { wch: 12 }, // Giá Trị
        { wch: 15 }, // Trạng Thái
        { wch: 15 }, // Ngày Phát Hành
        { wch: 15 }, // Ngày Hết Hạn
        { wch: 18 }, // Người Phát Hành
        { wch: 15 }, // Ngày Sử Dụng
        { wch: 30 }, // Ghi Chú
        { wch: 15 }, // Đối Soát Hóa Đơn
        { wch: 20 }, // Kết Quả Đối Soát
        { wch: 25 }, // Hóa Đơn Phát Sinh
        { wch: 15 }, // KH Phát Sinh HĐ
        { wch: 18 }, // SĐT Sử Dụng Thực Tế
        { wch: 20 }  // Voucher Sử Dụng Thực Tế
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh Sách Voucher');

      // Generate filename with current date
      const currentDate = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
      const filename = `Danh_Sach_Voucher_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      toast({
        title: "Xuất Excel thành công",
        description: `Đã xuất ${exportData.length} voucher ra file ${filename}`,
      });

      onExportSuccess?.();
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Lỗi xuất Excel",
        description: "Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
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

  const getReconciliationText = (status: string) => {
    switch (status) {
      case 'reconciled': return 'Đã Đối Soát';
      case 'not_reconciled': return 'Chưa Đối Soát';
      default: return 'Không Xác Định';
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

  const getCustomerInvoiceText = (hasInvoice: string) => {
    switch (hasInvoice) {
      case 'yes': return 'Có';
      case 'no': return 'Không';
      default: return 'Không Xác Định';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Export Excel Button */}
      <Button
        onClick={exportToExcel}
        disabled={isExporting || filteredVouchers.length === 0}
        className="voucher-button-secondary"
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Đang xuất...' : `Xuất Excel (${filteredVouchers.length})`}
      </Button>

      {/* Reissue Voucher Button */}
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
  );
}
