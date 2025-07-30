import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, TrendingUp, Users, DollarSign, Gift } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { affiliateService } from '../services/affiliateService';
import * as XLSX from 'xlsx';

export function ReportsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [reportType, setReportType] = useState('overview');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['affiliate-stats'],
    queryFn: affiliateService.getAffiliateStats,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['affiliate-chart-data'],
    queryFn: affiliateService.getChartData,
  });

  // Mock data for additional reports
  const performanceData = [
    { name: 'Nguyễn Văn A', f1Count: 8, commission: 4200000, vouchers: 20 },
    { name: 'Trần Thị B', f1Count: 5, commission: 2500000, vouchers: 12 },
    { name: 'Lê Văn C', f1Count: 3, commission: 1800000, vouchers: 8 },
    { name: 'Phạm Thị D', f1Count: 6, commission: 3100000, vouchers: 15 },
    { name: 'Hoàng Văn E', f1Count: 4, commission: 2200000, vouchers: 10 }
  ];

  const statusDistribution = [
    { name: 'F0 Đã duyệt', value: 124, color: '#00E676' },
    { name: 'F0 Chờ duyệt', value: 32, color: '#FFE57F' },
    { name: 'F0 Từ chối', value: 8, color: '#F44336' }
  ];

  const handleExportReport = (type: 'excel' | 'pdf') => {
    if (type === 'excel') {
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Add overview stats
      const statsData = [
        ['Chỉ số', 'Giá trị'],
        ['Tổng F0', stats?.totalF0Registered || 0],
        ['Tổng F1', stats?.totalF1Invited || 0],
        ['Hoa hồng (VND)', stats?.totalCommissionPaid || 0],
        ['Voucher phát hành', stats?.totalVouchersIssued || 0]
      ];
      const ws = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Tổng quan');

      // Add performance data if selected
      if (reportType === 'performance') {
        const perfData = [
          ['F0', 'Số F1', 'Hoa hồng (VND)', 'Voucher'],
          ...performanceData.map(f0 => [f0.name, f0.f1Count, f0.commission, f0.vouchers])
        ];
        const perfWs = XLSX.utils.aoa_to_sheet(perfData);
        XLSX.utils.book_append_sheet(wb, perfWs, 'Hiệu suất F0');
      }

      // Save file
      XLSX.writeFile(wb, `affiliate-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast({
        title: "Thành công",
        description: "Đã xuất báo cáo Excel",
      });
    } else {
      // PDF export would require additional library like jsPDF
      toast({
        title: "Đang phát triển",
        description: "Tính năng xuất PDF đang được phát triển",
      });
    }
  };

  const handleCustomDateSelect = () => {
    if (customDateRange.from && customDateRange.to) {
      setDateRange('custom');
      // Refetch data with custom date range
      toast({
        title: "Đã cập nhật",
        description: `Báo cáo từ ${format(customDateRange.from, 'dd/MM/yyyy')} đến ${format(customDateRange.to, 'dd/MM/yyyy')}`,
      });
    }
  };

  if (statsLoading || chartLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Báo Cáo/Xuất File</h1>
        <p className="text-muted-foreground">Tạo báo cáo và xuất dữ liệu</p>
      </div>

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cấu hình báo cáo
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleExportReport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Xuất PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Loại báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Tổng quan</SelectItem>
                <SelectItem value="performance">Hiệu suất F0</SelectItem>
                <SelectItem value="commission">Hoa hồng chi tiết</SelectItem>
                <SelectItem value="voucher">Voucher thống kê</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 ngày qua</SelectItem>
                <SelectItem value="30d">30 ngày qua</SelectItem>
                <SelectItem value="90d">3 tháng qua</SelectItem>
                <SelectItem value="1y">1 năm qua</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Chọn ngày tùy chỉnh
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Từ ngày:</label>
                    <Calendar
                      mode="single"
                      selected={customDateRange.from}
                      onSelect={(date) => setCustomDateRange(prev => ({ ...prev, from: date }))}
                      disabled={(date) => date > new Date()}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Đến ngày:</label>
                    <Calendar
                      mode="single"
                      selected={customDateRange.to}
                      onSelect={(date) => setCustomDateRange(prev => ({ ...prev, to: date }))}
                      disabled={(date) => date > new Date() || (customDateRange.from && date < customDateRange.from)}
                    />
                  </div>
                  <Button onClick={handleCustomDateSelect} className="w-full">
                    Áp dụng
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng F0</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalF0Registered}</div>
            <p className="text-xs text-muted-foreground">+{stats?.newF0ThisMonth} tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng F1</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalF1Invited}</div>
            <p className="text-xs text-muted-foreground">+{stats?.newF1ThisMonth} tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoa hồng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((stats?.totalCommissionPaid || 0) / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">VND đã chi trả</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voucher</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVouchersIssued}</div>
            <p className="text-xs text-muted-foreground">Đã phát hành</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts based on report type */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng giới thiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="referrals" stroke="#2196F3" strokeWidth={2} name="Lượt giới thiệu" />
                  <Line type="monotone" dataKey="successful" stroke="#00E676" strokeWidth={2} name="Thành công" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố trạng thái F0</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'performance' && (
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất F0 hàng đầu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="f1Count" fill="#2196F3" name="Số F1" />
                <Bar dataKey="commission" fill="#00E676" name="Hoa hồng (VND)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {reportType === 'commission' && (
        <Card>
          <CardHeader>
            <CardTitle>Hoa hồng theo thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commission" fill="#3FB0AC" name="Hoa hồng (VND)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {reportType === 'voucher' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Voucher được phát hành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((f0, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{f0.name}</div>
                      <div className="text-sm text-muted-foreground">{f0.f1Count} F1</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{f0.vouchers}</div>
                      <div className="text-sm text-muted-foreground">voucher</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tỷ lệ sử dụng voucher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-blue-600">78%</div>
                <div className="text-muted-foreground mt-2">Tỷ lệ voucher được sử dụng</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats?.totalVouchersIssued} voucher được phát hành
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
