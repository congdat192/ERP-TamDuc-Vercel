
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesModuleProps {
  currentUser?: any;
  onBackToModules: () => void;
}

export function SalesModule({ currentUser, onBackToModules }: SalesModuleProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Bán Hàng</h1>
        <p className="text-gray-600">Quản lý đơn hàng và quy trình bán hàng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bán Hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Module đang được phát triển...</p>
        </CardContent>
      </Card>
    </div>
  );
}
