
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversalStatCard } from '@/components/ui/UniversalStatCard';
import { Users, ShoppingCart, Package, TrendingUp } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Tổng Quan</h1>
        <p className="text-gray-600">Tổng quan về hoạt động kinh doanh</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UniversalStatCard
          title="Tổng Khách Hàng"
          value="1,234"
          change="+12%"
          icon={Users}
          colorIndex={0}
        />
        <UniversalStatCard
          title="Đơn Hàng"
          value="456"
          change="+8%"
          icon={ShoppingCart}
          colorIndex={1}
        />
        <UniversalStatCard
          title="Sản Phẩm"
          value="789"
          change="+5%"
          icon={Package}
          colorIndex={2}
        />
        <UniversalStatCard
          title="Doanh Thu"
          value="1,234,567,000 ₫"
          change="+15%"
          icon={TrendingUp}
          colorIndex={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt Động Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Đang phát triển...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống Kê</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Đang phát triển...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
