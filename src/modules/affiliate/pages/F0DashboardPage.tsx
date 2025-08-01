
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Bell,
  UserPlus
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-states';
import { Link } from 'react-router-dom';

export function F0DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard F0</h1>
          <p className="text-muted-foreground mt-2">Chào mừng bạn đến với Portal F0</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            Đã duyệt
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="theme-bg-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Tổng Giới Thiệu</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-white/70 text-xs">+0 hôm nay</p>
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
                <p className="text-2xl font-bold">0 ₫</p>
                <p className="text-white/70 text-xs">+0 ₫ hôm nay</p>
              </div>
              <DollarSign className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Giới Thiệu Thành Công</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-white/70 text-xs">0% tỷ lệ chuyển đổi</p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Chờ Xử Lý</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-white/70 text-xs">Lời mời đang chờ</p>
              </div>
              <Clock className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao Tác Nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Users className="h-4 w-4 mr-2" />
                Cập Nhật Thông Tin
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Thông Báo Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="Chưa có thông báo"
              description="Các thông báo mới sẽ xuất hiện ở đây"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch Sử Giới Thiệu Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Chưa có lượt giới thiệu nào"
            description="Khi bạn giới thiệu khách hàng, thông tin sẽ hiển thị ở đây"
            action={{
              label: "Giới Thiệu Ngay",
              onClick: () => window.location.href = "/ERP/Affiliate/f0-referral"
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
