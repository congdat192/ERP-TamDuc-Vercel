
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
  { name: 'Đang Hoạt Động', value: 1245, color: '#22c55e' },
  { name: 'Đã Sử Dụng', value: 892, color: '#3b82f6' },
  { name: 'Hết Hạn', value: 156, color: '#ef4444' },
  { name: 'Đã Hủy', value: 43, color: '#6b7280' },
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Voucher Hôm Nay</CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">58</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>+12% so với hôm qua</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Voucher Đã Dùng</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>Tỷ lệ sử dụng 72%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Khách Hàng Mới</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="flex items-center text-sm text-purple-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>+8% tuần này</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sắp Hết Hạn</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="flex items-center text-sm text-orange-600">
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
                <Bar dataKey="vouchers" fill="#3b82f6" name="Đã Phát" />
                <Bar dataKey="used" fill="#22c55e" name="Đã Dùng" />
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
              <div className="flex items-start space-x-3 p-3 border rounded-lg bg-red-50 border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">12 voucher sắp hết hạn</p>
                  <p className="text-xs text-red-600">Cần xử lý trong 7 ngày tới</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Đạt chỉ tiêu hàng ngày</p>
                  <p className="text-xs text-blue-600">58/50 voucher đã phát hôm nay</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg bg-green-50 border-green-200">
                <Users className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Kỷ lục khách hàng mới</p>
                  <p className="text-xs text-green-600">23 khách hàng mới tuần này</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
