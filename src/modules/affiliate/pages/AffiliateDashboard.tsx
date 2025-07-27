
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversalStatCard } from '@/components/ui/UniversalStatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  Users,
  UserPlus,
  TrendingUp,
  DollarSign,
  Clock,
  Ticket,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { mockDashboardStats, mockChartData, mockF0Data, mockCommissionData, mockWithdrawalRequests, mockAlertsData } from '../utils/mockData';

export function AffiliateDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  
  const stats = mockDashboardStats;
  const chartData = mockChartData;
  const pendingF0 = mockF0Data.filter(f0 => f0.status === 'pending').slice(0, 5);
  const pendingCommissions = mockCommissionData.filter(c => c.status === 'pending').slice(0, 5);
  const pendingWithdrawals = mockWithdrawalRequests.filter(w => w.status === 'pending').slice(0, 5);
  const unreadAlerts = mockAlertsData.filter(alert => !alert.isRead);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Chờ duyệt', variant: 'secondary' as const },
      approved: { label: 'Đã duyệt', variant: 'default' as const },
      rejected: { label: 'Từ chối', variant: 'destructive' as const },
      paid: { label: 'Đã thanh toán', variant: 'default' as const }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return statusInfo ? (
      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
    ) : (
      <Badge variant="outline">{status}</Badge>
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'f0_pending':
        return <Users className="w-4 h-4" />;
      case 'withdrawal_request':
        return <DollarSign className="w-4 h-4" />;
      case 'commission_pending':
        return <Clock className="w-4 h-4" />;
      case 'voucher_expiry':
        return <Ticket className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Affiliate</h1>
          <p className="text-gray-600">Quản lý chương trình giới thiệu khách hàng</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Tùy chỉnh thời gian
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {unreadAlerts.length > 0 && (
        <div className="grid gap-3">
          {unreadAlerts.slice(0, 3).map((alert) => (
            <Alert key={alert.id} variant={getAlertVariant(alert.priority)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAlertIcon(alert.type)}
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </div>
                </div>
                {alert.actionUrl && (
                  <Button variant="ghost" size="sm">
                    {alert.actionText}
                  </Button>
                )}
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UniversalStatCard
          title="Tổng F0 Đăng Ký"
          value={stats.totalF0.toLocaleString()}
          change={`+${stats.newF0ThisMonth}`}
          icon={Users}
          colorIndex={0}
        />
        <UniversalStatCard
          title="Tổng F1 Được Mời"
          value={stats.totalF1.toLocaleString()}
          change={`+${stats.newF1ThisMonth}`}
          icon={UserPlus}
          colorIndex={1}
        />
        <UniversalStatCard
          title="Giới Thiệu Thành Công"
          value={stats.totalSuccessfulReferrals.toLocaleString()}
          change={`${((stats.totalSuccessfulReferrals / stats.totalF1) * 100).toFixed(1)}%`}
          icon={TrendingUp}
          colorIndex={2}
        />
        <UniversalStatCard
          title="Hoa Hồng Đã Chi Trả"
          value={formatCurrency(stats.totalCommissionPaid)}
          change={`${((stats.totalCommissionPaid / (stats.totalCommissionPaid + stats.totalCommissionPending)) * 100).toFixed(1)}%`}
          icon={DollarSign}
          colorIndex={3}
        />
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UniversalStatCard
          title="Hoa Hồng Chờ Xử Lý"
          value={formatCurrency(stats.totalCommissionPending)}
          change={`${pendingCommissions.length} khoản`}
          icon={Clock}
          colorIndex={1}
        />
        <UniversalStatCard
          title="Voucher Đã Phát Ra"
          value={stats.totalVouchersIssued.toLocaleString()}
          change={`${stats.newF0Today} hôm nay`}
          icon={Ticket}
          colorIndex={2}
        />
        <UniversalStatCard
          title="F0/F1 Mới Hôm Nay"
          value={`${stats.newF0Today}/${stats.newF1Today}`}
          change={`Tháng này: ${stats.newF0ThisMonth}/${stats.newF1ThisMonth}`}
          icon={Calendar}
          colorIndex={0}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xu Hướng Giới Thiệu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="referrals" 
                  stroke="hsl(var(--voucher-primary-500))" 
                  strokeWidth={2}
                  name="Tổng Giới Thiệu"
                />
                <Line 
                  type="monotone" 
                  dataKey="successfulReferrals" 
                  stroke="hsl(var(--voucher-secondary-500))" 
                  strokeWidth={2}
                  name="Thành Công"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoa Hồng Theo Thời Gian</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar 
                  dataKey="commissionAmount" 
                  fill="hsl(var(--voucher-primary-500))" 
                  name="Hoa Hồng"
                />
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
            <CardTitle>F0 Chờ Duyệt</CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingF0.map((f0) => (
                <div key={f0.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{f0.name}</p>
                    <p className="text-sm text-gray-600">{f0.email}</p>
                    <p className="text-xs text-gray-500">
                      Đăng ký: {formatDate(f0.registrationDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Withdrawals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Yêu Cầu Rút Tiền</CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                    <p className="text-sm text-gray-600">{withdrawal.bankInfo.accountName}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(withdrawal.requestDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(withdrawal.status)}
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Commissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hoa Hồng Mới Nhất</CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingCommissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{formatCurrency(commission.commissionAmount)}</p>
                    <p className="text-sm text-gray-600">
                      Đơn hàng: {commission.orderId}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(commission.createdDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(commission.status)}
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
