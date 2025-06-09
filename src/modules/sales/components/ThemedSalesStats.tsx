
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Target } from 'lucide-react';

export function ThemedSalesStats() {
  const stats = [
    {
      title: 'Tổng doanh thu',
      value: '₫524.3M',
      change: '+15.2%',
      icon: DollarSign,
      variant: 'primary' as const
    },
    {
      title: 'Đơn hàng mới',
      value: '1,234',
      change: '+8.7%',
      icon: ShoppingCart,
      variant: 'secondary' as const
    },
    {
      title: 'Tăng trưởng',
      value: '23.1%',
      change: '+4.5%',
      icon: TrendingUp,
      variant: 'primary' as const
    },
    {
      title: 'Hoàn thành mục tiêu',
      value: '89.2%',
      change: '+12.1%',
      icon: Target,
      variant: 'secondary' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`theme-stats-card ${stat.variant === 'primary' ? 'theme-stats-primary' : 'theme-stats-secondary'}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium theme-text-muted">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.variant === 'primary' ? 'theme-text-primary' : 'theme-text-secondary'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-text">{stat.value}</div>
              <p className="text-xs theme-text-muted">
                <span className="theme-text-primary">{stat.change}</span> so với tháng trước
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
