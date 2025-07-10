
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Shield, UserCog } from 'lucide-react';

export function UserManagementLayout() {
  const location = useLocation();

  const navItems = [
    {
      path: '/ERP/UserManagement/Members',
      label: 'Thành Viên',
      icon: Users
    },
    {
      path: '/ERP/UserManagement/Departments',
      label: 'Phòng Ban',
      icon: Building2
    },
    {
      path: '/ERP/UserManagement/Roles',
      label: 'Vai Trò',
      icon: Shield
    },
    {
      path: '/ERP/UserManagement/Groups',
      label: 'Nhóm',
      icon: UserCog
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
              Quản lý thành viên, phòng ban, vai trò và nhóm người dùng trong hệ thống ERP
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
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phòng Ban</CardTitle>
            <Building2 className="w-4 h-4 theme-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vai Trò</CardTitle>
            <Shield className="w-4 h-4 theme-text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhóm Người Dùng</CardTitle>
            <UserCog className="w-4 h-4 theme-text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      isActive
                        ? 'border-primary text-primary font-medium'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Outlet />
    </div>
  );
}
