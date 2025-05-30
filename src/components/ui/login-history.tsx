
import { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  Globe,
  Filter,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-states';
import { LoginAttempt } from '@/types/security';

interface LoginHistoryProps {
  attempts: LoginAttempt[];
}

export const LoginHistory = ({ attempts }: LoginHistoryProps) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | '90d'>('30d');

  const getDeviceIcon = (deviceInfo: string) => {
    if (deviceInfo.toLowerCase().includes('iphone') || 
        deviceInfo.toLowerCase().includes('android') ||
        deviceInfo.toLowerCase().includes('mobile')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredAttempts = attempts.filter(attempt => {
    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'success' && !attempt.success) return false;
      if (filterStatus === 'failed' && attempt.success) return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!attempt.ipAddress.includes(searchLower) &&
          !attempt.location.toLowerCase().includes(searchLower) &&
          !attempt.deviceInfo.toLowerCase().includes(searchLower) &&
          !attempt.browser.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      if (attempt.timestamp < cutoff) return false;
    }

    return true;
  });

  const handleExport = () => {
    console.log('Exporting login history...');
    // Mock export functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lịch Sử Đăng Nhập</h2>
          <p className="text-gray-600">
            Theo dõi tất cả các lần thử đăng nhập vào tài khoản
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Xuất Dữ Liệu
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Bộ Lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Tìm Kiếm</Label>
              <Input
                id="search"
                placeholder="IP, địa điểm, thiết bị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Trạng Thái</Label>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả</SelectItem>
                  <SelectItem value="success">Thành Công</SelectItem>
                  <SelectItem value="failed">Thất Bại</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Khoảng Thời Gian</Label>
              <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả</SelectItem>
                  <SelectItem value="7d">7 Ngày Qua</SelectItem>
                  <SelectItem value="30d">30 Ngày Qua</SelectItem>
                  <SelectItem value="90d">90 Ngày Qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setDateRange('30d');
                }}
              >
                Đặt Lại
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Kết Quả ({filteredAttempts.length})
          </CardTitle>
          <CardDescription>
            {filterStatus === 'all' ? 'Tất cả' : 
             filterStatus === 'success' ? 'Thành công' : 'Thất bại'} 
            {' '}các lần thử đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAttempts.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-12 h-12 text-gray-400" />}
              title="Không Có Dữ Liệu"
              description="Không tìm thấy lịch sử đăng nhập phù hợp với bộ lọc."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Người Dùng</TableHead>
                    <TableHead>Thiết Bị</TableHead>
                    <TableHead>Địa Điểm</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Thời Gian</TableHead>
                    <TableHead>Chi Tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell>
                        <Badge variant={attempt.success ? "default" : "destructive"}>
                          {attempt.success ? (
                            <><Check className="w-3 h-3 mr-1" /> Thành Công</>
                          ) : (
                            <><X className="w-3 h-3 mr-1" /> Thất Bại</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {attempt.username}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(attempt.deviceInfo)}
                          <div>
                            <div className="text-sm font-medium">{attempt.deviceInfo}</div>
                            <div className="text-xs text-gray-500">{attempt.browser}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{attempt.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {attempt.ipAddress}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{formatDateTime(attempt.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {!attempt.success && attempt.failureReason && (
                          <Badge variant="outline" className="text-xs">
                            {attempt.failureReason}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
