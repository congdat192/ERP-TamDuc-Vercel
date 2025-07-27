
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReferrerAccount } from '../types';
import { MoreHorizontal, Eye, Edit, UserCheck, UserX, Link } from 'lucide-react';

interface ReferrerTableProps {
  referrers: ReferrerAccount[];
  onStatusChange: (id: string, status: 'active' | 'inactive' | 'suspended') => void;
  onViewDetails: (referrer: ReferrerAccount) => void;
}

export function ReferrerTable({ referrers, onStatusChange, onViewDetails }: ReferrerTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="berry-success text-white">Hoạt động</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Không hoạt động</Badge>;
      case 'suspended':
        return <Badge className="berry-error text-white">Tạm khóa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Danh Sách F0 (Referrer)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thông Tin F0</TableHead>
              <TableHead>Mã Giới Thiệu</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead>Voucher Đã Phát</TableHead>
              <TableHead>Tổng Hoa Hồng</TableHead>
              <TableHead>KiotViet</TableHead>
              <TableHead>Hoạt Động Cuối</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrers.map((referrer) => (
              <TableRow key={referrer.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium theme-text">{referrer.fullName}</div>
                    <div className="text-sm theme-text-muted">{referrer.email}</div>
                    <div className="text-sm theme-text-muted">{referrer.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {referrer.referralCode}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(referrer.status)}
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <div className="text-lg font-semibold theme-text">{referrer.totalVouchersIssued}</div>
                    <div className="text-sm theme-text-muted">vouchers</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-right">
                    <div className="font-semibold theme-text">
                      {formatCurrency(referrer.totalCommissionEarned)}
                    </div>
                    <div className="text-sm theme-text-muted">
                      {referrer.totalReferrals} referrals
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {referrer.kiotVietConfig?.isConnected ? (
                      <Badge className="berry-success text-white">
                        <Link className="w-3 h-3 mr-1" />
                        Đã kết nối
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Chưa kết nối
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm theme-text-muted">
                    {referrer.lastActivity ? formatDate(referrer.lastActivity) : 'Chưa có'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(referrer)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem Chi Tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh Sửa
                      </DropdownMenuItem>
                      {referrer.status === 'active' ? (
                        <DropdownMenuItem onClick={() => onStatusChange(referrer.id, 'inactive')}>
                          <UserX className="mr-2 h-4 w-4" />
                          Tạm Dừng
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onStatusChange(referrer.id, 'active')}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Kích Hoạt
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
