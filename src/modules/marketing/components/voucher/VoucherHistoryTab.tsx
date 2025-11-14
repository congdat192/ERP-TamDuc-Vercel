import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { voucherService, VoucherTrackingRecord } from '../../services/voucherService';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export function VoucherHistoryTab() {
  const [history, setHistory] = useState<VoucherTrackingRecord[]>([]);
  const [pagination, setPagination] = useState({ 
    total: 0, 
    offset: 0, 
    page_size: 20, 
    has_more: false 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    voucher_code: '',        // Renamed from "code" - searches across 3 columns
    recipient_phone: '',
    creator_name: '',
    voucher_used: 'all',     // 'all' | 'true' | 'false'
    created_at_from: '',
    created_at_to: '',
    expired_at_from: '',
    expired_at_to: ''
  });

  useEffect(() => {
    loadHistory();
  }, [pagination.offset, pagination.page_size]);

  const formatDateVN = (utcDate: string) => {
    // Browser automatically converts UTC+0 to local timezone (Vietnam = UTC+7)
    const date = new Date(utcDate);
    return format(date, 'dd/MM/yyyy HH:mm:ss');
  };

  const getCustomerTypeVariant = (type: string): 'default' | 'secondary' | 'outline' => {
    return type === 'new' ? 'default' : 'outline';
  };

  const getCustomerSourceColor = (source: string): string => {
    switch(source?.toLowerCase()) {
      case 'zalo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fanpage': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'website': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'walk-in': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getInvoiceStatusColor = (status: string | null): string => {
    if (!status) return 'text-gray-400';
    switch(status) {
      case 'Hoàn thành': return 'text-green-600 font-medium';
      case 'Đã hủy': return 'text-red-600 font-medium';
      default: return 'text-gray-600';
    }
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const filterParams: any = {
        page_size: pagination.page_size,
        offset: pagination.offset
      };
      
      // Only send params that have values (API V1.1 spec)
      if (filters.voucher_code) filterParams.voucher_code = filters.voucher_code;
      if (filters.recipient_phone) filterParams.recipient_phone = filters.recipient_phone;
      if (filters.creator_name) filterParams.creator_name = filters.creator_name;
      
      // voucher_used: only send when selected true/false, don't send when "all"
      if (filters.voucher_used !== 'all') {
        filterParams.voucher_used = filters.voucher_used === 'true';
      }
      
      // Dates: send YYYY-MM-DD format, NOT ISO timestamp
      if (filters.created_at_from) filterParams.created_at_from = filters.created_at_from;
      if (filters.created_at_to) filterParams.created_at_to = filters.created_at_to;
      if (filters.expired_at_from) filterParams.expired_at_from = filters.expired_at_from;
      if (filters.expired_at_to) filterParams.expired_at_to = filters.expired_at_to;

      const response = await voucherService.getVoucherTracking(filterParams);
      setHistory(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải lịch sử');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, offset: 0 }));
    loadHistory();
  };

  const handleExportExcel = () => {
    const exportData = history.map(item => ({
      'Mã voucher': item.code,
      'ID Chiến dịch': item.campaign_id,
      'Mã Chiến dịch': item.campaign_code,
      'Ngày tạo': formatDateVN(item.created_at),
      'Ngày kích hoạt': formatDateVN(item.activated_at),
      'Ngày hết hạn': formatDateVN(item.expired_at),
      'Trạng thái': item.activation_status,
      'SĐT người tạo': item.creator_phone,
      'Tên người tạo': item.creator_name,
      'SĐT người nhận': item.recipient_phone,
      'Loại KH': item.customer_type,
      'Nguồn': item.customer_source,
      'Đã sử dụng': item.voucher_used ? 'Có' : 'Không',
      'ID Hóa đơn': item.invoice_id || '',
      'Mã Hóa đơn': item.invoice_code || '',
      'Trạng thái Hóa đơn': item.invoice_status || '',
      'Giá trị Hóa đơn': item.invoice_amount || '',
      'Ghi chú': item.note || '',
      'Voucher Cấp lại 1': item.reissue_1_code || '',
      'Trạng thái VC Cấp lại 1': item.reissue_1_status === null ? '' : (item.reissue_1_status ? 'Đã dùng' : 'Chưa dùng'),
      'ID Hóa đơn Cấp lại 1': item.reissue_1_invoice_id || '',
      'Mã Hóa đơn Cấp lại 1': item.reissue_1_invoice_code || '',
      'Trạng thái HD Cấp lại 1': item.reissue_1_invoice_status || '',
      'Giá trị HD Cấp lại 1': item.reissue_1_invoice_amount || '',
      'Voucher Cấp lại 2': item.reissue_2_code || '',
      'Trạng thái VC Cấp lại 2': item.reissue_2_status === null ? '' : (item.reissue_2_status ? 'Đã dùng' : 'Chưa dùng'),
      'ID Hóa đơn Cấp lại 2': item.reissue_2_invoice_id || '',
      'Mã Hóa đơn Cấp lại 2': item.reissue_2_invoice_code || '',
      'Trạng thái HD Cấp lại 2': item.reissue_2_invoice_status || '',
      'Giá trị HD Cấp lại 2': item.reissue_2_invoice_amount || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lịch sử Voucher');
    XLSX.writeFile(wb, `voucher-tracking-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Đã xuất file Excel');
  };

  const handlePrevPage = () => {
    setPagination(prev => ({ 
      ...prev, 
      offset: Math.max(0, prev.offset - prev.page_size) 
    }));
  };

  const handleNextPage = () => {
    setPagination(prev => ({ 
      ...prev, 
      offset: prev.offset + prev.page_size 
    }));
  };

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <Input
              placeholder="0912345678"
              value={filters.recipient_phone}
              onChange={(e) => setFilters(prev => ({ ...prev, recipient_phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Mã voucher</Label>
            <Input
              placeholder="Tìm mã gốc hoặc mã cấp lại"
              value={filters.voucher_code}
              onChange={(e) => setFilters(prev => ({ ...prev, voucher_code: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Tìm trong code, reissue_1_code, reissue_2_code
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tên người tạo</Label>
            <Input
              placeholder="Nguyễn Văn A"
              value={filters.creator_name}
              onChange={(e) => setFilters(prev => ({ ...prev, creator_name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Trạng thái sử dụng</Label>
            <Select value={filters.voucher_used} onValueChange={(val) => setFilters(prev => ({ ...prev, voucher_used: val }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Đã sử dụng</SelectItem>
                <SelectItem value="false">Chưa sử dụng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ngày tạo từ</Label>
            <Input
              type="date"
              value={filters.created_at_from}
              onChange={(e) => setFilters(prev => ({ ...prev, created_at_from: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Ngày tạo đến</Label>
            <Input
              type="date"
              value={filters.created_at_to}
              onChange={(e) => setFilters(prev => ({ ...prev, created_at_to: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Ngày hết hạn từ</Label>
            <Input
              type="date"
              value={filters.expired_at_from}
              onChange={(e) => setFilters(prev => ({ ...prev, expired_at_from: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Ngày hết hạn đến</Label>
            <Input
              type="date"
              value={filters.expired_at_to}
              onChange={(e) => setFilters(prev => ({ ...prev, expired_at_to: e.target.value }))}
            />
          </div>

          <div className="flex items-end space-x-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
            <Button onClick={handleExportExcel} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
      </div>

      {/* Table with sticky header and vertical scroll */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow>
                <TableHead className="min-w-[130px]">Mã voucher</TableHead>
                <TableHead className="min-w-[130px]">ID Chiến dịch</TableHead>
                <TableHead className="min-w-[150px]">Mã Chiến dịch</TableHead>
                <TableHead className="min-w-[170px]">Ngày tạo</TableHead>
                <TableHead className="min-w-[170px]">Ngày kích hoạt</TableHead>
                <TableHead className="min-w-[170px]">Ngày hết hạn</TableHead>
                <TableHead className="min-w-[130px]">Trạng thái</TableHead>
                <TableHead className="min-w-[150px]">SĐT người tạo</TableHead>
                <TableHead className="min-w-[150px]">Tên người tạo</TableHead>
                <TableHead className="min-w-[150px]">SĐT người nhận</TableHead>
                <TableHead className="min-w-[130px]">Loại KH</TableHead>
                <TableHead className="min-w-[120px]">Nguồn</TableHead>
                <TableHead className="min-w-[130px]">Đã sử dụng</TableHead>
                <TableHead className="min-w-[130px]">ID Hóa đơn</TableHead>
                <TableHead className="min-w-[140px]">Mã Hóa đơn</TableHead>
                <TableHead className="min-w-[180px]">Trạng thái Hóa đơn</TableHead>
                <TableHead className="min-w-[160px]">Giá trị Hóa đơn</TableHead>
                <TableHead className="min-w-[200px]">Ghi chú</TableHead>
                <TableHead className="min-w-[180px]">Voucher Cấp lại 1</TableHead>
                <TableHead className="min-w-[200px]">Trạng thái VC Cấp lại 1</TableHead>
                <TableHead className="min-w-[200px]">ID Hóa đơn Cấp lại 1</TableHead>
                <TableHead className="min-w-[200px]">Mã Hóa đơn Cấp lại 1</TableHead>
                <TableHead className="min-w-[200px]">Trạng thái HD Cấp lại 1</TableHead>
                <TableHead className="min-w-[200px]">Giá trị HD Cấp lại 1</TableHead>
                <TableHead className="min-w-[180px]">Voucher Cấp lại 2</TableHead>
                <TableHead className="min-w-[200px]">Trạng thái VC Cấp lại 2</TableHead>
                <TableHead className="min-w-[200px]">ID Hóa đơn Cấp lại 2</TableHead>
                <TableHead className="min-w-[200px]">Mã Hóa đơn Cấp lại 2</TableHead>
                <TableHead className="min-w-[200px]">Trạng thái HD Cấp lại 2</TableHead>
                <TableHead className="min-w-[200px]">Giá trị HD Cấp lại 2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={30} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={30} className="text-center py-8 text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {item.code}
                      </code>
                    </TableCell>
                    <TableCell>{item.campaign_id}</TableCell>
                    <TableCell className="text-sm">{item.campaign_code}</TableCell>
                    <TableCell className="text-sm">{formatDateVN(item.created_at)}</TableCell>
                    <TableCell className="text-sm">{formatDateVN(item.activated_at)}</TableCell>
                    <TableCell className="text-sm">{formatDateVN(item.expired_at)}</TableCell>
                    <TableCell>
                      <Badge variant={item.activation_status === 'Đã kích hoạt' ? 'default' : 'secondary'}>
                        {item.activation_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.creator_phone}</TableCell>
                    <TableCell className="text-sm">{item.creator_name}</TableCell>
                    <TableCell>{item.recipient_phone}</TableCell>
                    <TableCell>
                      <Badge variant={getCustomerTypeVariant(item.customer_type)}>
                        {item.customer_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCustomerSourceColor(item.customer_source)}`}>
                        {item.customer_source}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.voucher_used ? 'success' : 'destructive'}>
                        {item.voucher_used ? '✓ Đã dùng' : '✗ Chưa dùng'}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.invoice_id || '-'}</TableCell>
                    <TableCell className="text-sm">{item.invoice_code || '-'}</TableCell>
                    <TableCell className={getInvoiceStatusColor(item.invoice_status)}>
                      {item.invoice_status || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.invoice_amount ? item.invoice_amount.toLocaleString('vi-VN') : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{item.note || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_1_code || '-'}</TableCell>
                    <TableCell>
                      {item.reissue_1_status === null ? (
                        '-'
                      ) : (
                        <Badge variant={item.reissue_1_status ? 'success' : 'destructive'}>
                          {item.reissue_1_status ? '✓ Đã dùng' : '✗ Chưa dùng'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.reissue_1_invoice_id || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_1_invoice_code || '-'}</TableCell>
                    <TableCell className={getInvoiceStatusColor(item.reissue_1_invoice_status)}>
                      {item.reissue_1_invoice_status || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.reissue_1_invoice_amount ? item.reissue_1_invoice_amount.toLocaleString('vi-VN') : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{item.reissue_2_code || '-'}</TableCell>
                    <TableCell>
                      {item.reissue_2_status === null ? (
                        '-'
                      ) : (
                        <Badge variant={item.reissue_2_status ? 'success' : 'destructive'}>
                          {item.reissue_2_status ? '✓ Đã dùng' : '✗ Chưa dùng'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.reissue_2_invoice_id || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_2_invoice_code || '-'}</TableCell>
                    <TableCell className={getInvoiceStatusColor(item.reissue_2_invoice_status)}>
                      {item.reissue_2_invoice_status || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.reissue_2_invoice_amount ? item.reissue_2_invoice_amount.toLocaleString('vi-VN') : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            </Table>
          </div>
        </div>

        {/* Enhanced Pagination */}
        <div className="flex items-center justify-between pt-4 border-t">
          {/* Left: Total + Current range */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Tổng: <span className="font-medium">{pagination.total}</span> bản ghi
            </p>
            <p className="text-sm text-muted-foreground">
              Hiển thị: <span className="font-medium">{pagination.offset + 1}</span>-<span className="font-medium">{Math.min(pagination.offset + pagination.page_size, pagination.total)}</span>
            </p>
          </div>

          {/* Center: Page size selector */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Hiển thị:</Label>
            <Select 
              value={pagination.page_size.toString()} 
              onValueChange={(value) => {
                setPagination(prev => ({ ...prev, page_size: parseInt(value), offset: 0 }));
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right: Previous/Next buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.offset === 0 || isLoading}
              onClick={handlePrevPage}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.has_more || isLoading}
              onClick={handleNextPage}
            >
              Sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
    </div>
  );
}
