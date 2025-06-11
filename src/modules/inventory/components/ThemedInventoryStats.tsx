
import { UniversalStatCard } from '@/components/ui/UniversalStatCard';
import { Package, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

export function ThemedInventoryStats() {
  const statsData = [
    {
      title: 'Tổng hàng hóa',
      value: '2,847',
      change: '+12.3%',
      trend: 'up' as const,
      icon: Package,
      description: 'Tổng số mặt hàng trong kho'
    },
    {
      title: 'Đang bán',
      value: '2,456',
      change: '+8.7%',
      trend: 'up' as const,
      icon: TrendingUp,
      description: 'Số mặt hàng đang kinh doanh'
    },
    {
      title: 'Sắp hết hàng',
      value: '24',
      change: '-3.2%',
      trend: 'down' as const,
      icon: AlertTriangle,
      description: 'Cần nhập thêm hàng'
    },
    {
      title: 'Giá trị tồn kho',
      value: '1.2 tỷ',
      change: '+15.4%',
      trend: 'up' as const,
      icon: BarChart3,
      description: 'Tổng giá trị hàng tồn kho'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <UniversalStatCard
          key={stat.title}
          {...stat}
          colorIndex={index}
        />
      ))}
    </div>
  );
}
