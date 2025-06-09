
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Award,
  TrendingUp,
  Star,
  Target,
  AlertCircle
} from 'lucide-react';

export function VoucherLeaderboard() {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold theme-text flex items-center justify-center space-x-3">
          <Trophy className="w-8 h-8 theme-text-secondary" />
          <span>Bảng Xếp Hạng Telesales</span>
        </h2>
        <p className="theme-text-muted">Theo dõi hiệu suất và chúc mừng những thành tích xuất sắc</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3 voucher-accent-bg">
            <TabsTrigger 
              value="daily" 
              className="data-[state=active]:voucher-button-primary data-[state=active]:text-white"
            >
              Hàng Ngày
            </TabsTrigger>
            <TabsTrigger 
              value="weekly" 
              className="data-[state=active]:voucher-button-primary data-[state=active]:text-white"
            >
              Hàng Tuần
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              className="data-[state=active]:voucher-button-primary data-[state=active]:text-white"
            >
              Hàng Tháng
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Empty Leaderboard */}
          <Card className="voucher-card">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 theme-bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 theme-text-primary" />
                </div>
                <h3 className="text-lg font-medium theme-text mb-2">
                  Bảng Xếp Hạng Chưa Có Dữ Liệu
                </h3>
                <p className="theme-text-muted mb-4">
                  Bảng xếp hạng sẽ hiển thị khi nhân viên bắt đầu phát hành voucher.
                </p>
                <Badge className="theme-badge-secondary text-sm">
                  Sẵn Sàng Theo Dõi Hiệu Suất
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Placeholder */}
          <Card className="voucher-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 theme-text">
                <Star className="w-5 h-5 theme-text-primary" />
                <span>Thành Tích</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="theme-bg-secondary/10 theme-border-secondary/20 border rounded-lg p-4 text-center">
                  <Trophy className="w-8 h-8 theme-text-secondary mx-auto mb-2" />
                  <h4 className="font-semibold theme-text-secondary">Nhà Vô Địch</h4>
                  <p className="text-sm theme-text-muted">Chưa có người chiến thắng</p>
                </div>
                <div className="voucher-alert-success rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold">Tỷ Lệ Tốt Nhất</h4>
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
                <div className="theme-bg-primary/10 theme-border-primary/20 border rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 theme-text-primary mx-auto mb-2" />
                  <h4 className="font-semibold theme-text-primary">Ngôi Sao Mới</h4>
                  <p className="text-sm theme-text-muted">Chưa có ứng viên</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Notice */}
      <Card className="voucher-card">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 theme-text-primary mt-0.5" />
            <div>
              <h3 className="font-medium theme-text">Trạng Thái Bảng Xếp Hạng</h3>
              <p className="text-sm theme-text-muted mt-1">
                Hệ thống bảng xếp hạng đã được thiết kế hoàn chỉnh với các tính năng 
                theo dõi hiệu suất theo ngày, tuần, tháng. Dữ liệu sẽ tự động cập nhật 
                khi nhân viên bắt đầu hoạt động phát hành voucher.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
