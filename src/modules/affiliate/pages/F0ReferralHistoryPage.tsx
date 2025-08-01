
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Calendar,
  Download
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-states';

export function F0ReferralHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lịch Sử Giới Thiệu</h1>
          <p className="text-muted-foreground mt-2">Theo dõi tình trạng các lượt giới thiệu của bạn</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Xuất File
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nhập số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="used">Đã sử dụng</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thời gian</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="theme-bg-primary text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-white/80">Tổng Giới Thiệu</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-white/80">Chờ Xử Lý</div>
          </CardContent>
        </Card>
        <Card className="bg-green-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-white/80">Đã Sử Dụng</div>
          </CardContent>
        </Card>
        <Card className="bg-red-500 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-white/80">Hết Hạn</div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Giới Thiệu</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Chưa có lịch sử giới thiệu"
            description="Khi bạn giới thiệu khách hàng, thông tin sẽ hiển thị ở đây"
            action={{
              label: "Giới Thiệu Ngay",
              onClick: () => window.location.href = "/ERP/Affiliate/f0-referral"
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
