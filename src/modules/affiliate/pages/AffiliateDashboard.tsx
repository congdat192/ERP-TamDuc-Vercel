import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, TrendingUp, Users, Wallet, Gift, Activity, DollarSign, UserCheck } from 'lucide-react';
import { affiliateService } from '../services/affiliateService';
import { UniversalStatCard } from '@/components/ui/UniversalStatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function AffiliateDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['affiliate-stats'],
    queryFn: affiliateService.getAffiliateStats,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['affiliate-chart-data'],
    queryFn: affiliateService.getChartData,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['affiliate-alerts'],
    queryFn: affiliateService.getAlerts,
  });

  const { data: pendingF0, isLoading: pendingF0Loading } = useQuery({
    queryKey: ['pending-f0'],
    queryFn: affiliateService.getPendingF0,
  });

  const { data: recentWithdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['recent-withdrawals'],
    queryFn: affiliateService.getRecentWithdrawals,
  });

  const { data: recentCommissions, isLoading: commissionsLoading } = useQuery({
    queryKey: ['recent-commissions'],
    queryFn: affiliateService.getRecentCommissions,
  });

  const handleViewAll = (page: string) => {
    navigate(`/affiliate/${page}`);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Filter logic can be implemented here
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // Refetch data with new date range
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  if (statsLoading || chartLoading || alertsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan chương trình giới thiệu khách hàng</p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm nhanh..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Hôm nay</SelectItem>
              <SelectItem value="7d">7 ngày</SelectItem>
              <SelectItem value="30d">30 ngày</SelectItem>
              <SelectItem value="90d">3 tháng</SelectItem>
              <SelectItem value="custom">Tùy chỉnh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.filter(alert => !alert.isRead).slice(0, 3).map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${alert.type === 'critical' ? 'border-l-red-500' : alert.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getAlertBadgeVariant(alert.type)}>
                      {alert.type === 'critical' ? 'Khẩn cấp' : alert.type === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                    </Badge>
                    {alert.actionUrl && (
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UniversalStatCard
          title="Tổng F0 đã đăng ký"
          value={(stats?.totalF0Registered || 0).toString()}
          change={`+${stats?.newF0ThisMonth || 0} F0 mới tháng này`}
          icon={Users}
          colorIndex={0}
        />
        <UniversalStatCard
          title="Tổng F1 được mời"
          value={(stats?.totalF1Invited || 0).toString()}
          change={`+${stats?.newF1ThisMonth || 0} F1 mới tháng này`}
          icon={UserCheck}
          colorIndex={1}
        />
        <UniversalStatCard
          title="Giới thiệu thành công"
          value={(stats?.totalSuccessfulReferrals || 0).toString()}
          change={`${((stats?.totalSuccessfulReferrals || 0) / (stats?.totalF1Invited || 1) * 100).toFixed(1)}% tỷ lệ thành công`}
          icon={TrendingUp}
          colorIndex={2}
        />
        <UniversalStatCard
          title="Hoa hồng đã chi trả"
          value={`₫${(stats?.totalCommissionPaid || 0).toLocaleString()}`}
          change={`₫${(stats?.totalCommissionPending || 0).toLocaleString()} đang chờ xử lý`}
          icon={DollarSign}
          colorIndex={3}
        />
        <UniversalStatCard
          title="Hoa hồng chờ xử lý"
          value={`₫${(stats?.totalCommissionPending || 0).toLocaleString()}`}
          change={`+${stats?.newF0Today || 0} F0 mới hôm nay`}
          icon={Wallet}
          colorIndex={0}
        />
        <UniversalStatCard
          title="Voucher đã phát"
          value={(stats?.totalVouchersIssued || 0).toString()}
          change={`+${stats?.newF1Today || 0} F1 mới hôm nay`}
          icon={Gift}
          colorIndex={1}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng giới thiệu</CardTitle>
            <CardDescription>Lượt giới thiệu và thành công theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="referrals" stroke="#2196F3" strokeWidth={2} name="Lượt giới thiệu" />
                <Line type="monotone" dataKey="successful" stroke="#00E676" strokeWidth={2} name="Thành công" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoa hồng theo thời gian</CardTitle>
            <CardDescription>Tổng hoa hồng được tạo hàng ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commission" fill="#3FB0AC" name="Hoa hồng (VND)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending F0 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>F0 chờ duyệt</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewAll('f0-approval')}
            >
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingF0Loading ? (
                <div>Loading...</div>
              ) : (
                pendingF0?.map((f0) => (
                  <div key={f0.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{f0.name}</p>
                      <p className="text-sm text-muted-foreground">{f0.email}</p>
                      <p className="text-xs text-muted-foreground">{f0.registrationDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusBadgeVariant(f0.status)}>
                        {f0.status === 'pending' ? 'Chờ duyệt' : f0.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{f0.totalF1} F1</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Withdrawals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Yêu cầu rút tiền</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewAll('withdrawal-management')}
            >
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawalsLoading ? (
                <div>Loading...</div>
              ) : (
                recentWithdrawals?.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{withdrawal.f0Name}</p>
                      <p className="text-sm text-muted-foreground">{withdrawal.bankInfo.bankName}</p>
                      <p className="text-xs text-muted-foreground">{withdrawal.requestDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{withdrawal.amount.toLocaleString()} VND</p>
                      <Badge variant={getStatusBadgeVariant(withdrawal.status)}>
                        {withdrawal.status === 'pending' ? 'Chờ xử lý' : withdrawal.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Commissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hoa hồng mới nhất</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewAll('referral-management')}
            >
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commissionsLoading ? (
                <div>Loading...</div>
              ) : (
                recentCommissions?.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{commission.f0Name}</p>
                      <p className="text-sm text-muted-foreground">F1: {commission.f1Name}</p>
                      <p className="text-xs text-muted-foreground">{commission.createdDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{commission.commissionAmount.toLocaleString()} VND</p>
                      <Badge variant={getStatusBadgeVariant(commission.status)}>
                        {commission.status === 'pending' ? 'Chờ duyệt' : commission.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
