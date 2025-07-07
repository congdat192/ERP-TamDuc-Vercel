
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, MapPin, Monitor } from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface ActivityHistoryProps {
  user: UserType;
}

// Mock data for demonstration
const mockActivities = [
  {
    id: '1',
    type: 'login',
    description: 'Đăng nhập thành công',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    ip: '192.168.1.100',
    device: 'Chrome on Windows',
    location: 'Hồ Chí Minh, Việt Nam'
  },
  {
    id: '2',
    type: 'profile_update',
    description: 'Cập nhật thông tin cá nhân',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    ip: '192.168.1.100',
    device: 'Chrome on Windows',
    location: 'Hồ Chí Minh, Việt Nam'
  },
  {
    id: '3',
    type: 'password_change',
    description: 'Đổi mật khẩu thành công',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    ip: '192.168.1.100',
    device: 'Chrome on Windows',
    location: 'Hồ Chí Minh, Việt Nam'
  },
  {
    id: '4',
    type: 'login',
    description: 'Đăng nhập thành công',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    ip: '192.168.1.101',
    device: 'Safari on iPhone',
    location: 'Hà Nội, Việt Nam'
  },
  {
    id: '5',
    type: 'login_failed',
    description: 'Đăng nhập thất bại - Sai mật khẩu',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    ip: '192.168.1.102',
    device: 'Chrome on Android',
    location: 'Đà Nẵng, Việt Nam'
  }
];

export function ActivityHistory({ user }: ActivityHistoryProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
      case 'login_failed':
        return <Monitor className="w-4 h-4" />;
      case 'profile_update':
      case 'password_change':
        return <Activity className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case 'login':
        return 'default' as const;
      case 'login_failed':
        return 'destructive' as const;
      case 'profile_update':
      case 'password_change':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vài phút trước';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Tổng Quan Hoạt Động</span>
          </CardTitle>
          <CardDescription>
            Thống kê hoạt động tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Đăng Nhập Thành Công</h4>
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-blue-600">Trong 30 ngày qua</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Cập Nhật Thông Tin</h4>
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-sm text-green-600">Trong 30 ngày qua</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900">Đăng Nhập Thất Bại</h4>
              <p className="text-2xl font-bold text-red-600">1</p>
              <p className="text-sm text-red-600">Trong 30 ngày qua</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Hoạt Động Gần Đây</span>
          </CardTitle>
          <CardDescription>
            Lịch sử hoạt động của tài khoản trong thời gian gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{activity.description}</h4>
                    <Badge variant={getActivityBadgeVariant(activity.type)}>
                      {activity.type === 'login' ? 'Đăng nhập' :
                       activity.type === 'login_failed' ? 'Thất bại' :
                       activity.type === 'profile_update' ? 'Cập nhật' :
                       activity.type === 'password_change' ? 'Đổi mật khẩu' : 'Khác'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(activity.timestamp)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Monitor className="w-3 h-3" />
                        <span>{activity.device}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>IP: {activity.ip}</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.location}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Dòng Thời Gian Tài Khoản</CardTitle>
          <CardDescription>
            Các sự kiện quan trọng trong lịch sử tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Tài khoản được tạo</h4>
                <p className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
            
            {user.emailVerified && (
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Email được xác thực</h4>
                  <p className="text-sm text-gray-600">
                    Email {user.email} đã được xác thực thành công
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Quyền truy cập được cấp</h4>
                <p className="text-sm text-gray-600">
                  Được cấp quyền truy cập vào {user.permissions.modules.length} modules ERP
                </p>
              </div>
            </div>

            {user.lastLogin && (
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Đăng nhập gần nhất</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(user.lastLogin).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
