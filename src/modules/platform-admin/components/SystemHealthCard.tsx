
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Server, Database, Wifi, HardDrive, ExternalLink } from 'lucide-react';

export function SystemHealthCard() {
  const healthMetrics = [
    { name: 'API Server', status: 'healthy', uptime: 99.9, icon: Server },
    { name: 'Database', status: 'healthy', uptime: 99.8, icon: Database },
    { name: 'CDN/Mạng', status: 'warning', uptime: 98.5, icon: Wifi },
    { name: 'Lưu Trữ', status: 'healthy', uptime: 99.7, icon: HardDrive },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Tốt';
      case 'warning': return 'Cảnh báo';
      case 'error': return 'Lỗi';
      default: return 'Không xác định';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5" />
            <CardTitle>Trạng Thái Hệ Thống</CardTitle>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4 mr-1" />
            Chi Tiết
          </Button>
        </div>
        <CardDescription>
          Giám sát tình trạng các dịch vụ hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.name} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                    <p className="text-xs text-gray-500">Uptime: {metric.uptime}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20">
                    <Progress value={metric.uptime} className="h-2" />
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {getStatusText(metric.status)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-800 font-medium">
              Tất cả hệ thống đang hoạt động bình thường
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
