
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';

export function F0Dashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold theme-text">Dashboard F0</h1>
          <p className="theme-text-muted">Chào mừng bạn quay trở lại</p>
        </div>
        <Badge variant="outline" className="text-green-600">
          Tài khoản đã kích hoạt
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giới thiệu</CardTitle>
            <Users className="h-4 w-4 theme-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs theme-text-muted">Thành công: 18</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoa hồng kiếm được</CardTitle>
            <DollarSign className="h-4 w-4 theme-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2340000)}</div>
            <p className="text-xs theme-text-muted">Tháng này: {formatCurrency(450000)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
            <TrendingUp className="h-4 w-4 theme-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(1890000)}</div>
            <p className="text-xs theme-text-muted">Có thể rút</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            <Clock className="h-4 w-4 theme-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs theme-text-muted">Giới thiệu mới</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Giới thiệu khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm theme-text-muted mb-4">
              Nhập số điện thoại khách hàng mới để gửi voucher
            </p>
            <Button className="w-full">Giới thiệu ngay</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rút tiền</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm theme-text-muted mb-4">
              Yêu cầu rút hoa hồng về tài khoản ngân hàng
            </p>
            <Button variant="outline" className="w-full">Rút tiền</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử giới thiệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm theme-text-muted mb-4">
              Xem chi tiết các khách hàng đã giới thiệu
            </p>
            <Button variant="outline" className="w-full">Xem lịch sử</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
