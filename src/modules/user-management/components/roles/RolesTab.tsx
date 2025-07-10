
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-states';
import { Shield, Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { CustomRole, RoleFilters } from '../../types/role-management';
import { RoleService } from '../../services/roleService';
import { CreateRoleModal } from './CreateRoleModal';
import { useToast } from '@/hooks/use-toast';

export function RolesTab() {
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<RoleFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const rolesData = await RoleService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error loading roles:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách vai trò",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async (newRole: CustomRole) => {
    setRoles(prev => [...prev, newRole]);
    setIsCreateModalOpen(false);
    toast({
      title: "Thành công",
      description: "Tạo vai trò mới thành công"
    });
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await RoleService.deleteRole(roleId);
      setRoles(prev => prev.filter(role => role.id !== roleId));
      toast({
        title: "Thành công", 
        description: "Xóa vai trò thành công"
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa vai trò",
        variant: "destructive"
      });
    }
  };

  const filteredRoles = roles.filter(role => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!role.name.toLowerCase().includes(searchLower) && 
          !role.description?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.isSystem !== undefined && role.isSystem !== filters.isSystem) {
      return false;
    }
    return true;
  });

  const getPermissionCount = (role: CustomRole) => {
    return Object.values(role.permissions).reduce((count, perms) => {
      return count + Object.values(perms).filter(Boolean).length;
    }, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quản Lý Vai Trò</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Quản Lý Vai Trò</span>
            </CardTitle>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo Vai Trò Mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm vai trò..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Roles Table */}
          {filteredRoles.length === 0 ? (
            <EmptyState 
              icon={<Shield className="w-12 h-12 text-gray-400" />}
              title="Chưa có vai trò nào"
              description="Tạo vai trò đầu tiên để bắt đầu quản lý quyền hạn người dùng"
              action={
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Vai Trò Mới
                </Button>
              }
            />
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Vai Trò</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Số Quyền</TableHead>
                    <TableHead>Người Dùng</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="text-right">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-gray-600">{role.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getPermissionCount(role)} quyền
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{role.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.isSystem ? "default" : "outline"}>
                          {role.isSystem ? "Hệ thống" : "Tùy chỉnh"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!role.isSystem && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoleCreated={handleCreateRole}
      />
    </div>
  );
}
