import { useState, useEffect } from 'react';
import { Users, Clock, UserPlus, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { DashboardService, HRDashboardStats } from '../services/dashboardService';

export function ThemedHRStats() {
  const [stats, setStats] = useState<HRDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await DashboardService.getStats();
      setStats(data);
    } catch (error: any) {
      console.error('❌ Error fetching HR stats:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thống kê nhân sự",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="theme-card">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Tổng Nhân Viên',
      value: stats.totalEmployees.toString(),
      icon: Users,
      trend: `${stats.activeEmployees} active`,
      description: `${stats.probationEmployees} thử việc`,
    },
    {
      title: 'Đi Làm Hôm Nay',
      value: stats.todayAttendance > 0 
        ? `${stats.todayAttendance}/${stats.totalEmployees}` 
        : '-',
      icon: Clock,
      trend: stats.todayAttendanceRate > 0 
        ? `${stats.todayAttendanceRate}%` 
        : 'Chưa có data',
      description: 'Tỷ lệ chấm công',
    },
    {
      title: 'Đang Tuyển',
      value: stats.openRecruitment.toString(),
      icon: UserPlus,
      trend: stats.openRecruitment > 0 ? `${stats.openRecruitment} vị trí` : 'Không có',
      description: 'Vị trí tuyển dụng',
    },
    {
      title: 'KPI Trung Bình',
      value: stats.avgKpi > 0 ? `${stats.avgKpi}%` : '-',
      icon: Target,
      trend: stats.lowKpiCount > 0 
        ? `${stats.lowKpiCount} thấp (<60%)` 
        : 'Tốt',
      description: 'Hiệu suất nhân viên',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
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
