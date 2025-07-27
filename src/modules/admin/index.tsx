
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminModule() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Trị Hệ Thống</h1>
        <p className="text-gray-600">Cài đặt và quản lý hệ thống</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cài Đặt Hệ Thống</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Module đang được phát triển...</p>
        </CardContent>
      </Card>
    </div>
  );
}
