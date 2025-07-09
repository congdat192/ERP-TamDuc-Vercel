
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { User } from '@/types/auth';

interface ActivityHistoryProps {
  user: User;
}

export function ActivityHistory({ user }: ActivityHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Lịch Sử Hoạt Động</span>
        </CardTitle>
        <CardDescription>
          Theo dõi các hoạt động gần đây trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Chưa có hoạt động nào được ghi nhận</p>
          <p className="text-sm">Lịch sử hoạt động sẽ hiển thị khi có dữ liệu từ backend</p>
        </div>
      </CardContent>
    </Card>
  );
}
