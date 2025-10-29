import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    recipient_phone: '',
    activation_status: 'all',
    created_at_from: '',
    created_at_to: ''
  });

  useEffect(() => {
    loadHistory();
  }, [pagination.offset]);

  const formatDateVN = (utcDate: string) => {
    // Convert UTC+0 to UTC+7
    const date = new Date(utcDate);
    const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return format(vnTime, 'dd/MM/yyyy HH:mm:ss');
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const filterParams: any = {
        page_size: pagination.page_size,
        offset: pagination.offset
      };
      
      if (filters.recipient_phone) filterParams.recipient_phone = filters.recipient_phone;
      if (filters.activation_status !== 'all') filterParams.activation_status = filters.activation_status;
      if (filters.created_at_from) {
        // Convert to UTC+0: YYYY-MM-DDTHH:MM:SS+00:00
        filterParams.created_at_from = new Date(filters.created_at_from + 'T00:00:00').toISOString();
      }
      if (filters.created_at_to) {
        filterParams.created_at_to = new Date(filters.created_at_to + 'T23:59:59').toISOString();
      }

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
      'Trạng thái HD': item.invoice_status || '',
      'Giá trị HD': item.invoice_amount || '',
      'Mã VC cấp lại 1': item.reissue_1_code || '',
      'TT VC cấp lại 1': item.reissue_1_status || '',
      'ID HD cấp lại 1': item.reissue_1_invoice_id || '',
      'Mã HD cấp lại 1': item.reissue_1_invoice_code || '',
      'TT HD cấp lại 1': item.reissue_1_invoice_status || '',
      'Giá trị HD cấp lại 1': item.reissue_1_invoice_amount || '',
      'Mã VC cấp lại 2': item.reissue_2_code || '',
      'TT VC cấp lại 2': item.reissue_2_status || '',
      'ID HD cấp lại 2': item.reissue_2_invoice_id || '',
      'Mã HD cấp lại 2': item.reissue_2_invoice_code || '',
      'TT HD cấp lại 2': item.reissue_2_invoice_status || '',
      'Giá trị HD cấp lại 2': item.reissue_2_invoice_amount || ''
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
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử phát hành Voucher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <Input
              placeholder="0912345678"
              value={filters.recipient_phone}
              onChange={(e) => setFilters(prev => ({ ...prev, recipient_phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={filters.activation_status} onValueChange={(val) => setFilters(prev => ({ ...prev, activation_status: val }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Đã kích hoạt">Đã kích hoạt</SelectItem>
                <SelectItem value="Chưa kích hoạt">Chưa kích hoạt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Từ ngày</Label>
            <Input
              type="date"
              value={filters.created_at_from}
              onChange={(e) => setFilters(prev => ({ ...prev, created_at_from: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Đến ngày</Label>
            <Input
              type="date"
              value={filters.created_at_to}
              onChange={(e) => setFilters(prev => ({ ...prev, created_at_to: e.target.value }))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
          <Button variant="outline" onClick={handleExportExcel} disabled={history.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>

        {/* Table with horizontal scroll */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Mã voucher</TableHead>
                <TableHead className="min-w-[100px]">ID Chiến dịch</TableHead>
                <TableHead className="min-w-[120px]">Mã Chiến dịch</TableHead>
                <TableHead className="min-w-[150px]">Ngày tạo</TableHead>
                <TableHead className="min-w-[150px]">Ngày kích hoạt</TableHead>
                <TableHead className="min-w-[150px]">Ngày hết hạn</TableHead>
                <TableHead className="min-w-[120px]">Trạng thái</TableHead>
                <TableHead className="min-w-[120px]">SĐT người tạo</TableHead>
                <TableHead className="min-w-[150px]">Tên người tạo</TableHead>
                <TableHead className="min-w-[120px]">SĐT người nhận</TableHead>
                <TableHead className="min-w-[100px]">Loại KH</TableHead>
                <TableHead className="min-w-[100px]">Nguồn</TableHead>
                <TableHead className="min-w-[80px]">Đã dùng</TableHead>
                <TableHead className="min-w-[100px]">ID Hóa đơn</TableHead>
                <TableHead className="min-w-[120px]">Mã Hóa đơn</TableHead>
                <TableHead className="min-w-[120px]">TT Hóa đơn</TableHead>
                <TableHead className="min-w-[120px]">Giá trị HD</TableHead>
                <TableHead className="min-w-[120px]">VC Cấp lại 1</TableHead>
                <TableHead className="min-w-[120px]">TT VC CL1</TableHead>
                <TableHead className="min-w-[100px]">HD CL1</TableHead>
                <TableHead className="min-w-[120px]">Mã HD CL1</TableHead>
                <TableHead className="min-w-[120px]">TT HD CL1</TableHead>
                <TableHead className="min-w-[120px]">GT HD CL1</TableHead>
                <TableHead className="min-w-[120px]">VC Cấp lại 2</TableHead>
                <TableHead className="min-w-[120px]">TT VC CL2</TableHead>
                <TableHead className="min-w-[100px]">HD CL2</TableHead>
                <TableHead className="min-w-[120px]">Mã HD CL2</TableHead>
                <TableHead className="min-w-[120px]">TT HD CL2</TableHead>
                <TableHead className="min-w-[120px]">GT HD CL2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={29} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={29} className="text-center py-8 text-muted-foreground">
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
                    <TableCell className="text-sm">{item.customer_type}</TableCell>
                    <TableCell className="text-sm">{item.customer_source}</TableCell>
                    <TableCell className="text-center">
                      {item.voucher_used ? '✓' : '✗'}
                    </TableCell>
                    <TableCell>{item.invoice_id || '-'}</TableCell>
                    <TableCell className="text-sm">{item.invoice_code || '-'}</TableCell>
                    <TableCell className="text-sm">{item.invoice_status || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {item.invoice_amount ? item.invoice_amount.toLocaleString('vi-VN') : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{item.reissue_1_code || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_1_status || '-'}</TableCell>
                    <TableCell>{item.reissue_1_invoice_id || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_1_invoice_code || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_1_invoice_status || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {item.reissue_1_invoice_amount ? item.reissue_1_invoice_amount.toLocaleString('vi-VN') : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{item.reissue_2_code || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_2_status || '-'}</TableCell>
                    <TableCell>{item.reissue_2_invoice_id || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_2_invoice_code || '-'}</TableCell>
                    <TableCell className="text-sm">{item.reissue_2_invoice_status || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {item.reissue_2_invoice_amount ? item.reissue_2_invoice_amount.toLocaleString('vi-VN') : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Tổng: {pagination.total} | Hiển thị: {pagination.offset + 1}-{pagination.offset + history.length}
          </p>
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
      </CardContent>
    </Card>
  );
}
