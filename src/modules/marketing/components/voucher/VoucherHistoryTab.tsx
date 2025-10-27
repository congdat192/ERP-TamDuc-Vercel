import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Calendar } from 'lucide-react';
import { voucherService } from '../../services/voucherService';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface HistoryItem {
  id: string;
  phone: string;
  campaign_id: string;
  source: string;
  customer_type: string | null;
  voucher_code: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  issued_by: string;
}

export function VoucherHistoryTab() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    phone: '',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const filterParams: any = {};
      if (filters.phone) filterParams.phone = filters.phone;
      if (filters.status !== 'all') filterParams.status = filters.status;
      if (filters.startDate) filterParams.startDate = new Date(filters.startDate);
      if (filters.endDate) filterParams.endDate = new Date(filters.endDate);

      const data = await voucherService.getHistoryWithFilters(filterParams);
      setHistory(data);

      // Fetch employee names
      const uniqueUserIds = [...new Set(data.map(item => item.issued_by))];
      const names: Record<string, string> = {};
      for (const userId of uniqueUserIds) {
        names[userId] = await voucherService.getEmployeeName(userId);
      }
      setEmployeeNames(names);
    } catch (error) {
      toast.error('Không thể tải lịch sử');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    const exportData = history.map(item => ({
      'Ngày phát hành': format(new Date(item.created_at), 'dd/MM/yyyy HH:mm:ss'),
      'Số điện thoại': item.phone,
      'Chiến dịch': item.campaign_id,
      'Nguồn': item.source,
      'Loại KH': item.customer_type || 'N/A',
      'Mã voucher': item.voucher_code || 'N/A',
      'Nhân viên': employeeNames[item.issued_by] || 'Unknown',
      'Trạng thái': item.status === 'success' ? 'Thành công' : 'Thất bại',
      'Lỗi': item.error_message || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lịch sử phát voucher');
    XLSX.writeFile(wb, `voucher-history-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Đã xuất file Excel');
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
              value={filters.phone}
              onChange={(e) => setFilters(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={filters.status} onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Từ ngày</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Đến ngày</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={loadHistory} disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
          <Button variant="outline" onClick={handleExportExcel} disabled={history.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày giờ</TableHead>
                <TableHead>Số ĐT</TableHead>
                <TableHead>Chiến dịch</TableHead>
                <TableHead>Nguồn</TableHead>
                <TableHead>Mã voucher</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm">
                      {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell className="text-sm">{item.campaign_id}</TableCell>
                    <TableCell className="text-sm">{item.source}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {item.voucher_code || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm">{employeeNames[item.issued_by] || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'success' ? 'default' : 'destructive'}>
                        {item.status === 'success' ? 'Thành công' : 'Thất bại'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
