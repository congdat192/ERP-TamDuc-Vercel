
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Ticket, Users, TrendingUp } from 'lucide-react';

export function ThemedVoucherStats() {
  const stats = [
    {
      title: 'Tổng voucher',
      value: '12,847',
      change: '+18.5%',
      icon: Gift,
      variant: 'primary' as const
    },
    {
      title: 'Đã sử dụng',
      value: '8,234',
      change: '+22.1%',
      icon: Ticket,
      variant: 'secondary' as const
    },
    {
      title: 'Người dùng',
      value: '3,926',
      change: '+15.3%',
      icon: Users,
      variant: 'primary' as const
    },
    {
      title: 'Tỷ lệ sử dụng',
      value: '64.1%',
      change: '+7.2%',
      icon: TrendingUp,
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
            className="voucher-card hover:shadow-lg transition-all duration-200 border theme-border-primary/20"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium theme-text-muted">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.variant === 'primary' ? 'theme-bg-primary' : 'theme-bg-secondary'}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-text">{stat.value}</div>
              <p className="text-xs theme-text-muted">
                <span className={`font-medium ${stat.variant === 'primary' ? 'theme-text-primary' : 'theme-text-secondary'}`}>
                  {stat.change}
                </span> so với tháng trước
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
