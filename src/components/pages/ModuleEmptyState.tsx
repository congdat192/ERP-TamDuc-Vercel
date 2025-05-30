import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Users, 
  TrendingUp, 
  Calculator, 
  UserCheck, 
  Settings,
  Shield,
  Construction 
} from 'lucide-react';
import { ERPModule } from '@/types/auth';

interface ModuleEmptyStateProps {
  module: ERPModule;
  onBackToDashboard: () => void;
}

const moduleInfo = {
  customers: {
    title: 'Module Khách Hàng',
    description: 'Quản lý thông tin khách hàng, lịch sử mua hàng và chăm sóc khách hàng',
    icon: Users,
    color: 'text-blue-600'
  },
  sales: {
    title: 'Module Bán Hàng',
    description: 'Quản lý đơn hàng, báo giá, hợp đồng và quy trình bán hàng',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  inventory: {
    title: 'Module Kho Hàng',
    description: 'Quản lý tồn kho, nhập xuất hàng và theo dõi hàng hóa',
    icon: Package,
    color: 'text-purple-600'
  },
  accounting: {
    title: 'Module Kế Toán',
    description: 'Quản lý tài chính, kế toán và báo cáo tài chính',
    icon: Calculator,
    color: 'text-yellow-600'
  },
  hr: {
    title: 'Module Nhân Sự',
    description: 'Quản lý nhân viên, chấm công, lương và phúc lợi',
    icon: UserCheck,
    color: 'text-pink-600'
  },
  'system-settings': {
    title: 'Cài Đặt Hệ Thống',
    description: 'Cấu hình hệ thống, tham số và thiết lập toàn cục',
    icon: Settings,
    color: 'text-gray-600'
  },
  'user-management': {
    title: 'Quản Lý Người Dùng',
    description: 'Quản lý tài khoản người dùng, phân quyền và bảo mật',
    icon: Shield,
    color: 'text-red-600'
  }
};

export function ModuleEmptyState({ module, onBackToDashboard }: ModuleEmptyStateProps) {
  const info = moduleInfo[module as keyof typeof moduleInfo];
  
  if (!info) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Module không tồn tại</h2>
        </div>
      </div>
    );
  }

  const Icon = info.icon;

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
            <Icon className={`w-8 h-8 ${info.color}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{info.title}</h1>
            <p className="text-gray-600">{info.description}</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-12 h-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Module Đang Phát Triển
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Module này hiện đang trong quá trình phát triển. Giao diện và tính năng 
            sẽ được hoàn thiện trong các phiên bản tiếp theo.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Tính Năng Sẽ Có</h3>
              <p className="text-sm text-blue-700">
                {info.description}
              </p>
            </div>
            
            <Button onClick={onBackToDashboard}>
              Quay Lại Tổng Quan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
