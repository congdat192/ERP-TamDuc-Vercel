
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { AffiliateStats } from '../../types/affiliate';

export function AdminDashboard() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setStats({
        totalF0s: 125,
        activeF0s: 98,
        pendingF0s: 12,
        totalF1s: 456,
        successfulReferrals: 234,
        totalCommissionsPaid: 45600000,
        pendingCommissions: 8900000,
        totalWithdrawals: 38700000,
        pendingWithdrawals: 5400000,
        conversionRate: 51.3,
        averageCommissionPerF0: 465306,
        topPerformers: [
          { f0Id: '1', f0Name: 'Nguyễn Văn A', totalReferrals: 45, totalCommissions: 2300000 },
          { f0Id: '2', f0Name: 'Trần Thị B', totalReferrals: 38, totalCommissions: 1950000 },
          { f0Id: '3', f0Name: 'Lê Văn C', totalReferrals: 32, totalCommissions: 1680000 },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold theme-text">Admin Dashboard</h1>
          <p className="theme-text-muted">Tổng quan hệ thống Affiliate</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            Xuất báo cáo
          </Button>
          <Button>
            Làm mới dữ liệu
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng F0</CardTitle>
            <Users className="h-4 w-4 theme-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalF0s}</div>
            <div className="flex items-center space-x-2 text-xs theme-text-muted">
              <span>Hoạt động: {stats?.activeF0s}</span>
              <Badge variant="outline" className="text-xs">
                {stats?.pendingF0s} chờ duyệt
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng F1</CardTitle>
            <UserCheck className="h-4 w-4 theme-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalF1s}</div>
            <div className="flex items-center space-x-2 text-xs theme-text-muted">
              <span>Thành công: {stats?.successfulReferrals}</span>
              <span className="text-green-600">
                {stats?.conversionRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoa hồng đã trả</CardTitle>
            <DollarSign className="h-4 w-4 theme-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalCommissionsPaid || 0)}
            </div>
            <div className="flex items-center space-x-2 text-xs theme-text-muted">
              <span>Chờ trả: {formatCurrency(stats?.pendingCommissions || 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rút tiền</CardTitle>
            <TrendingUp className="h-4 w-4 theme-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalWithdrawals || 0)}
            </div>
            <div className="flex items-center space-x-2 text-xs theme-text-muted">
              <span>Chờ duyệt: {formatCurrency(stats?.pendingWithdrawals || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Cần xử lý</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">
                    {stats?.pendingF0s} F0 chờ duyệt
                  </p>
                  <p className="text-sm text-orange-600">
                    Có đăng ký mới cần xem xét
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Xem chi tiết
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">
                    Yêu cầu rút tiền chờ duyệt
                  </p>
                  <p className="text-sm text-yellow-600">
                    Tổng giá trị: {formatCurrency(stats?.pendingWithdrawals || 0)}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Xử lý ngay
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>Top F0 xuất sắc</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.topPerformers.map((performer, index) => (
                <div key={performer.f0Id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{performer.f0Name}</p>
                      <p className="text-xs theme-text-muted">
                        {performer.totalReferrals} giới thiệu
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(performer.totalCommissions)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'F0 mới đăng ký', user: 'Nguyễn Văn D', time: '2 phút trước', type: 'info' },
              { action: 'Voucher được sử dụng', user: 'F1: 0901234567', time: '15 phút trước', type: 'success' },
              { action: 'Yêu cầu rút tiền', user: 'Trần Thị E', time: '1 giờ trước', type: 'warning' },
              { action: 'F0 được duyệt', user: 'Lê Văn F', time: '2 giờ trước', type: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm theme-text-muted">{activity.user}</p>
                </div>
                <div className="text-sm theme-text-muted">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
