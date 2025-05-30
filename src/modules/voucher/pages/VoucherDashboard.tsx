
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Ticket, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Gift,
  Calendar,
  Target,
  Award
} from 'lucide-react';

export function VoucherDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Module Voucher</h1>
            <p className="text-orange-100">
              Quản lý voucher và chương trình khuyến mãi
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Voucher Hôm Nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0</div>
            <p className="text-sm text-gray-600">Chưa có voucher nào được phát hành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Tỷ Lệ Sử Dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-</div>
            <p className="text-sm text-gray-600">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Khách Hàng Mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-sm text-gray-600">Khách hàng tiếp cận hôm nay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Hiệu Suất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">-</div>
            <p className="text-sm text-gray-600">Đánh giá tổng thể</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State Notice */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Trạng Thái Module Voucher</h3>
              <p className="text-sm text-gray-600 mt-1">
                Module voucher đã được khởi tạo thành công. Hệ thống sẵn sàng để phát hành 
                và quản lý voucher. Tất cả các tính năng đã được thiết kế với giao diện 
                hoàn chỉnh và chờ tích hợp dữ liệu thực tế.
              </p>
              <Badge variant="secondary" className="mt-2">
                Sẵn Sàng Hoạt Động
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
