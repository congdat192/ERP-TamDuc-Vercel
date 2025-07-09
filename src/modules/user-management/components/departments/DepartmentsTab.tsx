
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-states';
import { Building2 } from 'lucide-react';

export function DepartmentsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản Lý Phòng Ban</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState 
          icon={<Building2 className="w-8 h-8 text-gray-400" />}
          title="Chức năng đang phát triển"
          description="Tab Phòng Ban sẽ được triển khai trong giai đoạn tiếp theo"
        />
      </CardContent>
    </Card>
  );
}
