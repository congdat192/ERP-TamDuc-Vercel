import { Users, Clock, UserPlus, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ThemedHRStats() {
  const stats = [
    {
      title: 'Tổng Nhân Viên',
      value: '0',
      icon: Users,
      trend: '+0%',
      description: 'So với tháng trước',
    },
    {
      title: 'Đi Làm Hôm Nay',
      value: '0',
      icon: Clock,
      trend: '0%',
      description: 'Tỷ lệ chấm công',
    },
    {
      title: 'Đang Tuyển',
      value: '0',
      icon: UserPlus,
      trend: '0',
      description: 'Vị trí tuyển dụng',
    },
    {
      title: 'KPI Trung Bình',
      value: '-',
      icon: Target,
      trend: '0%',
      description: 'Hiệu suất nhân viên',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm theme-text-secondary">{stat.title}</p>
                  <h3 className="text-2xl font-bold theme-text mt-2">{stat.value}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs theme-text-success font-medium">
                      {stat.trend}
                    </span>
                    <span className="text-xs theme-text-secondary">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full theme-bg-accent flex items-center justify-center">
                  <Icon className="h-6 w-6 theme-text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
