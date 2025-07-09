
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-states';
import { UserCog } from 'lucide-react';

export function GroupsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản Lý Nhóm Người Dùng</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState 
          icon={<UserCog className="w-8 h-8 text-gray-400" />}
          title="Chức năng đang phát triển"
          description="Tab Nhóm Người Dùng sẽ được triển khai trong giai đoạn tiếp theo"
        />
      </CardContent>
    </Card>
  );
}
