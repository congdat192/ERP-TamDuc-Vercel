
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Building, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Settings,
  Key,
  UserPlus,
  Lock,
  Unlock
} from 'lucide-react';
import { User } from '@/types/auth';
import { useAuth } from '@/components/auth/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';

interface AccountPermissionsTabProps {
  user: User;
  isOwnProfile?: boolean;
}

export function AccountPermissionsTab({ user, isOwnProfile = true }: AccountPermissionsTabProps) {
  const { currentUser } = useAuth();
  const { currentBusiness } = useBusiness();
  
  const isAdmin = currentUser?.role === 'erp-admin' && !isOwnProfile;

  return (
    <div className="space-y-6">
      {/* Account Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Trạng Thái Tài Khoản</span>
          </CardTitle>
          <CardDescription>
            Thông tin tổng quan về tài khoản và trạng thái xác thực
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Trạng thái tài khoản:</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email xác thực:</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Đã xác thực
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bảo mật 2FA:</span>
                <Badge variant="outline">
                  <XCircle className="w-3 h-3 mr-1" />
                  Chưa kích hoạt
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vai trò hiện tại:</span>
                <Badge variant="secondary">
                  {user.role === 'erp-admin' ? 'Quản Trị ERP' : 'Người Dùng'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Membership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Business Membership</span>
          </CardTitle>
          <CardDescription>
            Danh sách các business/workspace bạn đang tham gia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentBusiness ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{currentBusiness.name}</h4>
                    <p className="text-sm text-gray-500">
                      Tham gia từ: {new Date(currentBusiness.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="default" className="bg-blue-500">
                    {user.role === 'erp-admin' ? 'Admin' : 'Member'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Business chính</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa tham gia business nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Vai Trò & Quyền Hạn</span>
          </CardTitle>
          <CardDescription>
            Chi tiết về vai trò và quyền hạn trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Quyền Truy Cập Module:</h4>
                <div className="space-y-2">
                  {['Dashboard', 'Customers', 'Sales', 'Voucher', 'Inventory', 'Marketing'].map((module) => (
                    <div key={module} className="flex items-center justify-between text-sm">
                      <span>{module}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Có quyền
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quyền Hành Động:</h4>
                <div className="space-y-2">
                  {[
                    { action: 'Xem dữ liệu', granted: true },
                    { action: 'Tạo mới', granted: user.role === 'erp-admin' },
                    { action: 'Chỉnh sửa', granted: user.role === 'erp-admin' },
                    { action: 'Xóa dữ liệu', granted: user.role === 'erp-admin' },
                    { action: 'Quản lý người dùng', granted: user.role === 'erp-admin' },
                    { action: 'Cài đặt hệ thống', granted: user.role === 'erp-admin' }
                  ].map((perm) => (
                    <div key={perm.action} className="flex items-center justify-between text-sm">
                      <span>{perm.action}</span>
                      <Badge 
                        variant="outline" 
                        className={perm.granted ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                      >
                        {perm.granted ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Có quyền
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Không có quyền
                          </>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions Panel (Only for admin viewing other users) */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Thao Tác Quản Trị</span>
            </CardTitle>
            <CardDescription>
              Các thao tác quản trị cho tài khoản này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button variant="outline" size="sm" className="justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Khóa tài khoản
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Unlock className="w-4 h-4 mr-2" />
                Mở khóa
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Key className="w-4 h-4 mr-2" />
                Reset mật khẩu
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Đổi vai trò
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm vào nhóm
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt quyền
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Self-Service Requests (Only for own profile) */}
      {isOwnProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Yêu Cầu Thay Đổi</span>
            </CardTitle>
            <CardDescription>
              Gửi yêu cầu thay đổi quyền hạn hoặc vai trò
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Yêu cầu nâng cấp vai trò
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building className="w-4 h-4 mr-2" />
                Yêu cầu tham gia business khác
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Key className="w-4 h-4 mr-2" />
                Yêu cầu quyền truy cập thêm
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
