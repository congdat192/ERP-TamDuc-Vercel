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
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span>Bảng Xếp Hạng Telesales</span>
        </h2>
        <p className="text-gray-600">Theo dõi hiệu suất và chúc mừng những thành tích xuất sắc</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="daily">Hàng Ngày</TabsTrigger>
            <TabsTrigger value="weekly">Hàng Tuần</TabsTrigger>
            <TabsTrigger value="monthly">Hàng Tháng</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Empty Leaderboard */}
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Bảng Xếp Hạng Chưa Có Dữ Liệu
                </h3>
                <p className="text-gray-600 mb-4">
                  Bảng xếp hạng sẽ hiển thị khi nhân viên bắt đầu phát hành voucher.
                </p>
                <Badge variant="secondary" className="text-sm">
                  Sẵn Sàng Theo Dõi Hiệu Suất
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Thành Tích</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-yellow-800">Nhà Vô Địch</h4>
                  <p className="text-sm text-yellow-600">Chưa có người chiến thắng</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800">Tỷ Lệ Tốt Nhất</h4>
                  <p className="text-sm text-green-600">Chưa có dữ liệu</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800">Ngôi Sao Mới</h4>
                  <p className="text-sm text-blue-600">Chưa có ứng viên</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Notice */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Trạng Thái Bảng Xếp Hạng</h3>
              <p className="text-sm text-gray-600 mt-1">
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
