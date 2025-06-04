
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Receipt, 
  Package, 
  Ticket, 
  Calculator,
  Settings,
  UserCheck,
  ClipboardList,
  Shield,
  Activity,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Warehouse
} from 'lucide-react';
import { User } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

interface ERPHomeProps {
  currentUser: User;
  onModuleChange?: (module: any) => void; // Made optional
}

export function ERPHome({ currentUser }: ERPHomeProps) {
  const navigate = useNavigate();

  const getAvailableModules = () => {
    const userModules = currentUser.permissions.modules || [];
    
    const allModules = [
      { 
        id: 'customers', 
        name: 'Khách Hàng', 
        description: 'Quản lý thông tin khách hàng và lịch sử giao dịch',
        icon: Users,
        color: 'bg-blue-100 text-blue-700',
        path: '/erp/customers'
      },
      { 
        id: 'sales', 
        name: 'Hóa Đơn', 
        description: 'Quản lý hóa đơn bán hàng và doanh thu',
        icon: Receipt,
        color: 'bg-green-100 text-green-700',
        path: '/erp/sales'
      },
      { 
        id: 'voucher', 
        name: 'Voucher', 
        description: 'Quản lý voucher và chương trình khuyến mãi',
        icon: Ticket,
        color: 'bg-purple-100 text-purple-700',
        path: '/erp/voucher'
      },
      { 
        id: 'inventory', 
        name: 'Kho Hàng', 
        description: 'Quản lý tồn kho và xuất nhập kho',
        icon: Warehouse,
        color: 'bg-orange-100 text-orange-700',
        path: '/erp/warehouse'
      },
      { 
        id: 'accounting', 
        name: 'Kế Toán', 
        description: 'Quản lý tài chính và báo cáo kế toán',
        icon: Calculator,
        color: 'bg-indigo-100 text-indigo-700',
        path: '/erp/accounting'
      }
    ];

    return allModules.filter(module => userModules.includes(module.id as any));
  };

  const getAdminModules = () => {
    const userModules = currentUser.permissions.modules || [];
    
    const adminModules = [
      { 
        id: 'system-settings', 
        name: 'Cài Đặt Hệ Thống', 
        description: 'Cấu hình hệ thống và tham số',
        icon: Settings,
        color: 'bg-gray-100 text-gray-700',
        path: '/erp/admin/settings'
      },
      { 
        id: 'user-management', 
        name: 'Quản Lý Người Dùng', 
        description: 'Quản lý tài khoản và quyền hạn',
        icon: UserCheck,
        color: 'bg-red-100 text-red-700',
        path: '/erp/admin/users'
      },
      { 
        id: 'audit-log', 
        name: 'Nhật Ký Hệ Thống', 
        description: 'Theo dõi hoạt động và bảo mật',
        icon: ClipboardList,
        color: 'bg-yellow-100 text-yellow-700',
        path: '/erp/admin/audit'
      },
      { 
        id: 'role-permissions', 
        name: 'Phân Quyền', 
        description: 'Quản lý vai trò và quyền hạn',
        icon: Shield,
        color: 'bg-pink-100 text-pink-700',
        path: '/erp/admin/roles'
      }
    ];

    return adminModules.filter(module => userModules.includes(module.id as any));
  };

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  const availableModules = getAvailableModules();
  const adminModules = getAdminModules();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Chào mừng, {currentUser.fullName}!
        </h1>
        <p className="text-blue-100 mb-4">
          Hệ thống ERP - Quản lý doanh nghiệp toàn diện
        </p>
        <div className="flex items-center space-x-4">
          <Badge className="bg-white/20 text-white">
            {currentUser.role === 'erp-admin' ? 'Quản Trị ERP' : 
             currentUser.role === 'voucher-admin' ? 'Quản Lý Voucher' :
             currentUser.role === 'telesales' ? 'Nhân Viên Telesales' :
             currentUser.role === 'platform-admin' ? 'Quản Trị Nền Tảng' : 'Người Dùng'}
          </Badge>
          {currentUser.lastLogin && (
            <span className="text-blue-100 text-sm">
              Đăng nhập cuối: {new Date(currentUser.lastLogin).toLocaleString('vi-VN')}
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doanh Thu Tháng</p>
                <p className="text-2xl font-bold">125.5M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đơn Hàng Mới</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Voucher Đã Phát</p>
                <p className="text-2xl font-bold">3,456</p>
              </div>
              <Ticket className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tăng Trưởng</p>
                <p className="text-2xl font-bold">+12.5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Modules */}
      {availableModules.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Module Kinh Doanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      className="w-full"
                      onClick={() => handleModuleClick(module.path)}
                    >
                      Truy Cập Module
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Modules */}
      {adminModules.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Module Quản Trị</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => handleModuleClick(module.path)}
                    >
                      Truy Cập Module
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Platform Admin Access */}
      {currentUser.role === 'platform-admin' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản Trị Nền Tảng</h2>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-red-100 text-red-700 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Platform Admin</CardTitle>
              <CardDescription>Quản lý toàn bộ hệ thống và tenant</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant="destructive"
                className="w-full"
                onClick={() => handleModuleClick('/platform-admin')}
              >
                Truy Cập Platform Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Access Message */}
      {availableModules.length === 0 && adminModules.length === 0 && currentUser.role !== 'platform-admin' && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa Có Quyền Truy Cập</h3>
            <p className="text-gray-600">
              Tài khoản của bạn chưa được cấp quyền truy cập vào các module. 
              Vui lòng liên hệ quản trị viên để được hỗ trợ.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
