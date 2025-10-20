import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TrainingProgramService } from '../../services/trainingProgramService';
import { TrainingSessionService } from '../../services/trainingSessionService';
import { TrainingEnrollmentService } from '../../services/trainingEnrollmentService';
import { useToast } from '@/hooks/use-toast';

export function TrainingDashboardTab() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activeSessions: 0,
    totalEnrollments: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Load programs
      const programs = await TrainingProgramService.getPrograms();
      const activePrograms = programs.filter(p => p.status !== 'cancelled');
      
      // Load sessions
      const sessions = await TrainingSessionService.getSessions();
      const activeSessions = sessions.filter(s => 
        s.status === 'scheduled' || s.status === 'ongoing'
      );
      
      // Load enrollments
      const enrollments = await TrainingEnrollmentService.getEnrollments();
      const completed = enrollments.filter(e => e.status === 'completed').length;
      const completionRate = enrollments.length > 0 
        ? Math.round((completed / enrollments.length) * 100) 
        : 0;

      setStats({
        totalPrograms: activePrograms.length,
        activeSessions: activeSessions.length,
        totalEnrollments: enrollments.length,
        completionRate
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Chương Trình Đào Tạo',
      value: stats.totalPrograms,
      icon: BookOpen,
      description: 'Tổng số chương trình',
      color: 'text-blue-600'
    },
    {
      title: 'Lớp Học Đang Diễn Ra',
      value: stats.activeSessions,
      icon: Users,
      description: 'Scheduled & Ongoing',
      color: 'text-green-600'
    },
    {
      title: 'Học Viên',
      value: stats.totalEnrollments,
      icon: GraduationCap,
      description: 'Tổng số ghi danh',
      color: 'text-purple-600'
    },
    {
      title: 'Tỷ Lệ Hoàn Thành',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      description: 'Completion rate',
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-10 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-2" />
              <div className="h-3 w-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chào mừng đến Module Đào Tạo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Hệ thống quản lý đào tạo toàn diện với các tính năng:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Quản lý chương trình & lớp học (internal + external trainers)</li>
            <li>E-learning: Video nhúng, Quiz scoring (pre/post/mid-test)</li>
            <li>Tự động nâng cấp năng lực khi hoàn thành khóa (điểm ≥ 85)</li>
            <li>Gợi ý khóa học dựa trên competency gap</li>
            <li>Email thông báo tự động (qua Resend API)</li>
            <li>Quiz retake policy tùy chỉnh, lấy điểm cao nhất</li>
            <li>Feedback system cho đánh giá giảng viên</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
