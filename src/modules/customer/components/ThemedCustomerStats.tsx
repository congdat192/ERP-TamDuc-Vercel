
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, UserCheck, TrendingUp } from 'lucide-react';

export function ThemedCustomerStats() {
  const stats = [
    {
      title: 'Tổng khách hàng',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      variant: 'primary' as const
    },
    {
      title: 'Khách hàng mới',
      value: '124',
      change: '+8.2%',
      icon: UserPlus,
      variant: 'secondary' as const
    },
    {
      title: 'Khách hàng hoạt động',
      value: '1,926',
      change: '+5.1%',
      icon: UserCheck,
      variant: 'primary' as const
    },
    {
      title: 'Tăng trưởng',
      value: '18.3%',
      change: '+2.4%',
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
