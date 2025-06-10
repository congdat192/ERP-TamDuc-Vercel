
import { Users, UserPlus, UserCheck, TrendingUp } from 'lucide-react';
import { UniversalStatCard } from '@/components/ui/UniversalStatCard';

export function ThemedCustomerStats() {
  const stats = [
    {
      title: 'Tổng khách hàng',
      value: '2,847',
      change: '+12.5%',
      icon: Users
    },
    {
      title: 'Khách hàng mới',
      value: '124',
      change: '+8.2%',
      icon: UserPlus
    },
    {
      title: 'Khách hàng hoạt động',
      value: '1,926',
      change: '+5.1%',
      icon: UserCheck
    },
    {
      title: 'Tăng trưởng',
      value: '18.3%',
      change: '+2.4%',
      icon: TrendingUp
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <UniversalStatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          colorIndex={index}
        />
      ))}
    </div>
  );
}
