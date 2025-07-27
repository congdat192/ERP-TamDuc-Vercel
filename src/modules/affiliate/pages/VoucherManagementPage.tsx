
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, Plus, Gift, Calendar, Users } from 'lucide-react';

// Mock data for affiliate vouchers
const mockVouchers = [
  {
    id: '1',
    code: 'AFF-VCH-001',
    f0Id: '1',
    f0Name: 'Nguyễn Văn A',
    discountType: 'percentage' as const,
    discountValue: 10,
    minOrderValue: 500000,
    maxDiscount: 100000,
    usageLimit: 50,
    usedCount: 12,
    createdDate: '2024-01-15',
    expiryDate: '2024-03-15',
    status: 'active' as const
  },
  {
    id: '2',
    code: 'AFF-VCH-002',
    f0Id: '2',
    f0Name: 'Trần Thị B',
    discountType: 'fixed' as const,
    discountValue: 50000,
    minOrderValue: 300000,
    usageLimit: 100,
    usedCount: 45,
    createdDate: '2024-01-20',
    expiryDate: '2024-04-20',
    status: 'active' as const
  },
  {
    id: '3',
    code: 'AFF-VCH-003',
    f0Id: '3',
    f0Name: 'Lê Văn C',
    discountType: 'percentage' as const,
    discountValue: 15,
    minOrderValue: 1000000,
    maxDiscount: 200000,
    usageLimit: 30,
    usedCount: 30,
    createdDate: '2024-01-10',
    expiryDate: '2024-02-10',
    status: 'expired' as const
  }
];

export function VoucherManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVouchers = mockVouchers.filter(voucher => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.f0Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Tạm dừng';
      case 'expired': return 'Hết hạn';
      default: return status;
    }
  };

  const totalVouchers = mockVouchers.length;
  const activeVouchers = mockVouchers.filter(v => v.status === 'active').length;
  const totalUsed = mockVouchers.reduce((sum, v) => sum + v.usedCount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản Lý Voucher</h1>
        <p className="text-muted-foreground">Quản lý voucher cho chương trình affiliate</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng voucher</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVouchers}</div>
            <p className="text-xs text-muted-foreground">{activeVouchers} đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt sử dụng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsed}</div>
            <p className="text-xs text-muted-foreground">Tổng lượt sử dụng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ sử dụng</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalUsed / mockVouchers.reduce((sum, v) => sum + v.usageLimit, 0)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Hiệu suất sử dụng</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo voucher mới
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã voucher, tên F0..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
                <SelectItem value="expired">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vouchers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách voucher ({filteredVouchers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã voucher</TableHead>
                <TableHead>F0 sở hữu</TableHead>
                <TableHead>Loại giảm giá</TableHead>
                <TableHead>Điều kiện</TableHead>
                <TableHead>Sử dụng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Hạn sử dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{voucher.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{voucher.f0Name}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {voucher.discountType === 'percentage' ? (
                        <span className="text-blue-600 font-medium">{voucher.discountValue}%</span>
                      ) : (
                        <span className="text-green-600 font-medium">{voucher.discountValue.toLocaleString()} VND</span>
                      )}
                      {voucher.maxDiscount && (
                        <div className="text-xs text-muted-foreground">
                          Tối đa: {voucher.maxDiscount.toLocaleString()} VND
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      Đơn tối thiểu: {voucher.minOrderValue.toLocaleString()} VND
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{voucher.usedCount}/{voucher.usageLimit}</div>
                      <div className="text-xs text-muted-foreground">
                        {((voucher.usedCount / voucher.usageLimit) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{voucher.createdDate}</TableCell>
                  <TableCell>
                    <div className={`text-sm ${new Date(voucher.expiryDate) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
                      {voucher.expiryDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(voucher.status)}>
                      {getStatusText(voucher.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
