
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, Users, TrendingUp, DollarSign } from 'lucide-react';
import { affiliateService } from '../services/affiliateService';
import { Commission } from '../types';

export function ReferralManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: commissions, isLoading } = useQuery({
    queryKey: ['all-commissions'],
    queryFn: affiliateService.getAllCommissions,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['affiliate-stats'],
    queryFn: affiliateService.getAffiliateStats,
  });

  const filteredCommissions = commissions?.filter(commission => {
    const matchesSearch = commission.f0Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.f1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'paid': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'paid': return 'Đã chi trả';
      default: return status;
    }
  };

  if (isLoading || statsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản Lý Giới Thiệu</h1>
        <p className="text-muted-foreground">Theo dõi và quản lý các lượt giới thiệu F0-F1</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng F0 hoạt động</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalF0Registered}</div>
            <p className="text-xs text-muted-foreground">+{stats?.newF0ThisMonth} tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giới thiệu thành công</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSuccessfulReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {((stats?.totalSuccessfulReferrals || 0) / (stats?.totalF1Invited || 1) * 100).toFixed(1)}% tỷ lệ thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hoa hồng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((stats?.totalCommissionPaid || 0) / 1000000).toFixed(1)}M VND</div>
            <p className="text-xs text-muted-foreground">Đã chi trả</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo F0, F1, mã đơn hàng..."
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
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
                <SelectItem value="paid">Đã chi trả</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hoa hồng ({filteredCommissions?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>F0 - F1</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Giá trị ĐH</TableHead>
                <TableHead>Tỷ lệ HH</TableHead>
                <TableHead>Hoa hồng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions?.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{commission.f0Name}</div>
                      <div className="text-sm text-muted-foreground">→ {commission.f1Name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{commission.orderId}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{commission.orderValue.toLocaleString()} VND</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{commission.commissionRate}%</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">
                      {commission.commissionAmount.toLocaleString()} VND
                    </span>
                  </TableCell>
                  <TableCell>{commission.createdDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(commission.status)}>
                      {getStatusText(commission.status)}
                    </Badge>
                    {commission.approvedDate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Duyệt: {commission.approvedDate}
                      </div>
                    )}
                    {commission.paidDate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Trả: {commission.paidDate}
                      </div>
                    )}
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
