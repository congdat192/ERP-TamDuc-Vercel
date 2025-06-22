
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Copy } from 'lucide-react';
import { Voucher } from '../types';

interface VoucherTableProps {
  vouchers: Voucher[];
  selectedVouchers: string[];
  handleSelectVoucher: (voucherId: string, checked: boolean) => void;
  handleSelectAll: (checked: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalVouchers: number;
  totalPages: number;
  onViewDetail: (voucher: Voucher) => void;
  onCopyCode: (code: string) => void;
}

// Column width configurations
const getColumnWidth = (columnKey: string): string => {
  const widthConfig: Record<string, string> = {
    'code': 'min-w-[140px]',
    'customerName': 'min-w-[150px]',
    'customerPhone': 'min-w-[130px]',
    'value': 'min-w-[120px]',
    'status': 'min-w-[140px]',
    'issueDate': 'min-w-[120px]',
    'expiryDate': 'min-w-[120px]',
    'issuedBy': 'min-w-[140px]',
    'invoiceReconciliation': 'min-w-[130px]',
    'voucherReconciliationResult': 'min-w-[180px]',
    'generatedInvoice': 'min-w-[200px]',
    'customerGeneratedInvoice': 'min-w-[140px]'
  };
  
  return widthConfig[columnKey] || 'min-w-[120px]';
};

export function VoucherTable({
  vouchers,
  selectedVouchers,
  handleSelectVoucher,
  handleSelectAll,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalVouchers,
  totalPages,
  onViewDetail,
  onCopyCode
}: VoucherTableProps) {
  // Calculate pagination display
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalVouchers);
  const paginatedData = vouchers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const allSelected = paginatedData.length > 0 && selectedVouchers.length === paginatedData.length;

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
    <div className="h-full flex flex-col voucher-card rounded-lg border theme-border-primary overflow-hidden">
      {/* Table Container with horizontal scroll */}
      <div className="flex-1 overflow-auto">
        <table className="w-full" style={{ minWidth: '1600px' }}>
          <thead className="sticky top-0 bg-white z-10 border-b theme-border-primary/20">
            <tr>
              <th className="sticky left-0 bg-white z-20 w-12 px-4 py-3 border-r theme-border-primary/10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  className="voucher-checkbox"
                />
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('code')}`}>
                Mã Voucher
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('customerName')}`}>
                Khách Hàng
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('customerPhone')}`}>
                Số Điện Thoại
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('value')}`}>
                Giá Trị
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('status')}`}>
                Trạng Thái
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('issueDate')}`}>
                Ngày Phát Hành
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('expiryDate')}`}>
                Hết Hạn
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('issuedBy')}`}>
                Người Phát Hành
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('invoiceReconciliation')}`}>
                Đối Soát HĐ
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('voucherReconciliationResult')}`}>
                Kết Quả Đối Soát
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('generatedInvoice')}`}>
                Hóa Đơn Phát Sinh
              </th>
              <th className={`theme-text font-medium whitespace-nowrap px-4 py-3 text-left text-sm ${getColumnWidth('customerGeneratedInvoice')}`}>
                KH Phát Sinh HĐ
              </th>
              <th className="theme-text font-medium w-24 whitespace-nowrap px-4 py-3 text-left text-sm">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((voucher) => (
              <TableRow key={voucher.id} className="hover:theme-bg-primary/5 border-b theme-border-primary/10">
                <TableCell className="sticky left-0 bg-white z-10 w-12 px-4 py-3 border-r theme-border-primary/10">
                  <Checkbox
                    checked={selectedVouchers.includes(voucher.id)}
                    onCheckedChange={(checked) => handleSelectVoucher(voucher.id, checked as boolean)}
                    className="voucher-checkbox"
                  />
                </TableCell>
                <TableCell className={`font-mono font-medium ${getColumnWidth('code')}`}>
                  {voucher.code}
                </TableCell>
                <TableCell className={`font-medium ${getColumnWidth('customerName')}`}>
                  {voucher.customerName}
                </TableCell>
                <TableCell className={getColumnWidth('customerPhone')}>
                  {voucher.customerPhone}
                </TableCell>
                <TableCell className={`font-bold theme-text-primary ${getColumnWidth('value')}`}>
                  {voucher.value}
                </TableCell>
                <TableCell className={getColumnWidth('status')}>
                  <Badge className={getStatusColor(voucher.status)}>
                    {getStatusText(voucher.status)}
                  </Badge>
                </TableCell>
                <TableCell className={getColumnWidth('issueDate')}>
                  {voucher.issueDate}
                </TableCell>
                <TableCell className={getColumnWidth('expiryDate')}>
                  {voucher.expiryDate}
                </TableCell>
                <TableCell className={`text-sm theme-text-muted ${getColumnWidth('issuedBy')}`}>
                  {voucher.issuedBy}
                </TableCell>
                <TableCell className={getColumnWidth('invoiceReconciliation')}>
                  <Badge className={getReconciliationColor(voucher.invoiceReconciliation)}>
                    {getReconciliationText(voucher.invoiceReconciliation)}
                  </Badge>
                </TableCell>
                <TableCell className={getColumnWidth('voucherReconciliationResult')}>
                  <Badge className={getReconciliationResultColor(voucher.voucherReconciliationResult)}>
                    {getReconciliationResultText(voucher.voucherReconciliationResult)}
                  </Badge>
                </TableCell>
                <TableCell className={`text-sm ${getColumnWidth('generatedInvoice')}`}>
                  {voucher.generatedInvoice || '-'}
                </TableCell>
                <TableCell className={getColumnWidth('customerGeneratedInvoice')}>
                  <Badge className={getCustomerInvoiceColor(voucher.customerGeneratedInvoice)}>
                    {getCustomerInvoiceText(voucher.customerGeneratedInvoice)}
                  </Badge>
                </TableCell>
                <TableCell className="w-24">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopyCode(voucher.code)}
                      title="Sao chép mã"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(voucher)}
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Fixed Outside Scroll Container */}
      <div className="flex items-center justify-between px-4 py-3 border-t theme-border-primary/20">
        <div className="flex items-center space-x-3">
          <span className="text-sm theme-text-muted">Hiển thị</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-2 py-1 text-sm border theme-border-primary rounded theme-card theme-text"
          >
            <option value={5}>5</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={200}>200</option>
          </select>
          <span className="text-sm theme-text-muted">
            {startIndex} – {endIndex} trong {totalVouchers.toLocaleString('vi-VN')} voucher
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 voucher-border-primary hover:voucher-bg-primary/10 hover:voucher-text-primary disabled:opacity-50"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 voucher-border-primary hover:voucher-bg-primary/10 hover:voucher-text-primary disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 text-sm theme-text min-w-[80px] text-center">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 voucher-border-primary hover:voucher-bg-primary/10 hover:voucher-text-primary disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 voucher-border-primary hover:voucher-bg-primary/10 hover:voucher-text-primary disabled:opacity-50"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
