import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cskhReportService, CSKHReportResponse } from '../../services/cskhReportService';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Award, ShoppingCart, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function CSKHReportTab() {
  const { currentUser } = useAuth();
  const [reportData, setReportData] = useState<CSKHReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromdate: '',
    todate: ''
  });

  useEffect(() => {
    if (currentUser?.phone) {
      loadReport();
    }
  }, [currentUser?.phone]);

  const loadReport = async () => {
    if (!currentUser?.phone) {
      toast.error('Không tìm thấy số điện thoại của bạn');
      return;
    }

    setIsLoading(true);
    try {
      const data = await cskhReportService.getReport({
        creatorphone: currentUser.phone,
        fromdate: filters.fromdate || undefined,
        todate: filters.todate || undefined
      });
      setReportData(data);
      toast.success('Đã tải báo cáo thành công');
    } catch (error: any) {
      console.error('Error loading report:', error);
      toast.error(error.message || 'Không thể tải báo cáo');
    } finally {
      setIsLoading(false);
    }
  };

  const revenueByDayData = useMemo(() => {
    if (!reportData?.list) return [];
    
    const grouped = reportData.list.reduce((acc, item) => {
      const date = item.created_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, revenue: 0 };
      }
      acc[date].revenue += item.revenue;
      return acc;
    }, {} as Record<string, { date: string; revenue: number }>);
    
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [reportData?.list]);

  const customerTypePieData = useMemo(() => {
    if (!reportData?.breakdown) return [];
    return [
      { name: 'Khách mới', value: reportData.breakdown.new_customer.count, color: 'hsl(var(--chart-1))' },
      { name: 'Khách cũ', value: reportData.breakdown.returning_customer.count, color: 'hsl(var(--chart-2))' }
    ];
  }, [reportData?.breakdown]);

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('vi-VN')}đ`;
  };

  if (!currentUser?.phone) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Không tìm thấy số điện thoại của bạn. Vui lòng cập nhật thông tin cá nhân.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bộ lọc thời gian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromdate">Từ ngày</Label>
              <Input
                id="fromdate"
                type="date"
                value={filters.fromdate}
                onChange={(e) => setFilters(prev => ({ ...prev, fromdate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="todate">Đến ngày</Label>
              <Input
                id="todate"
                type="date"
                value={filters.todate}
                onChange={(e) => setFilters(prev => ({ ...prev, todate: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadReport} disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Đang tải...' : 'Áp dụng'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && !reportData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : reportData ? (
        <>
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Doanh Thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(reportData.summary.total_revenue)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Lợi Nhuận</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(reportData.summary.total_profit)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Hoa Hồng</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-1">
                  {formatCurrency(reportData.summary.total_commission)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Số Đơn</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {reportData.summary.orders_count}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-chart-1">Khách Mới</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số lượng:</span>
                  <span className="font-semibold text-foreground">{reportData.breakdown.new_customer.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Doanh thu:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(reportData.breakdown.new_customer.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hoa hồng:</span>
                  <span className="font-semibold text-chart-1">{formatCurrency(reportData.breakdown.new_customer.commission)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-chart-2">Khách Cũ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số lượng:</span>
                  <span className="font-semibold text-foreground">{reportData.breakdown.returning_customer.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Doanh thu:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(reportData.breakdown.returning_customer.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hoa hồng:</span>
                  <span className="font-semibold text-chart-2">{formatCurrency(reportData.breakdown.returning_customer.commission)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue by Day Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh Thu Theo Ngày</CardTitle>
              </CardHeader>
              <CardContent>
                {revenueByDayData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueByDayData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                        name="Doanh thu" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Không có dữ liệu
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Type Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tỉ Lệ Khách Mới vs Khách Cũ</CardTitle>
              </CardHeader>
              <CardContent>
                {customerTypePieData.length > 0 && customerTypePieData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerTypePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        <Cell fill="hsl(var(--chart-1))" />
                        <Cell fill="hsl(var(--chart-2))" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Không có dữ liệu
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
