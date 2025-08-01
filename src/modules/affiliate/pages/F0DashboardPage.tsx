
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Bell,
  UserPlus,
  Link2,
  Wallet,
  User,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function F0DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header với cấp bậc */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard F0</h1>
          <p className="text-muted-foreground mt-2">Chào mừng bạn đến với Portal F0</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Cấp bậc hiện tại</p>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              Silver Member
            </Badge>
          </div>
        </div>
      </div>

      {/* Tiến độ lên cấp */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Tiến độ lên cấp Gold</h3>
              <p className="text-sm text-muted-foreground">Bạn cần thêm 3 F1 thành công để lên Gold</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold theme-text-primary">7/10</p>
              <p className="text-sm text-muted-foreground">F1 thành công</p>
            </div>
          </div>
          <Progress value={70} className="h-2" />
        </CardContent>
      </Card>

      {/* Stats Cards với layout mới */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="theme-bg-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Tổng Giới Thiệu</p>
                <p className="text-2xl font-bold">15</p>
                <p className="text-white/70 text-xs">+3 tuần này</p>
              </div>
              <Users className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="theme-bg-secondary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Tổng Hoa Hồng</p>
                <p className="text-2xl font-bold">2.750.000 ₫</p>
                <p className="text-white/70 text-xs">+450.000 ₫ tháng này</p>
              </div>
              <DollarSign className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">F1 Đã Sử Dụng</p>
                <p className="text-2xl font-bold">7</p>
                <p className="text-white/70 text-xs">46.7% tỷ lệ chuyển đổi</p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Số Dư Khả Dụng</p>
                <p className="text-2xl font-bold">750.000 ₫</p>
                <p className="text-white/70 text-xs">Có thể rút ngay</p>
              </div>
              <Wallet className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hành Động Nhanh */}
        <Card>
          <CardHeader>
            <CardTitle>Hành Động Nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/ERP/Affiliate/f0-link-generation">
              <Button className="w-full justify-start" variant="outline">
                <Link2 className="h-4 w-4 mr-2" />
                Tạo Link Giới Thiệu
              </Button>
            </Link>
            <Link to="/ERP/Affiliate/f0-referral">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Giới Thiệu Khách Hàng Mới
              </Button>
            </Link>
            <Link to="/ERP/Affiliate/f0-withdrawal">
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Rút Tiền Hoa Hồng
              </Button>
            </Link>
            <Link to="/ERP/Affiliate/f0-account-info">
              <Button className="w-full justify-start" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Cập Nhật Thông Tin
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Thông Báo Mới Nhất */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Thông Báo Mới Nhất
            </CardTitle>
            <Link to="/ERP/Affiliate/f0-notifications">
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-l-green-500 pl-4 py-2">
              <p className="font-medium">Hoa hồng đã được duyệt</p>
              <p className="text-sm text-muted-foreground">F1 0987654321 đã mua hàng. Bạn nhận được 150.000 VND</p>
              <p className="text-xs text-muted-foreground">2 giờ trước</p>
            </div>
            <div className="border-l-4 border-l-blue-500 pl-4 py-2">
              <p className="font-medium">Lời mời đã được gửi</p>
              <p className="text-sm text-muted-foreground">Lời mời tới 0912345678 đã được gửi thành công</p>
              <p className="text-xs text-muted-foreground">5 giờ trước</p>
            </div>
            <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
              <p className="font-medium">Sắp lên cấp Gold</p>
              <p className="text-sm text-muted-foreground">Bạn chỉ cần thêm 3 F1 thành công để lên Gold Member</p>
              <p className="text-xs text-muted-foreground">1 ngày trước</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lịch Sử Giới Thiệu Gần Đây */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch Sử Giới Thiệu Gần Đây</CardTitle>
          <Link to="/ERP/Affiliate/f0-referral-history">
            <Button variant="outline" size="sm">
              Xem chi tiết
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="font-medium">0987654321</p>
                  <p className="text-sm text-muted-foreground">Đã sử dụng voucher</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+150.000 ₫</p>
                <p className="text-xs text-muted-foreground">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="font-medium">0912345678</p>
                  <p className="text-sm text-muted-foreground">Chờ sử dụng voucher</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-muted-foreground">Chờ xử lý</p>
                <p className="text-xs text-muted-foreground">5 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">0901234567</p>
                  <p className="text-sm text-muted-foreground">Đã gửi lời mời</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-muted-foreground">Chờ đăng ký</p>
                <p className="text-xs text-muted-foreground">1 ngày trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
