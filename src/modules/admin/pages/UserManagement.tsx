
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export function UserManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản Lý Người Dùng</h1>
            <p className="text-blue-100">
              Quản lý tài khoản và thông tin người dùng
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Module Đang Phát Triển
            </h3>
            <p className="text-gray-600 mb-4">
              Tính năng quản lý người dùng đang được phát triển.
            </p>
            <Badge variant="secondary" className="text-sm">
              Sẵn Sàng Thiết Kế
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
