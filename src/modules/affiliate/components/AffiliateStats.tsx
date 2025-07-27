
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AffiliateStats as AffiliateStatsType } from '../types';
import { Users, Receipt, DollarSign, TrendingUp, Gift, Target, BarChart3, Wallet } from 'lucide-react';

interface AffiliateStatsProps {
  stats: AffiliateStatsType;
}

export function AffiliateStats({ stats }: AffiliateStatsProps) {
  const statCards = [
    {
      title: 'Tổng F0',
      value: stats.totalReferrers,
      icon: Users,
      color: 'theme-bg-primary',
      textColor: 'text-white'
    },
    {
      title: 'F0 Hoạt Động',
      value: stats.activeReferrers,
      icon: Target,
      color: 'berry-success',
      textColor: 'text-white'
    },
    {
      title: 'Voucher Đã Phát',
      value: stats.totalVouchersIssued,
      icon: Gift,
      color: 'theme-bg-secondary',
      textColor: 'text-white'
    },
    {
      title: 'Voucher Đã Sử Dụng',
      value: stats.totalVouchersUsed,
      icon: Receipt,
      color: 'berry-warning',
      textColor: 'text-white'
    },
    {
      title: 'Tỷ Lệ Chuyển Đổi',
      value: `${(stats.conversionRate * 100).toFixed(1)}%`,
      icon: BarChart3,
      color: 'berry-info',
      textColor: 'text-white'
    },
    {
      title: 'Tổng Hoa Hồng',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalCommissionPaid),
      icon: Wallet,
      color: 'berry-error',
      textColor: 'text-white'
    },
    {
      title: 'Doanh Thu Tạo Ra',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalSalesGenerated),
      icon: DollarSign,
      color: 'berry-primary',
      textColor: 'text-white'
    },
    {
      title: 'Giá Trị Đơn TB',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.averageOrderValue),
      icon: TrendingUp,
      color: 'berry-secondary',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium theme-text-muted">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
