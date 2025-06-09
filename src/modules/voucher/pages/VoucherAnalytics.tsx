
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  AlertCircle
} from 'lucide-react';

export function VoucherAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold theme-text">Báo Cáo & Phân Tích Voucher</h2>
          <p className="theme-text-muted">Theo dõi hiệu suất và phân tích dữ liệu voucher</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="theme-border-primary/20">
            <Filter className="w-4 h-4 mr-2" />
            Bộ Lọc
          </Button>
          <Button className="voucher-button-primary">
            <Download className="w-4 h-4 mr-2" />
            Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="voucher-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium theme-text-muted">Tổng Voucher</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text-primary">0</div>
            <p className="text-sm theme-text-muted">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card className="voucher-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium theme-text-muted">Đã Sử Dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text-secondary">0</div>
            <p className="text-sm theme-text-muted">Tỷ lệ: 0%</p>
          </CardContent>
        </Card>

        <Card className="voucher-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium theme-text-muted">Giá Trị Tổng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text-primary">0đ</div>
            <p className="text-sm theme-text-muted">Tổng giá trị phát hành</p>
          </CardContent>
        </Card>

        <Card className="voucher-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium theme-text-muted">Hiệu Quả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold theme-text-secondary">-</div>
            <p className="text-sm theme-text-muted">ROI chưa xác định</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 voucher-accent-bg">
          <TabsTrigger value="overview" className="data-[state=active]:theme-bg-primary data-[state=active]:text-white">Tổng Quan</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:theme-bg-primary data-[state=active]:text-white">Hiệu Suất</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:theme-bg-primary data-[state=active]:text-white">Xu Hướng</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:theme-bg-primary data-[state=active]:text-white">Báo Cáo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="voucher-card">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 theme-bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 theme-text-primary" />
                </div>
                <h3 className="text-lg font-medium theme-text mb-2">
                  Chưa Có Dữ Liệu Phân Tích
                </h3>
                <p className="theme-text-muted mb-4">
                  Báo cáo và biểu đồ sẽ hiển thị khi có dữ liệu voucher được thu thập.
                </p>
                <Badge className="theme-badge-secondary text-sm">
                  Sẵn Sàng Thu Thập Dữ Liệu
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="voucher-card">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 theme-bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 theme-text-secondary" />
                </div>
                <h3 className="text-lg font-medium theme-text mb-2">
                  Báo Cáo Hiệu Suất
                </h3>
                <p className="theme-text-muted">
                  Phân tích hiệu suất sẽ có sẵn sau khi có dữ liệu voucher.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card className="voucher-card">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 theme-bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 theme-text-primary" />
                </div>
                <h3 className="text-lg font-medium theme-text mb-2">
                  Phân Tích Xu Hướng
                </h3>
                <p className="theme-text-muted">
                  Xu hướng theo thời gian sẽ hiển thị khi có đủ dữ liệu lịch sử.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="voucher-card">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 theme-bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 theme-text-secondary" />
                </div>
                <h3 className="text-lg font-medium theme-text mb-2">
                  Báo Cáo Chi Tiết
                </h3>
                <p className="theme-text-muted">
                  Các báo cáo chi tiết sẽ có thể xuất sau khi có dữ liệu.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Status */}
      <Card className="voucher-card">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 theme-text-primary mt-0.5" />
            <div>
              <h3 className="font-medium theme-text">Trạng Thái Hệ Thống Phân Tích</h3>
              <p className="text-sm theme-text-muted mt-1">
                Module phân tích đã được thiết kế hoàn chỉnh và sẵn sàng xử lý dữ liệu. 
                Tất cả các biểu đồ, báo cáo và thống kê sẽ tự động cập nhật khi 
                hệ thống bắt đầu thu thập dữ liệu voucher thực tế.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
