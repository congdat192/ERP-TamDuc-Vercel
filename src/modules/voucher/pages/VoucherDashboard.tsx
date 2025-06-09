
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Ticket, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Gift,
  Award
} from 'lucide-react';
import { ThemedVoucherStats } from '../components/ThemedVoucherStats';

export function VoucherDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header with Theme Gradient */}
      <div className="voucher-header-gradient rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Module Voucher</h1>
            <p className="text-white/90">
              Quản lý voucher và chương trình khuyến mãi
            </p>
          </div>
        </div>
      </div>

      {/* Themed Stats Component */}
      <ThemedVoucherStats />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="voucher-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium theme-text-muted flex items-center">
              <Ticket className="w-4 h-4 mr-2 theme-text-primary" />
              Voucher Hôm Nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text-primary">0</div>
            <p className="text-sm theme-text-muted">Chưa có voucher nào được phát hành</p>
          </CardContent>
        </Card>

        <Card className="voucher-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium theme-text-muted flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 theme-text-secondary" />
              Tỷ Lệ Sử Dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text-secondary">-</div>
            <p className="text-sm theme-text-muted">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card className="voucher-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium theme-text-muted flex items-center">
              <Users className="w-4 h-4 mr-2 theme-text-primary" />
              Khách Hàng Mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text-primary">0</div>
            <p className="text-sm theme-text-muted">Khách hàng tiếp cận hôm nay</p>
          </CardContent>
        </Card>

        <Card className="voucher-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium theme-text-muted flex items-center">
              <Award className="w-4 h-4 mr-2 theme-text-secondary" />
              Hiệu Suất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text-secondary">-</div>
            <p className="text-sm theme-text-muted">Đánh giá tổng thể</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State Notice */}
      <Card className="voucher-card">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 theme-text-primary mt-0.5" />
            <div>
              <h3 className="font-medium theme-text">Trạng Thái Module Voucher</h3>
              <p className="text-sm theme-text-muted mt-1">
                Module voucher đã được khởi tạo thành công. Hệ thống sẵn sàng để phát hành 
                và quản lý voucher. Tất cả các tính năng đã được thiết kế với giao diện 
                hoàn chỉnh và chờ tích hợp dữ liệu thực tế.
              </p>
              <Badge className="theme-badge-success mt-2">
                Sẵn Sàng Hoạt Động
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
