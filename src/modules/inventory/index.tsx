
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InventoryModuleProps {
  currentUser?: any;
  onBackToModules: () => void;
}

export function InventoryModule({ currentUser, onBackToModules }: InventoryModuleProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Kho Hàng</h1>
        <p className="text-gray-600">Quản lý tồn kho và nhập xuất hàng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kho Hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Module đang được phát triển...</p>
        </CardContent>
      </Card>
    </div>
  );
}
