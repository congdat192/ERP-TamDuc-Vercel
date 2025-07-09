import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Receipt, 
  Users, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const dailyData = [
  { name: 'T2', vouchers: 45, used: 32 },
  { name: 'T3', vouchers: 52, used: 38 },
  { name: 'T4', vouchers: 38, used: 28 },
  { name: 'T5', vouchers: 61, used: 45 },
  { name: 'T6', vouchers: 58, used: 42 },
  { name: 'T7', vouchers: 42, used: 35 },
  { name: 'CN', vouchers: 35, used: 28 },
];

const statusData = [
  { name: 'Đang Hoạt Động', value: 1245, color: 'hsl(var(--berry-success-500))' },
  { name: 'Đã Sử Dụng', value: 892, color: 'hsl(var(--voucher-primary-500))' },
  { name: 'Hết Hạn', value: 156, color: 'hsl(var(--berry-error-500))' },
  { name: 'Đã Hủy', value: 43, color: 'hsl(var(--theme-text-muted))' },
];

const recentVouchers = [
  { id: 'VCH001', customer: 'Nguyễn Thị Hoa', phone: '0901234567', value: '500.000đ', status: 'active', time: '2 phút trước' },
  { id: 'VCH002', customer: 'Trần Văn Nam', phone: '0907654321', value: '250.000đ', status: 'used', time: '5 phút trước' },
  { id: 'VCH003', customer: 'Lê Thị Lan', phone: '0909876543', value: '1.000.000đ', status: 'active', time: '8 phút trước' },
  { id: 'VCH004', customer: 'Phạm Minh Tuấn', phone: '0902468135', value: '750.000đ', status: 'active', time: '12 phút trước' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Summary Cards - Updated to use theme colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 theme-border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Voucher Hôm Nay</CardTitle>
            <Receipt className="h-4 w-4 theme-text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">58</div>
            <div className="flex items-center text-sm theme-text-success">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>+12% so với hôm qua</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 theme-border-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Voucher Đã Dùng</CardTitle>
            <TrendingUp className="h-4 w-4 theme-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <div className="flex items-center text-sm theme-text-success">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>Tỷ lệ sử dụng 72%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 berry-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Khách Hàng Mới</CardTitle>
            <Users className="h-4 w-4 theme-text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="flex items-center text-sm theme-text-success">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>+8% tuần này</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 berry-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sắp Hết Hạn</CardTitle>
            <Clock className="h-4 w-4 berry-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="flex items-center text-sm berry-warning">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>Trong 7 ngày tới</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Hoạt Động Voucher Hàng Tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vouchers" fill="hsl(var(--voucher-primary-500))" name="Đã Phát" />
                <Bar dataKey="used" fill="hsl(var(--berry-success-500))" name="Đã Dùng" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Phân Bố Trạng Thái Voucher</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Voucher Gần Đây</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Xem Tất Cả
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVouchers.map((voucher) => (
                <div key={voucher.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-medium">{voucher.id}</span>
                      <Badge 
                        variant={voucher.status === 'active' ? 'default' : 'secondary'}
                        className={voucher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {voucher.status === 'active' ? 'Hoạt động' : 'Đã dùng'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{voucher.customer}</p>
                    <p className="text-xs text-gray-500">{voucher.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{voucher.value}</p>
                    <p className="text-xs text-gray-500">{voucher.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Thông Báo Hệ Thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 border rounded-lg berry-error-light">
                <AlertTriangle className="w-5 h-5 berry-error mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">12 voucher sắp hết hạn</p>
                  <p className="text-xs text-gray-600">Cần xử lý trong 7 ngày tới</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg berry-primary-light">
                <TrendingUp className="w-5 h-5 theme-text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Đạt chỉ tiêu hàng ngày</p>
                  <p className="text-xs text-gray-600">58/50 voucher đã phát hôm nay</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg berry-success-light">
                <Users className="w-5 h-5 theme-text-success mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Kỷ lục khách hàng mới</p>
                  <p className="text-xs text-gray-600">23 khách hàng mới tuần này</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
