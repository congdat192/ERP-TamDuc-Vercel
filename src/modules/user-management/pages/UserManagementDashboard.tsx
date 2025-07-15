
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Shield, UserCog, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardService, UserManagementCounts } from '../services/dashboardService';

export function UserManagementDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<UserManagementCounts>({
    members: 0,
    departments: 0,
    roles: 0,
    groups: 0,
    invitations: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      setIsLoading(true);
      const countsData = await DashboardService.getCounts();
      setCounts(countsData);
    } catch (error) {
      console.error('Error loading counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      title: 'Thành Viên',
      icon: Users,
      path: '/ERP/UserManagement/Members',
      stats: counts.members.toString(),
      color: 'text-blue-600'
    },
    {
      title: 'Phòng Ban',
      icon: Building2,
      path: '/ERP/UserManagement/Departments',
      stats: counts.departments.toString(),
      color: 'text-green-600'
    },
    {
      title: 'Vai Trò',
      icon: Shield,
      path: '/ERP/UserManagement/Roles',
      stats: counts.roles.toString(),
      color: 'text-purple-600'
    },
    {
      title: 'Nhóm',
      icon: UserCog,
      path: '/ERP/UserManagement/Groups',
      stats: counts.groups.toString(),
      color: 'text-orange-600'
    },
    {
      title: 'Lời Mời',
      icon: Mail,
      path: '/ERP/UserManagement/Invitations',
      stats: counts.invitations.toString(),
      color: 'text-pink-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Người Dùng</h1>
        <p className="text-gray-600">
          Chọn tính năng bạn muốn sử dụng
        </p>
      </div>

      {/* Features Grid - 1x5 layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.title} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {/* Icon and Stats */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className={`w-6 h-6 ${feature.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          feature.stats
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Tổng số</div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                  </div>
                  
                  {/* Access Button */}
                  <Button 
                    onClick={() => navigate(feature.path)}
                    className="w-full h-10 text-sm font-medium"
                    size="sm"
                    disabled={isLoading}
                  >
                    Truy cập
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
