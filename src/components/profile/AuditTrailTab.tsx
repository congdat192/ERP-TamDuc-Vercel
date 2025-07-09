
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  History, 
  Shield, 
  Key, 
  User, 
  Settings, 
  LogIn,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface AuditTrailTabProps {
  user: UserType;
}

export function AuditTrailTab({ user }: AuditTrailTabProps) {
  return (
    <div className="space-y-6">
      {/* Account Changes History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Lịch Sử Thay Đổi Tài Khoản</span>
          </CardTitle>
          <CardDescription>
            Theo dõi các thay đổi về quyền hạn và cài đặt tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có lịch sử thay đổi nào</p>
            <p className="text-sm">Các thay đổi về tài khoản sẽ được hiển thị tại đây</p>
          </div>
        </CardContent>
      </Card>

      {/* Permission Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Lịch Sử Phân Quyền</span>
          </CardTitle>
          <CardDescription>
            Các thay đổi về vai trò và quyền hạn trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có thay đổi phân quyền nào</p>
            <p className="text-sm">Lịch sử thay đổi vai trò và quyền hạn sẽ hiển thị tại đây</p>
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LogIn className="w-5 h-5" />
            <span>Lịch Sử Đăng Nhập</span>
          </CardTitle>
          <CardDescription>
            Theo dõi các lần đăng nhập và thiết bị truy cập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Đăng nhập hiện tại</p>
                  <p className="text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa xác định'}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-500">
                Đang hoạt động
              </Badge>
            </div>
            
            <div className="text-center py-4 text-gray-500">
              <LogIn className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Lịch sử đăng nhập chi tiết sẽ được hiển thị tại đây</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Sự Kiện Bảo Mật</span>
          </CardTitle>
          <CardDescription>
            Các hoạt động liên quan đến bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có sự kiện bảo mật nào</p>
            <p className="text-sm">Các hoạt động bảo mật sẽ được theo dõi tại đây</p>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Timeline Hoạt Động</span>
          </CardTitle>
          <CardDescription>
            Tổng quan các hoạt động gần đây trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có hoạt động nào được ghi nhận</p>
            <p className="text-sm">Timeline hoạt động sẽ hiển thị khi có dữ liệu</p>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Thông Tin Hệ Thống</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">Ngày tạo tài khoản:</span>
              <p>{new Date(user.createdAt).toLocaleString('vi-VN')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Lần đăng nhập cuối:</span>
              <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa có'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">ID người dùng:</span>
              <p className="font-mono text-xs bg-gray-100 p-1 rounded">{user.id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Vai trò hệ thống:</span>
              <p>{user.role === 'erp-admin' ? 'Quản Trị ERP' : 'Người Dùng'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
