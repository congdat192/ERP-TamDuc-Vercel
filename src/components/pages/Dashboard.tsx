
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
  { name: 'Mon', vouchers: 45, used: 32 },
  { name: 'Tue', vouchers: 52, used: 38 },
  { name: 'Wed', vouchers: 38, used: 28 },
  { name: 'Thu', vouchers: 61, used: 45 },
  { name: 'Fri', vouchers: 58, used: 42 },
  { name: 'Sat', vouchers: 42, used: 35 },
  { name: 'Sun', vouchers: 35, used: 28 },
];

const statusData = [
  { name: 'Active', value: 1245, color: '#22c55e' },
  { name: 'Used', value: 892, color: '#3b82f6' },
  { name: 'Expired', value: 156, color: '#ef4444' },
  { name: 'Cancelled', value: 43, color: '#6b7280' },
];

const recentVouchers = [
  { id: 'VCH001', customer: 'Alice Johnson', phone: '+1 (555) 123-4567', value: '$50', status: 'active', time: '2 mins ago' },
  { id: 'VCH002', customer: 'Bob Smith', phone: '+1 (555) 987-6543', value: '$25', status: 'used', time: '5 mins ago' },
  { id: 'VCH003', customer: 'Carol Davis', phone: '+1 (555) 456-7890', value: '$100', status: 'active', time: '8 mins ago' },
  { id: 'VCH004', customer: 'David Wilson', phone: '+1 (555) 321-0987', value: '$75', status: 'active', time: '12 mins ago' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Vouchers</CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">58</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vouchers Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>72% usage rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="flex items-center text-sm text-purple-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>+8% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="flex items-center text-sm text-orange-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>Next 7 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Weekly Voucher Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vouchers" fill="#3b82f6" name="Issued" />
                <Bar dataKey="used" fill="#22c55e" name="Used" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Voucher Status Distribution</CardTitle>
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
            <CardTitle className="text-lg font-semibold">Recent Vouchers</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
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
                        {voucher.status}
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
            <CardTitle className="text-lg font-semibold">System Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 border rounded-lg bg-red-50 border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">12 vouchers expiring soon</p>
                  <p className="text-xs text-red-600">Action required within 7 days</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Daily target achieved</p>
                  <p className="text-xs text-blue-600">58/50 vouchers issued today</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg bg-green-50 border-green-200">
                <Users className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">New customer record</p>
                  <p className="text-xs text-green-600">23 new customers this week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
