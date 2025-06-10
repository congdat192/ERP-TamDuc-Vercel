
import { Gift, Ticket, Users, TrendingUp } from 'lucide-react';
import { UniversalStatCard } from '@/components/ui/UniversalStatCard';

export function ThemedVoucherStats() {
  const stats = [
    {
      title: 'Tổng voucher',
      value: '12,847',
      change: '+18.5%',
      icon: Gift
    },
    {
      title: 'Đã sử dụng',
      value: '8,234',
      change: '+22.1%',
      icon: Ticket
    },
    {
      title: 'Người dùng',
      value: '3,926',
      change: '+15.3%',
      icon: Users
    },
    {
      title: 'Tỷ lệ sử dụng',
      value: '64.1%',
      change: '+7.2%',
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
