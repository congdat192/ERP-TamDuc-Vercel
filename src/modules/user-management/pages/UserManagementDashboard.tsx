
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardService, UserManagementCounts } from '../services/dashboardService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthContext';

export function UserManagementDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [counts, setCounts] = useState<UserManagementCounts>({
    members: 0,
    roles: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Phase 2 & 3: Navigation guard + auto-redirect
  useEffect(() => {
    if (!currentUser) {
      console.log('⏳ [UserManagementDashboard] Waiting for currentUser...');
      
      const timeoutId = setTimeout(() => {
        if (!currentUser) {
          console.error('❌ [UserManagementDashboard] currentUser still null after 3s - redirecting to login');
          toast({
            title: "Phiên đăng nhập hết hạn",
            description: "Vui lòng đăng nhập lại.",
            variant: "destructive"
          });
          navigate('/login');
        }
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
    
    // Phase 3: Auto-redirect to Members page if user has access
    const hasViewMembersPermission = currentUser.permissions?.modules?.includes('user-management');
    
    if (hasViewMembersPermission) {
      console.log('✅ [UserManagementDashboard] User has access - redirecting to Members');
      navigate('/ERP/UserManagement/Members', { replace: true });
    } else {
      // No access - stay on dashboard and load counts
      loadCounts();
    }
  }, [currentUser, navigate, toast]);

  const loadCounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 [UserManagementDashboard] Loading counts...');
      
      const countsData = await DashboardService.getCounts();
      console.log('✅ [UserManagementDashboard] Counts loaded:', countsData);
      setCounts(countsData);
    } catch (error: any) {
      console.error('❌ [UserManagementDashboard] Error loading counts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải dữ liệu dashboard';
      setError(errorMessage);
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive"
      });
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
      title: 'Vai Trò',
      icon: Shield,
      path: '/ERP/UserManagement/Roles',
      stats: counts.roles.toString(),
      color: 'text-purple-600'
    }
  ];

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Người Dùng</h1>
          <p className="text-gray-600">Chọn tính năng bạn muốn sử dụng</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-700">Lỗi tải dữ liệu</h3>
                <p className="text-gray-600 mt-2">{error}</p>
              </div>
              <Button onClick={loadCounts} variant="outline">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Người Dùng</h1>
        <p className="text-gray-600">
          Chọn tính năng bạn muốn sử dụng
        </p>
      </div>

      {/* Features Grid - 1x2 layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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

      {/* Debug Info - chỉ hiện trong development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">
              <div className="font-medium mb-2">Debug Info:</div>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify({ counts, isLoading, error }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
