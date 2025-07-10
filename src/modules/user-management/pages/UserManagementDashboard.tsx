
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Shield, UserCog, Plus, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserManagementDashboard() {
  const navigate = useNavigate();

  const navigationCards = [
    {
      title: 'Thành Viên',
      description: 'Quản lý danh sách thành viên và thông tin cá nhân',
      icon: Users,
      path: '/ERP/UserManagement/Members',
      color: 'theme-text-primary'
    },
    {
      title: 'Phòng Ban',
      description: 'Quản lý cơ cấu tổ chức và phòng ban',
      icon: Building2,
      path: '/ERP/UserManagement/Departments',
      color: 'theme-text-secondary'
    },
    {
      title: 'Vai Trò',
      description: 'Quản lý vai trò và quyền hạn trong hệ thống',
      icon: Shield,
      path: '/ERP/UserManagement/Roles',
      color: 'theme-text-success'
    },
    {
      title: 'Nhóm',
      description: 'Quản lý nhóm người dùng và phân quyền',
      icon: UserCog,
      path: '/ERP/UserManagement/Groups',
      color: 'theme-text-info'
    }
  ];

  const quickActions = [
    {
      title: 'Thêm Thành Viên',
      description: 'Tạo tài khoản người dùng mới',
      icon: Plus,
      action: () => navigate('/ERP/UserManagement/Members')
    },
    {
      title: 'Cấu Hình',
      description: 'Cài đặt chung cho module',
      icon: Settings,
      action: () => navigate('/ERP/Setting')
    },
    {
      title: 'Báo Cáo',
      description: 'Xem báo cáo hoạt động',
      icon: BarChart3,
      action: () => navigate('/ERP/UserManagement/Members')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="theme-gradient rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản Lý Người Dùng</h1>
            <p className="text-white/90">
              Tổng quan và quản lý tất cả các khía cạnh về người dùng trong hệ thống ERP
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Thành Viên</CardTitle>
            <Users className="w-4 h-4 theme-text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+2 so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phòng Ban</CardTitle>
            <Building2 className="w-4 h-4 theme-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Không thay đổi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vai Trò</CardTitle>
            <Shield className="w-4 h-4 theme-text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+1 vai trò mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhóm Người Dùng</CardTitle>
            <UserCog className="w-4 h-4 theme-text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Hoạt động tốt</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Chức Năng Chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {navigationCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{card.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                        <Button 
                          onClick={() => navigate(card.path)}
                          size="sm" 
                          className="voucher-button-primary"
                        >
                          Quản Lý
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Hành Động Nhanh</h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 theme-text-primary" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                      <Button 
                        onClick={action.action}
                        size="sm" 
                        variant="outline"
                      >
                        Thực hiện
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt Động Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-4 h-4 theme-text-primary" />
              <div className="flex-1">
                <div className="text-sm font-medium">Nguyễn Văn A đã được thêm vào nhóm "Marketing"</div>
                <div className="text-xs text-muted-foreground">2 giờ trước</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-4 h-4 theme-text-success" />
              <div className="flex-1">
                <div className="text-sm font-medium">Vai trò "Telesales Lead" đã được cập nhật quyền hạn</div>
                <div className="text-xs text-muted-foreground">5 giờ trước</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Building2 className="w-4 h-4 theme-text-secondary" />
              <div className="flex-1">
                <div className="text-sm font-medium">Phòng ban "IT Support" đã được tạo mới</div>
                <div className="text-xs text-muted-foreground">1 ngày trước</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
