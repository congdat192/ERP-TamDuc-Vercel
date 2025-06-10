
import { DollarSign, ShoppingCart, TrendingUp, Target } from 'lucide-react';
import { UniversalStatCard } from '@/components/ui/UniversalStatCard';

export function ThemedSalesStats() {
  const stats = [
    {
      title: 'Tổng doanh thu',
      value: '₫524.3M',
      change: '+15.2%',
      icon: DollarSign
    },
    {
      title: 'Đơn hàng mới',
      value: '1,234',
      change: '+8.7%',
      icon: ShoppingCart
    },
    {
      title: 'Tăng trưởng',
      value: '23.1%',
      change: '+4.5%',
      icon: TrendingUp
    },
    {
      title: 'Hoàn thành mục tiêu',
      value: '89.2%',
      change: '+12.1%',
      icon: Target
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
