
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye } from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface SecuritySettingsProps {
  user: UserType;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Tổng Quan Bảo Mật</span>
          </CardTitle>
          <CardDescription>
            Trạng thái bảo mật tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Xác Thực Email</span>
                <Badge variant={user.emailVerified ? "default" : "destructive"}>
                  {user.emailVerified ? "Đã Xác Thực" : "Chưa Xác Thực"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {user.emailVerified ? "Email của bạn đã được xác thực" : "Vui lòng xác thực email"}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Xác Thực 2 Yếu Tố</span>
                <Badge variant={user.securitySettings.twoFactorEnabled ? "default" : "secondary"}>
                  {user.securitySettings.twoFactorEnabled ? "Đã Bật" : "Chưa Bật"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {user.securitySettings.twoFactorEnabled 
                  ? "Tài khoản được bảo vệ bởi 2FA" 
                  : "Bật 2FA để tăng cường bảo mật"
                }
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Trạng Thái Tài Khoản</span>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Hoạt Động" : "Không Hoạt Động"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Tài khoản hiện tại {user.isActive ? "đang hoạt động bình thường" : "bị tạm khóa"}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Giới Hạn Đăng Nhập</span>
                <Badge variant="outline">
                  {user.securitySettings.loginAttemptLimit} Lần
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Tối đa {user.securitySettings.loginAttemptLimit} lần đăng nhập sai
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Phiên Hiện Tại</span>
          </CardTitle>
          <CardDescription>
            Thông tin phiên đăng nhập hiện tại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Đăng Nhập Lần Cuối</h4>
                <p className="text-sm text-gray-600">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleString('vi-VN')
                    : 'Chưa có thông tin'
                  }
                </p>
              </div>
              <Badge variant="default">
                Đang Hoạt Động
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Bảo Mật Mật Khẩu</span>
          </CardTitle>
          <CardDescription>
            Thông tin về mật khẩu và bảo mật
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Yêu Cầu Đổi Mật Khẩu</h4>
                <p className="text-sm text-gray-600">
                  {user.securitySettings.passwordChangeRequired 
                    ? "Bạn cần đổi mật khẩu trong lần đăng nhập tiếp theo"
                    : "Không có yêu cầu đổi mật khẩu"
                  }
                </p>
              </div>
              <Badge variant={user.securitySettings.passwordChangeRequired ? "destructive" : "default"}>
                {user.securitySettings.passwordChangeRequired ? "Bắt Buộc" : "Không Bắt Buộc"}
              </Badge>
            </div>

            {user.securitySettings.lastPasswordChange && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Lần Đổi Mật Khẩu Cuối</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(user.securitySettings.lastPasswordChange).toLocaleString('vi-VN')}
                  </p>
                </div>
                <Badge variant="outline">
                  Đã Cập Nhật
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Quyền Truy Cập</span>
          </CardTitle>
          <CardDescription>
            Các quyền và module mà bạn có thể truy cập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Modules ERP</h4>
              <div className="flex flex-wrap gap-2">
                {user.permissions.modules.map(module => (
                  <Badge key={module} variant="outline" className="capitalize">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Tính Năng Voucher</h4>
              <div className="flex flex-wrap gap-2">
                {user.permissions.voucherFeatures.map(feature => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Quản Lý Người Dùng</span>
                <p className="text-sm text-gray-600">
                  {user.permissions.canManageUsers ? "Có quyền" : "Không có quyền"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Xem Tất Cả Voucher</span>
                <p className="text-sm text-gray-600">
                  {user.permissions.canViewAllVouchers ? "Có quyền" : "Không có quyền"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
