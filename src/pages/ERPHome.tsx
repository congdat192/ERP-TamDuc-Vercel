
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Package, 
  Calculator, 
  UserCheck, 
  Ticket, 
  AlertCircle,
  Megaphone,
  Settings
} from 'lucide-react';
import { User, ERPModule } from '@/types/auth';
import { useAuth } from '@/components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ERPHomeProps {
  currentUser?: User | null;
  onModuleChange?: (module: ERPModule) => void;
}

export function ERPHome({ currentUser: propCurrentUser, onModuleChange: propOnModuleChange }: ERPHomeProps) {
  const { currentUser: authCurrentUser } = useAuth();
  const navigate = useNavigate();
  
  // Use auth context user if prop user is not provided
  const currentUser = propCurrentUser || authCurrentUser;
  
  const handleModuleChange = (module: ERPModule) => {
    if (propOnModuleChange) {
      propOnModuleChange(module);
    } else {
      // Default navigation using react-router
      switch (module) {
        case 'dashboard':
          navigate('/ERP/Dashboard');
          break;
        case 'customers':
          navigate('/ERP/Customers');
          break;
        case 'sales':
          navigate('/ERP/Invoices');
          break;
        case 'inventory':
          navigate('/ERP/Products');
          break;
        case 'marketing':
          navigate('/ERP/Marketing');
          break;
        case 'hr':
          navigate('/ERP/HR');
          break;
        case 'user-management':
          navigate('/ERP/UserManagement');
          break;
        case 'system-settings':
          navigate('/ERP/Setting');
          break;
      }
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const quickActions = [
    {
      title: 'Phát Hành Voucher',
      description: 'Tạo voucher mới cho khách hàng',
      icon: Ticket,
      color: 'berry-warning-light',
      action: () => handleModuleChange('marketing'),
      available: currentUser.permissions.modules.includes('marketing')
    },
    {
      title: 'Quản Lý Khách Hàng',
      description: 'Xem và quản lý thông tin khách hàng',
      icon: Users,
      color: 'berry-primary-light',
      action: () => handleModuleChange('customers'),
      available: currentUser.permissions.modules.includes('customers')
    },
    {
      title: 'Báo Cáo Bán Hàng',
      description: 'Xem báo cáo và thống kê bán hàng',
      icon: TrendingUp,
      color: 'berry-success-light',
      action: () => handleModuleChange('sales'),
      available: currentUser.permissions.modules.includes('sales')
    },
    {
      title: 'Quản Lý Kho',
      description: 'Theo dõi và quản lý hàng tồn kho',
      icon: Package,
      color: 'berry-secondary-light',
      action: () => handleModuleChange('inventory'),
      available: currentUser.permissions.modules.includes('inventory')
    },
    {
      title: 'Marketing',
      description: 'Chiến dịch và phân khúc khách hàng',
      icon: Megaphone,
      color: 'theme-bg-secondary',
      action: () => handleModuleChange('marketing'),
      available: currentUser.permissions.modules.includes('marketing')
    },
    {
      title: 'Nhân Sự',
      description: 'Quản lý hồ sơ và hiệu suất nhân viên',
      icon: Users,
      color: 'theme-bg-secondary',
      action: () => handleModuleChange('hr'),
      available: currentUser.permissions.modules.includes('hr')
    },
    {
      title: 'Quản Trị Hệ Thống',
      description: 'Cấu hình và quản lý người dùng',
      icon: Settings,
      color: 'theme-bg-secondary',
      action: () => handleModuleChange('system-settings'),
      available: currentUser.permissions.modules.includes('system-settings')
    }
  ];

  const availableActions = quickActions.filter(action => action.available);

  return (
    <div className="space-y-6">
      {/* Welcome Header - Updated to use theme gradient */}
      <div className="theme-gradient rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Chào mừng, {currentUser.fullName}!</h1>
            <p className="text-white/90">
              Hệ thống ERP - Quản lý toàn diện doanh nghiệp
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Updated to use theme colors */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao Tác Nhanh</h2>
        {availableActions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không Có Thao Tác Nhanh</h3>
              <p className="text-gray-600">
                Tài khoản của bạn chưa được cấp quyền truy cập các module nào.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* System Status - Updated card colors */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Trạng Thái Hệ Thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Trạng Thái Module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-text-success">
                {currentUser.permissions.modules.length}
              </div>
              <p className="text-sm text-gray-600">Module được phép truy cập</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Vai Trò</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-text-primary">
                {currentUser.role === 'erp-admin' ? 'Admin' : 
                 currentUser.role === 'voucher-admin' ? 'Quản Lý' : 
                 'Nhân Viên'}
              </div>
              <p className="text-sm text-gray-600">Cấp độ truy cập hiện tại</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Kết Nối</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-text-success">Trực Tuyến</div>
              <p className="text-sm text-gray-600">Trạng thái kết nối</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Empty State Notice - Updated icon color */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 theme-text-info mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Lưu Ý Về Dữ Liệu</h3>
              <p className="text-sm text-gray-600 mt-1">
                Hiện tại hệ thống đang ở chế độ demo UI. Tất cả các module và tính năng 
                đã được thiết kế với giao diện hoàn chỉnh nhưng chưa có dữ liệu thực tế. 
                Điều này cho phép kiểm tra luồng navigation và phân quyền mà không cần kết nối database.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
