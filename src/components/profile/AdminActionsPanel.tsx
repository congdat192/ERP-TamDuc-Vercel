
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
  Mail, 
  UserPlus, 
  UserMinus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User } from '@/types/auth';

interface AdminActionsPanelProps {
  user: User;
  onAction?: (action: string, userId: string) => void;
}

export function AdminActionsPanel({ user, onAction }: AdminActionsPanelProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setIsLoading(action);
    try {
      await onAction?.(action, user.id);
    } finally {
      setIsLoading(null);
    }
  };

  const adminActions = [
    {
      id: 'lock-account',
      label: 'Khóa tài khoản',
      icon: Lock,
      variant: 'destructive' as const,
      description: 'Khóa tài khoản người dùng, ngăn không cho đăng nhập',
      confirmTitle: 'Xác nhận khóa tài khoản',
      confirmDescription: `Bạn có chắc chắn muốn khóa tài khoản của ${user.fullName}? Người dùng sẽ không thể đăng nhập sau khi bị khóa.`
    },
    {
      id: 'unlock-account',
      label: 'Mở khóa tài khoản',
      icon: Unlock,
      variant: 'default' as const,
      description: 'Mở khóa tài khoản đã bị khóa',
      confirmTitle: 'Xác nhận mở khóa tài khoản',
      confirmDescription: `Bạn có chắc chắn muốn mở khóa tài khoản của ${user.fullName}?`
    },
    {
      id: 'reset-password',
      label: 'Reset mật khẩu',
      icon: Key,
      variant: 'outline' as const,
      description: 'Gửi email reset mật khẩu cho người dùng',
      confirmTitle: 'Xác nhận reset mật khẩu',
      confirmDescription: `Email hướng dẫn đặt lại mật khẩu sẽ được gửi đến ${user.email}. Bạn có muốn tiếp tục?`
    },
    {
      id: 'resend-verification',
      label: 'Gửi lại email xác thực',
      icon: Mail,
      variant: 'outline' as const,
      description: 'Gửi lại email xác thực tài khoản',
      confirmTitle: 'Gửi lại email xác thực',
      confirmDescription: `Email xác thực sẽ được gửi lại đến ${user.email}. Bạn có muốn tiếp tục?`
    },
    {
      id: 'change-role',
      label: 'Thay đổi vai trò',
      icon: Shield,
      variant: 'outline' as const,
      description: 'Thay đổi vai trò và quyền hạn của người dùng',
      confirmTitle: 'Thay đổi vai trò',
      confirmDescription: `Bạn sắp thay đổi vai trò của ${user.fullName}. Điều này sẽ ảnh hưởng đến quyền truy cập của họ.`
    },
    {
      id: 'force-logout',
      label: 'Đăng xuất khỏi tất cả thiết bị',
      icon: UserMinus,
      variant: 'outline' as const,
      description: 'Buộc đăng xuất khỏi tất cả phiên đăng nhập',
      confirmTitle: 'Đăng xuất tất cả phiên',
      confirmDescription: `${user.fullName} sẽ bị đăng xuất khỏi tất cả thiết bị và phải đăng nhập lại. Bạn có chắc chắn?`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Thao Tác Quản Trị</span>
        </CardTitle>
        <CardDescription>
          Các thao tác quản trị cho tài khoản {user.fullName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Trạng thái</p>
              <Badge variant="default" className="bg-green-500">Active</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Vai trò</p>
              <Badge variant="secondary">
                {user.role === 'erp-admin' ? 'Admin' : 'User'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-medium">Đăng nhập cuối</p>
              <p className="text-xs text-gray-500">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'Chưa có'}
              </p>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Thao tác nhanh:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {adminActions.map((action) => {
                const Icon = action.icon;
                return (
                  <AlertDialog key={action.id}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={action.variant}
                        size="sm"
                        className="justify-start h-auto p-3"
                        disabled={isLoading === action.id}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        <div className="text-left">
                          <div>{action.label}</div>
                          <div className="text-xs opacity-70">{action.description}</div>
                        </div>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                          <Icon className="w-5 h-5" />
                          <span>{action.confirmTitle}</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {action.confirmDescription}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction(action.id)}>
                          Xác nhận
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                );
              })}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</p>
              <p className="text-xs text-yellow-700">
                Các thao tác này sẽ ảnh hưởng trực tiếp đến tài khoản người dùng. 
                Vui lòng cân nhắc kỹ trước khi thực hiện.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
