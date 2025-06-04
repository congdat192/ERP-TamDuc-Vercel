
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { User } from '@/types/auth';
import { Gift, Users, ShoppingCart, Settings, Warehouse, Calculator } from 'lucide-react';

interface ERPHomeProps {
  currentUser: User;
  onModuleChange?: (module: string) => void; // Made optional for compatibility
}

const erpModules = [
  {
    id: 'voucher',
    name: 'Voucher',
    description: 'Quản lý voucher và chương trình khuyến mãi',
    icon: Gift,
    color: 'from-orange-500 to-red-500',
    href: '/voucher'
  },
  {
    id: 'customer',
    name: 'Khách Hàng',
    description: 'Quản lý thông tin khách hàng',
    icon: Users,
    color: 'from-blue-500 to-purple-500',
    href: '/customer'
  },
  {
    id: 'sales',
    name: 'Hóa Đơn',
    description: 'Quản lý hóa đơn bán hàng',
    icon: ShoppingCart,
    color: 'from-green-500 to-blue-500',
    href: '/sales'
  },
  {
    id: 'warehouse',
    name: 'Kho Hàng',
    description: 'Quản lý kho hàng và tồn kho',
    icon: Warehouse,
    color: 'from-purple-500 to-pink-500',
    href: '/warehouse'
  },
  {
    id: 'accounting',
    name: 'Kế Toán',
    description: 'Quản lý tài chính và kế toán',
    icon: Calculator,
    color: 'from-indigo-500 to-blue-500',
    href: '/accounting'
  },
  {
    id: 'admin',
    name: 'Quản Trị',
    description: 'Cài đặt hệ thống và quản lý người dùng',
    icon: Settings,
    color: 'from-gray-600 to-gray-800',
    href: '/admin/settings'
  }
];

export function ERPHome({ currentUser }: ERPHomeProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  // Filter modules based on user permissions
  const availableModules = erpModules.filter(module => {
    // Check if user has permission to access this module
    switch (module.id) {
      case 'voucher':
        return currentUser.permissions.modules.includes('voucher');
      case 'customer':
        return currentUser.permissions.modules.includes('customers');
      case 'sales':
        return currentUser.permissions.modules.includes('sales');
      case 'warehouse':
        return currentUser.permissions.modules.includes('inventory');
      case 'accounting':
        return currentUser.permissions.modules.includes('accounting');
      case 'admin':
        return currentUser.permissions.modules.includes('system-settings') || 
               currentUser.permissions.modules.includes('user-management');
      default:
        return false;
    }
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {currentUser.fullName}!
        </h1>
        <p className="text-blue-100">
          Chào mừng bạn đến với hệ thống ERP. Chọn một module để bắt đầu làm việc.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Link key={module.id} to={module.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Truy cập module
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng Khách Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-gray-500">+12% so với tháng trước</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hóa Đơn Tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
            <p className="text-xs text-gray-500">+8% so với tháng trước</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Voucher Đã Phát</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,890</div>
            <p className="text-xs text-gray-500">+24% so với tháng trước</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Doanh Thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫45.2M</div>
            <p className="text-xs text-gray-500">+15% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt Động Gần Đây</CardTitle>
          <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Voucher V001234 đã được phát hành</p>
                <p className="text-xs text-gray-500">2 phút trước</p>
              </div>
              <Badge variant="secondary">Voucher</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Khách hàng mới KH001245 được thêm</p>
                <p className="text-xs text-gray-500">15 phút trước</p>
              </div>
              <Badge variant="secondary">Khách Hàng</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Hóa đơn HD001567 đã được tạo</p>
                <p className="text-xs text-gray-500">1 giờ trước</p>
              </div>
              <Badge variant="secondary">Hóa Đơn</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
