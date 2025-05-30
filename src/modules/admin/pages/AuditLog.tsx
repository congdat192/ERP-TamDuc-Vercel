
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export function AuditLog() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nhật Ký Kiểm Toán</h1>
            <p className="text-purple-100">
              Theo dõi và ghi lại tất cả hoạt động hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Module Đang Phát Triển
            </h3>
            <p className="text-gray-600 mb-4">
              Tính năng nhật ký kiểm toán đang được phát triển và sẽ có sẵn trong phiên bản tiếp theo.
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
