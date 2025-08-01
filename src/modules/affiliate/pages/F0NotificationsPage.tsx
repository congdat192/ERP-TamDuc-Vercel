
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-states';

export function F0NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thông Báo Hệ Thống</h1>
          <p className="text-muted-foreground mt-2">Theo dõi các thông báo quan trọng</p>
        </div>
        <Button variant="outline">
          <CheckCircle className="h-4 w-4 mr-2" />
          Đánh Dấu Tất Cả Đã Đọc
        </Button>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="theme-bg-primary text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-white/80">Chưa Đọc</div>
          </CardContent>
        </Card>
        <Card className="bg-green-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-white/80">Đã Đọc</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-white/80">Tổng Thông Báo</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ Lọc Thông Báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Loại thông báo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="system">Hệ thống</SelectItem>
                  <SelectItem value="referral">Giới thiệu</SelectItem>
                  <SelectItem value="commission">Hoa hồng</SelectItem>
                  <SelectItem value="withdrawal">Rút tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="unread">Chưa đọc</SelectItem>
                  <SelectItem value="read">Đã đọc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Danh Sách Thông Báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Chưa có thông báo nào"
            description="Các thông báo từ hệ thống sẽ xuất hiện ở đây"
          />
        </CardContent>
      </Card>
    </div>
  );
}
