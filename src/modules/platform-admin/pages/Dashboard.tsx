
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Server, 
  DollarSign,
  Activity,
  Bell
} from 'lucide-react';
import { mockPlatformStats, mockRecentActivities } from '../utils/mockData';
import { StatCard } from '../components/StatCard';
import { RecentActivityCard } from '../components/RecentActivityCard';
import { SystemHealthCard } from '../components/SystemHealthCard';

export function PlatformAdminDashboard() {
  const stats = mockPlatformStats();
  const activities = mockRecentActivities();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển Nền Tảng</h1>
          <p className="text-gray-600 mt-1">Tổng quan quản lý hệ thống ERP</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Thông Báo
          </Button>
          <Button size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {stats.criticalAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">
                Có {stats.criticalAlerts} cảnh báo quan trọng cần xử lý ngay lập tức
              </span>
              <Button variant="outline" size="sm" className="ml-auto">
                Xem Chi Tiết
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Khách Hàng"
          value={stats.totalTenants.toString()}
          change={`+${stats.newTenantsThisMonth} tháng này`}
          icon={Building2}
          trend="up"
        />
        <StatCard
          title="Khách Hàng Hoạt Động"
          value={stats.activeTenants.toString()}
          change={`${Math.round((stats.activeTenants / stats.totalTenants) * 100)}% tổng số`}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Doanh Thu Tháng"
          value={`${stats.monthlyRevenue.toLocaleString('vi-VN')} VNĐ`}
          change={`+${stats.revenueGrowth}% so với tháng trước`}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Trạng Thái Hệ Thống"
          value={`${stats.systemUptime}%`}
          change="24h qua"
          icon={Server}
          trend={stats.systemUptime > 99 ? "up" : "down"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <RecentActivityCard activities={activities} />
        
        {/* System Health */}
        <SystemHealthCard />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Hành Động Nhanh</span>
          </CardTitle>
          <CardDescription>
            Các thao tác quản lý thường dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Building2 className="w-6 h-6" />
              <span>Thêm Khách Hàng Mới</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Bell className="w-6 h-6" />
              <span>Gửi Thông Báo</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Activity className="w-6 h-6" />
              <span>Xem Báo Cáo Chi Tiết</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
