
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserManagementModuleProps {
  currentUser?: any;
  onBackToModules: () => void;
}

export function UserManagementModule({ currentUser, onBackToModules }: UserManagementModuleProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
        <p className="text-gray-600">Quản lý tài khoản và phân quyền</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quản Lý Người Dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Module đang được phát triển...</p>
        </CardContent>
      </Card>
    </div>
  );
}
