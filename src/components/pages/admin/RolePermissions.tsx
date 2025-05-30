
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

const roleData = [
  {
    id: 1,
    name: 'Quản Trị Viên',
    description: 'Quyền truy cập đầy đủ vào tất cả chức năng hệ thống',
    userCount: 3,
    permissions: {
      voucher: { read: true, write: true, delete: true },
      customer: { read: true, write: true, delete: true },
      analytics: { read: true, write: true, delete: false },
      leaderboard: { read: true, write: true, delete: false },
      userManagement: { read: true, write: true, delete: true },
      systemSettings: { read: true, write: true, delete: true },
      auditLog: { read: true, write: false, delete: false },
      rolePermissions: { read: true, write: true, delete: true }
    },
    isSystem: true
  },
  {
    id: 2,
    name: 'Nhân Viên Telesales',
    description: 'Quyền phát hành voucher và quản lý khách hàng cơ bản',
    userCount: 18,
    permissions: {
      voucher: { read: true, write: true, delete: false },
      customer: { read: true, write: true, delete: false },
      analytics: { read: true, write: false, delete: false },
      leaderboard: { read: true, write: false, delete: false },
      userManagement: { read: false, write: false, delete: false },
      systemSettings: { read: false, write: false, delete: false },
      auditLog: { read: false, write: false, delete: false },
      rolePermissions: { read: false, write: false, delete: false }
    },
    isSystem: true
  },
  {
    id: 3,
    name: 'Trưởng Nhóm Telesales',
    description: 'Quyền quản lý nhóm và xem báo cáo chi tiết',
    userCount: 3,
    permissions: {
      voucher: { read: true, write: true, delete: true },
      customer: { read: true, write: true, delete: true },
      analytics: { read: true, write: true, delete: false },
      leaderboard: { read: true, write: true, delete: false },
      userManagement: { read: true, write: false, delete: false },
      systemSettings: { read: true, write: false, delete: false },
      auditLog: { read: true, write: false, delete: false },
      rolePermissions: { read: true, write: false, delete: false }
    },
    isSystem: false
  }
];

const permissionLabels = {
  voucher: 'Quản Lý Voucher',
  customer: 'Quản Lý Khách Hàng',
  analytics: 'Báo Cáo Phân Tích',
  leaderboard: 'Bảng Xếp Hạng',
  userManagement: 'Quản Lý Người Dùng',
  systemSettings: 'Cài Đặt Hệ Thống',
  auditLog: 'Nhật Ký Hoạt Động',
  rolePermissions: 'Phân Quyền'
};

export function RolePermissions() {
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setShowEditDialog(true);
  };

  const getPermissionIcon = (hasPermission: boolean) => {
    return hasPermission ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phân Quyền Vai Trò</h2>
          <p className="text-gray-600">Quản lý vai trò và quyền truy cập trong hệ thống</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tạo Vai Trò Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo Vai Trò Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tên vai trò</Label>
                  <Input placeholder="Nhập tên vai trò" />
                </div>
                <div>
                  <Label>Số lượng người dùng</Label>
                  <Input type="number" placeholder="0" disabled />
                </div>
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea placeholder="Mô tả vai trò và trách nhiệm" rows={3} />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Phân Quyền</h4>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{label}</h5>
                      </div>
                      <div className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <Switch id={`${key}-read`} />
                          <Label htmlFor={`${key}-read`} className="text-sm">Xem</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id={`${key}-write`} />
                          <Label htmlFor={`${key}-write`} className="text-sm">Sửa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id={`${key}-delete`} />
                          <Label htmlFor={`${key}-delete`} className="text-sm">Xóa</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1">Tạo Vai Trò</Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng Vai Trò</p>
                <p className="text-2xl font-bold text-gray-900">{roleData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Người Dùng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roleData.reduce((sum, role) => sum + role.userCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quyền Hệ Thống</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {roleData.map((role) => (
          <Card key={role.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-xs">
                      Hệ Thống
                    </Badge>
                  )}
                  <Badge variant="outline">{role.userCount} người</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{role.description}</p>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Quyền Truy Cập:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(role.permissions).map(([key, perms]) => {
                    const hasAnyPermission = perms.read || perms.write || perms.delete;
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {permissionLabels[key as keyof typeof permissionLabels]}
                        </span>
                        <div className="flex items-center space-x-1">
                          {perms.read && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              Xem
                            </Badge>
                          )}
                          {perms.write && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              Sửa
                            </Badge>
                          )}
                          {perms.delete && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              Xóa
                            </Badge>
                          )}
                          {!hasAnyPermission && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              Không
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditRole(role)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh Sửa
                </Button>
                {!role.isSystem && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Vai Trò: {selectedRole?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedRole && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tên vai trò</Label>
                  <Input value={selectedRole.name} disabled={selectedRole.isSystem} />
                </div>
                <div>
                  <Label>Số lượng người dùng</Label>
                  <Input value={selectedRole.userCount} disabled />
                </div>
              </div>
              
              <div>
                <Label>Mô tả</Label>
                <Textarea value={selectedRole.description} rows={3} />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Chi Tiết Phân Quyền</h4>
                <div className="space-y-4">
                  {Object.entries(selectedRole.permissions).map(([key, perms]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">
                          {permissionLabels[key as keyof typeof permissionLabels]}
                        </h5>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={perms.read} 
                            disabled={selectedRole.isSystem}
                          />
                          <Label className="text-sm">Xem</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={perms.write} 
                            disabled={selectedRole.isSystem}
                          />
                          <Label className="text-sm">Thêm/Sửa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={perms.delete} 
                            disabled={selectedRole.isSystem}
                          />
                          <Label className="text-sm">Xóa</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  className="flex-1"
                  disabled={selectedRole.isSystem}
                >
                  Lưu Thay Đổi
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                >
                  Hủy
                </Button>
              </div>
              
              {selectedRole.isSystem && (
                <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                  Vai trò hệ thống không thể chỉnh sửa để đảm bảo tính bảo mật.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
