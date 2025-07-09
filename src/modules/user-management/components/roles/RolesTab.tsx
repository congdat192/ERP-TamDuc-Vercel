
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-states';
import { Shield } from 'lucide-react';

export function RolesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản Lý Vai Trò</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState 
          icon={Shield}
          title="Chức năng đang phát triển"
          description="Tab Vai Trò sẽ được triển khai trong giai đoạn tiếp theo"
        />
      </CardContent>
    </Card>
  );
}
