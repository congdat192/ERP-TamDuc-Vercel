import { AlertCircle, Users, Clock, UserPlus, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemedHRStats } from '../components/ThemedHRStats';

export function HRDashboard() {
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
        <Card className="theme-card">
          <CardHeader>
            <CardTitle className="theme-text">Biến Động Nhân Sự</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 theme-text-secondary">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có dữ liệu biến động nhân sự</p>
                <p className="text-sm mt-2">Dữ liệu sẽ hiển thị khi có nhân viên vào/ra</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="theme-card">
          <CardHeader>
            <CardTitle className="theme-text">Chi Phí Lương Theo Tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 theme-text-secondary">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có dữ liệu chi phí lương</p>
                <p className="text-sm mt-2">Dữ liệu sẽ hiển thị sau khi tính lương</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Cảnh Báo Tự Động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="theme-border-primary">
              <AlertCircle className="h-3 w-3 mr-1" />
              Hợp đồng sắp hết hạn: 0
            </Badge>
            <Badge variant="outline" className="theme-border-primary">
              <AlertCircle className="h-3 w-3 mr-1" />
              KPI thấp cần review: 0
            </Badge>
            <Badge variant="outline" className="theme-border-primary">
              <AlertCircle className="h-3 w-3 mr-1" />
              Nhân viên thử việc sắp đánh giá: 0
            </Badge>
            <Badge variant="outline" className="theme-border-primary">
              <AlertCircle className="h-3 w-3 mr-1" />
              Đơn nghỉ phép chờ duyệt: 0
            </Badge>
          </div>
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
