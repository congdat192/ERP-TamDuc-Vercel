import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Shield, 
  Key, 
  Settings,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { User as UserType, UserStatus, UserRole } from '@/types/auth';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800", label: "Hoạt Động", icon: CheckCircle },
      inactive: { className: "bg-gray-100 text-gray-800", label: "Không Hoạt Động", icon: XCircle },
      locked: { className: "bg-red-100 text-red-800", label: "Bị Khóa", icon: XCircle },
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Chờ Xác Thực", icon: Clock },
      pending_verification: { className: "bg-yellow-100 text-yellow-800", label: "Chờ Xác Thực", icon: Clock }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return (
      <Badge className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      'erp-admin': { className: "bg-purple-100 text-purple-800", label: "Quản Trị ERP" },
      'voucher-admin': { className: "bg-blue-100 text-blue-800", label: "Quản Lý Voucher" },
      'telesales': { className: "bg-orange-100 text-orange-800", label: "Telesales" },
      'custom': { className: "bg-gray-100 text-gray-800", label: "Tùy Chỉnh" }
    };
    
    const config = roleConfig[role];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Mock activity data for demonstration
  const mockActivities = [
    {
      id: '1',
      action: 'login',
      description: 'Đăng nhập vào hệ thống',
      timestamp: new Date('2024-05-29T14:30:00'),
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      action: 'voucher_create',
      description: 'Tạo voucher mới #V001234',
      timestamp: new Date('2024-05-29T14:25:00'),
      ipAddress: '192.168.1.100'
    },
    {
      id: '3',
      action: 'profile_update',
      description: 'Cập nhật thông tin cá nhân',
      timestamp: new Date('2024-05-28T16:45:00'),
      ipAddress: '192.168.1.100'
    },
    {
      id: '4',
      action: 'password_change',
      description: 'Thay đổi mật khẩu',
      timestamp: new Date('2024-05-27T09:15:00'),
      ipAddress: '192.168.1.100'
    },
    {
      id: '5',
      action: 'logout',
      description: 'Đăng xuất khỏi hệ thống',
      timestamp: new Date('2024-05-26T18:00:00'),
      ipAddress: '192.168.1.100'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông Tin Chi Tiết Người Dùng</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.fullName}</h3>
                    <p className="text-gray-600">@{user.username}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                    {user.emailVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Email Đã Xác Thực
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Email Chưa Xác Thực
                      </Badge>
                    )}
                    {user.securitySettings.twoFactorEnabled && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        2FA Đã Bật
                      </Badge>
                    )}
                  </div>
                  
                  {user.notes && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">{user.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông Tin Liên Hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    Đăng nhập cuối: {user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Cài Đặt Bảo Mật
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Xác thực 2 yếu tố</span>
                  <Badge className={user.securitySettings.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {user.securitySettings.twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Giới hạn đăng nhập sai</span>
                  <span className="text-sm font-medium">{user.securitySettings.loginAttemptLimit} lần</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Thời gian phiên</span>
                  <span className="text-sm font-medium">{user.securitySettings.sessionTimeoutMinutes} phút</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Yêu cầu đổi MK</span>
                  <Badge className={user.securitySettings.passwordChangeRequired ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                    {user.securitySettings.passwordChangeRequired ? 'Có' : 'Không'}
                  </Badge>
                </div>
                {user.securitySettings.lastPasswordChange && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Đổi MK lần cuối</span>
                    <span className="text-sm">{new Date(user.securitySettings.lastPasswordChange).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Phân Quyền
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Module được phép truy cập:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.modules.map(module => (
                      <Badge key={module} variant="outline" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {user.permissions.voucherFeatures && user.permissions.voucherFeatures.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Tính năng Voucher:</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.voucherFeatures.map(feature => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {user.permissions.canManageUsers && (
                  <Badge className="bg-purple-100 text-purple-800">Quản lý người dùng</Badge>
                )}
                {user.permissions.canViewAllVouchers && (
                  <Badge className="bg-blue-100 text-blue-800">Xem tất cả voucher</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Nhật Ký Hoạt Động (5 gần nhất)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hành Động</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Thời Gian</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {activity.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{activity.description}</TableCell>
                      <TableCell className="text-sm">{activity.timestamp.toLocaleString('vi-VN')}</TableCell>
                      <TableCell className="text-sm">{activity.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
