
import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Shield, UserCog, ArrowLeft } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';

export function UserManagementLayout() {
  const location = useLocation();
  const navigate = useNavigate();

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

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === '/ERP/UserManagement') return 'Tổng Quan';
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.label : 'Quản Lý Người Dùng';
  };

  const handleBackClick = () => {
    navigate('/ERP/UserManagement');
  };

  const isOnSubPage = location.pathname !== '/ERP/UserManagement';

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      {isOnSubPage && (
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => navigate('/ERP/UserManagement')}
                  className="cursor-pointer"
                >
                  Quản Lý Người Dùng
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getCurrentPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
        </div>
      )}

      {/* Navigation tabs for sub-pages */}
      {isOnSubPage && (
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
      )}

      {/* Content */}
      <Outlet />
    </div>
  );
}
