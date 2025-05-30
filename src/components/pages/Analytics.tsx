
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Users,
  Receipt,
  DollarSign,
  Percent
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const monthlyData = [
  { month: 'T1', issued: 245, used: 198, expired: 12, revenue: 12250000 },
  { month: 'T2', issued: 289, used: 234, expired: 18, revenue: 14450000 },
  { month: 'T3', issued: 321, used: 267, expired: 15, revenue: 16050000 },
  { month: 'T4', issued: 298, used: 241, expired: 22, revenue: 14900000 },
  { month: 'T5', issued: 356, used: 298, expired: 19, revenue: 17800000 },
  { month: 'T6', issued: 398, used: 334, expired: 24, revenue: 19900000 },
];

const conversionData = [
  { name: 'Tuần 1', rate: 78 },
  { name: 'Tuần 2', rate: 82 },
  { name: 'Tuần 3', rate: 76 },
  { name: 'Tuần 4', rate: 84 },
  { name: 'Tuần 5', rate: 81 },
  { name: 'Tuần 6', rate: 87 },
];

const staffPerformance = [
  { name: 'Nguyễn Văn An', issued: 89, used: 74, conversion: 83 },
  { name: 'Trần Thị Bình', issued: 76, used: 68, conversion: 89 },
  { name: 'Lê Minh Cường', issued: 92, used: 78, conversion: 85 },
  { name: 'Phạm Thị Diệu', issued: 68, used: 59, conversion: 87 },
  { name: 'Vũ Thanh Hải', issued: 84, used: 71, conversion: 85 },
];

const voucherValueData = [
  { name: '100.000đ', value: 145, color: '#8b5cf6' },
  { name: '250.000đ', value: 234, color: '#3b82f6' },
  { name: '500.000đ', value: 189, color: '#10b981' },
  { name: '750.000đ', value: 98, color: '#f59e0b' },
  { name: '1.000.000đ+', value: 67, color: '#ef4444' },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo Cáo Phân Tích</h2>
          <p className="text-gray-600">Thông tin chi tiết về hiệu suất voucher</p>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Tháng Trước</SelectItem>
              <SelectItem value="3months">3 Tháng Trước</SelectItem>
              <SelectItem value="6months">6 Tháng Trước</SelectItem>
              <SelectItem value="1year">Năm Trước</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất File
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng Số Phát Hành</CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1.907</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">+12,5%</span>
              <span className="text-gray-500 ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tỷ Lệ Chuyển Đổi</CardTitle>
            <Percent className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">84,2%</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">+3,2%</span>
              <span className="text-gray-500 ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tác Động Doanh Thu</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">95.350.000đ</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">+18,7%</span>
              <span className="text-gray-500 ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Giá Trị TB Voucher</CardTitle>
            <Receipt className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">501.200đ</div>
            <div className="flex items-center text-sm">
              <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
              <span className="text-red-600">-2,1%</span>
              <span className="text-gray-500 ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Hiệu Suất Theo Tháng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="issued" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="used" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xu Hướng Tỷ Lệ Chuyển Đổi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[70, 90]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ Lệ Chuyển Đổi']} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân Bố Giá Trị Voucher</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={voucherValueData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {voucherValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>So Sánh Hiệu Suất Nhân Viên</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="issued" fill="#3b82f6" name="Đã Phát" />
                <Bar dataKey="used" fill="#10b981" name="Đã Dùng" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Hiệu Suất Chi Tiết Nhân Viên</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nhân Viên</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Voucher Đã Phát</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Voucher Đã Dùng</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Tỷ Lệ Chuyển Đổi</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Hiệu Suất</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {staff.name.split(' ').slice(-1)[0].charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{staff.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">{staff.issued}</td>
                    <td className="text-center py-3 px-4">{staff.used}</td>
                    <td className="text-center py-3 px-4">
                      <Badge 
                        variant={staff.conversion >= 85 ? 'default' : 'secondary'}
                        className={staff.conversion >= 85 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {staff.conversion}%
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        {staff.conversion >= 85 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
