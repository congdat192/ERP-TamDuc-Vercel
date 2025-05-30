
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Key,
  Lock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const mockRoles = [
  {
    id: 1,
    name: 'Quản Trị Viên',
    description: 'Toàn quyền truy cập hệ thống',
    userCount: 3,
    permissions: {
      dashboard: true,
      issueVoucher: true,
      voucherList: true,
      analytics: true,
      leaderboard: true,
      customerList: true,
      userManagement: true,
      systemSettings: true,
      auditLog: true,
      rolePermissions: true
    }
  },
  {
    id: 2,
    name: 'Nhân Viên Telesales',
    description: 'Nhân viên bán hàng qua điện thoại',
    userCount: 18,
    permissions: {
      dashboard: true,
      issueVoucher: true,
      voucherList: true,
      analytics: true,
      leaderboard: true,
      customerList: true,
      userManagement: false,
      systemSettings: false,
      auditLog: false,
      rolePermissions: false
    }
  },
  {
    id: 3,
    name: 'Trưởng Nhóm',
    description: 'Quản lý nhóm telesales',
    userCount: 2,
    permissions: {
      dashboard: true,
      issueVoucher: true,
      voucherList: true,
      analytics: true,
      leaderboard: true,
      customerList: true,
      userManagement: false,
      systemSettings: false,
      auditLog: true,
      rolePermissions: false
    }
  }
];

const permissionLabels = {
  dashboard: 'Bảng Điều Khiển',
  issueVoucher: 'Phát Hành Voucher',
  voucherList: 'Danh Sách Voucher',
  analytics: 'Báo Cáo Phân Tích',
  leaderboard: 'Bảng Xếp Hạng',
  customerList: 'Danh Sách Khách Hàng',
  userManagement: 'Quản Lý Người Dùng',
  systemSettings: 'Cài Đặt Hệ Thống',
  auditLog: 'Nhật Ký Hoạt Động',
  rolePermissions: 'Phân Quyền'
};

export function RolePermissions() {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(mockRoles[0]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phân Quyền & Vai Trò</h2>
          <p className="text-gray-600">Quản lý vai trò và phân quyền truy cập các chức năng hệ thống</p>
        </div>
        
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Tạo Vai Trò Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo Vai Trò Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tên vai trò</Label>
                <Input placeholder="VD: Nhân viên kỹ thuật" />
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Input placeholder="Mô tả chi tiết về vai trò" />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1">Tạo Vai Trò</Button>
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Quản Lý Vai Trò</TabsTrigger>
          <TabsTrigger value="permissions">Ma Trận Phân Quyền</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng Vai Trò</p>
                    <p className="text-2xl font-bold text-gray-900">{mockRoles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Người Dùng Được Phân Quyền</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockRoles.reduce((total, role) => total + role.userCount, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Key className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quyền Khả Dụng</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Object.keys(permissionLabels).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Vai Trò</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vai Trò</TableHead>
                    <TableHead>Số Người Dùng</TableHead>
                    <TableHead>Quyền Được Cấp</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRoles.map((role) => {
                    const grantedPermissions = Object.values(role.permissions).filter(p => p).length;
                    const totalPermissions = Object.keys(role.permissions).length;
                    
                    return (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{role.name}</p>
                            <p className="text-sm text-gray-500">{role.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            <Users className="w-3 h-3 mr-1" />
                            {role.userCount} người
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(grantedPermissions / totalPermissions) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {grantedPermissions}/{totalPermissions}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedRole(role)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Role Permission Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Chỉnh Sửa Quyền - {selectedRole.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {selectedRole.permissions[key as keyof typeof selectedRole.permissions] ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-gray-500">
                          {key === 'dashboard' && 'Truy cập bảng điều khiển chính'}
                          {key === 'issueVoucher' && 'Phát hành voucher cho khách hàng'}
                          {key === 'voucherList' && 'Xem và quản lý danh sách voucher'}
                          {key === 'analytics' && 'Truy cập báo cáo và phân tích'}
                          {key === 'leaderboard' && 'Xem bảng xếp hạng nhân viên'}
                          {key === 'customerList' && 'Quản lý thông tin khách hàng'}
                          {key === 'userManagement' && 'Quản lý tài khoản người dùng'}
                          {key === 'systemSettings' && 'Cấu hình hệ thống'}
                          {key === 'auditLog' && 'Xem nhật ký hoạt động'}
                          {key === 'rolePermissions' && 'Quản lý vai trò và phân quyền'}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={selectedRole.permissions[key as keyof typeof selectedRole.permissions]}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline">Hủy Thay Đổi</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Lưu Phân Quyền
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {/* Permission Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Ma Trận Phân Quyền</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-3 border-b font-medium">Chức Năng</th>
                      {mockRoles.map(role => (
                        <th key={role.id} className="text-center p-3 border-b font-medium min-w-32">
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <tr key={key} className="border-b">
                        <td className="p-3 font-medium">{label}</td>
                        {mockRoles.map(role => (
                          <td key={role.id} className="p-3 text-center">
                            {role.permissions[key as keyof typeof role.permissions] ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
