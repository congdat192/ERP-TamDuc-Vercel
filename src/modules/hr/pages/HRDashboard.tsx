import { useState, useEffect } from 'react';
import { AlertCircle, Users, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ThemedHRStats } from '../components/ThemedHRStats';
import { DashboardService } from '../services/dashboardService';
import type { 
  HRDashboardStats,
  MonthlyEmployeeMovement, 
  MonthlySalaryCost, 
  DepartmentStats 
} from '../services/dashboardService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function HRDashboard() {
  const [stats, setStats] = useState<HRDashboardStats | null>(null);
  const [movement, setMovement] = useState<MonthlyEmployeeMovement[]>([]);
  const [salaryCost, setSalaryCost] = useState<MonthlySalaryCost[]>([]);
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [statsData, movementData, salaryData, deptData] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getEmployeeMovement(),
        DashboardService.getMonthlySalaryCost(),
        DashboardService.getDepartmentStats()
      ]);
      
      setStats(statsData);
      setMovement(movementData);
      setSalaryCost(salaryData);
      setDepartments(deptData);
    } catch (error: any) {
      console.error('❌ Error fetching dashboard data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu dashboard",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="hr-gradient rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">HR Management System – TamDuc ERP</h1>
        <p className="text-white/90">Quản lý toàn diện nguồn nhân lực</p>
      </div>

      {/* Stats Overview */}
      <ThemedHRStats />

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Movement Chart */}
        <Card className="theme-card">
          <CardHeader>
            <CardTitle className="theme-text">Biến Động Nhân Sự (6 tháng gần nhất)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="theme-text-secondary">Đang tải...</p>
              </div>
            ) : movement.length === 0 || movement.every(m => m.newHires === 0 && m.terminations === 0) ? (
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có dữ liệu biến động nhân sự</p>
                  <p className="text-sm mt-2">Dữ liệu sẽ hiển thị khi có nhân viên vào/ra</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={movement}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year}`;
                    }}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    labelFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `Tháng ${month}/${year}`;
                    }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="newHires" fill="#10b981" name="Nhân viên mới" />
                  <Bar dataKey="terminations" fill="#ef4444" name="Nghỉ việc" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Salary Cost Chart */}
        <Card className="theme-card">
          <CardHeader>
            <CardTitle className="theme-text">Chi Phí Lương Theo Tháng</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="theme-text-secondary">Đang tải...</p>
              </div>
            ) : salaryCost.length === 0 || salaryCost.every(s => s.totalCost === 0) ? (
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có dữ liệu chi phí lương</p>
                  <p className="text-sm mt-2">Dữ liệu sẽ hiển thị sau khi tính lương</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salaryCost}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year}`;
                    }}
                    className="text-xs"
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    className="text-xs"
                  />
                  <Tooltip 
                    labelFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `Tháng ${month}/${year}`;
                    }}
                    formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M VNĐ`, 'Chi phí']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Bar dataKey="totalCost" fill="#3b82f6" name="Tổng chi phí" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Phân Bổ Theo Phòng Ban</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="theme-text-secondary">Đang tải...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="flex items-center justify-center h-64 theme-text-secondary">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có dữ liệu phòng ban</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departments}
                  dataKey="employeeCount"
                  nameKey="department"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.department}: ${entry.employeeCount}`}
                  labelLine={true}
                >
                  {departments.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Cảnh Báo Tự Động</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="theme-text-secondary">Đang tải...</p>
          ) : stats ? (
            <div className="flex flex-wrap gap-3">
              <Badge 
                variant={stats.contractExpiringSoon > 0 ? "destructive" : "outline"} 
                className="theme-border-primary"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Hợp đồng sắp hết hạn: {stats.contractExpiringSoon}
              </Badge>
              <Badge 
                variant={stats.lowKpiCount > 0 ? "destructive" : "outline"} 
                className="theme-border-primary"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                KPI thấp cần review: {stats.lowKpiCount}
              </Badge>
              <Badge 
                variant={stats.probationReviewDue > 0 ? "destructive" : "outline"} 
                className="theme-border-primary"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Nhân viên thử việc sắp đánh giá: {stats.probationReviewDue}
              </Badge>
              <Badge 
                variant={stats.pendingLeaveRequests > 0 ? "destructive" : "outline"} 
                className="theme-border-primary"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Đơn nghỉ phép chờ duyệt: {stats.pendingLeaveRequests}
              </Badge>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Users className="h-8 w-8 theme-text-primary mb-3" />
            <h3 className="font-semibold theme-text mb-2">Hồ Sơ Nhân Sự</h3>
            <p className="text-sm theme-text-secondary">
              Quản lý thông tin và hợp đồng nhân viên
            </p>
          </CardContent>
        </Card>

        <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Clock className="h-8 w-8 theme-text-primary mb-3" />
            <h3 className="font-semibold theme-text mb-2">Chấm Công</h3>
            <p className="text-sm theme-text-secondary">
              Theo dõi ca làm và chấm công nhân viên
            </p>
          </CardContent>
        </Card>

        <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Target className="h-8 w-8 theme-text-primary mb-3" />
            <h3 className="font-semibold theme-text mb-2">Hiệu Suất</h3>
            <p className="text-sm theme-text-secondary">
              Đánh giá KPI và OKR của nhân viên
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
