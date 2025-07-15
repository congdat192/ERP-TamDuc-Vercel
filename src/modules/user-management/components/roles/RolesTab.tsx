
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-states';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Shield, Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { CustomRole, RoleFilters } from '../../types/role-management';
import { RoleService } from '../../services/roleService';
import { CreateRoleModal } from './CreateRoleModal';
import { EditRoleModal } from './EditRoleModal';
import { useToast } from '@/hooks/use-toast';

export function RolesTab() {
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [filters, setFilters] = useState<RoleFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<CustomRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 [RolesTab] Loading roles...');
      const rolesData = await RoleService.getRoles();
      console.log('✅ [RolesTab] Roles loaded:', rolesData);
      setRoles(rolesData);
    } catch (error) {
      console.error('❌ [RolesTab] Error loading roles:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách vai trò",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // FIX: Reload trang để có trải nghiệm tốt hơn
  const reloadRoles = async () => {
    try {
      setIsReloading(true);
      console.log('🔄 [RolesTab] Reloading roles after update...');
      const rolesData = await RoleService.getRoles();
      console.log('✅ [RolesTab] Roles reloaded:', rolesData);
      setRoles(rolesData);
    } catch (error) {
      console.error('❌ [RolesTab] Error reloading roles:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lại danh sách vai trò",
        variant: "destructive"
      });
    } finally {
      setIsReloading(false);
    }
  };

  const handleCreateRole = async (newRole: CustomRole) => {
    // Thêm role mới vào state local trước
    setRoles(prev => [...prev, newRole]);
    setIsCreateModalOpen(false);
    
    // Reload để đảm bảo data consistency
    await reloadRoles();
    
    toast({
      title: "Thành công",
      description: "Tạo vai trò mới thành công"
    });
  };

  const handleEditRole = (role: CustomRole) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  // FIX: Reload trang sau khi update thành công
  const handleRoleUpdated = async (updatedRole: CustomRole) => {
    console.log('✅ [RolesTab] Role updated, reloading page...');
    
    // Update local state trước
    setRoles(prev => prev.map(role => 
      role.id === updatedRole.id ? updatedRole : role
    ));
    
    // Đóng modal
    setIsEditModalOpen(false);
    setSelectedRole(null);
    
    // Reload trang để có data mới nhất
    await reloadRoles();
    
    toast({
      title: "Thành công",
      description: "Cập nhật vai trò thành công"
    });
  };

  const handleDeleteRole = async (role: CustomRole) => {
    setRoleToDelete(role);
  };

  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      setIsDeleting(true);
      console.log('🗑️ [RolesTab] Deleting role:', roleToDelete.id);
      await RoleService.deleteRole(roleToDelete.id);
      
      // Remove from local state
      setRoles(prev => prev.filter(role => role.id !== roleToDelete.id));
      
      // Reload để đảm bảo consistency
      await reloadRoles();
      
      toast({
        title: "Thành công", 
        description: "Xóa vai trò thành công"
      });
    } catch (error: any) {
      console.error('❌ [RolesTab] Error deleting role:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa vai trò",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setRoleToDelete(null);
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
    return Array.isArray(role.permissions) ? role.permissions.length : 0;
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
              {isReloading && <span className="text-sm text-gray-500">(Đang cập nhật...)</span>}
            </CardTitle>
            <Button onClick={() => setIsCreateModalOpen(true)} disabled={isReloading}>
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
                disabled={isReloading}
              />
            </div>
          </div>

          {/* Roles Table */}
          {filteredRoles.length === 0 ? (
            <EmptyState 
              icon={<Shield className="w-12 h-12 text-gray-400" />}
              title="Chưa có vai trò nào"
              description="Tạo vai trò đầu tiên để bắt đầu quản lý quyền hạn người dùng"
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
                    <TableRow key={role.id} className={isReloading ? 'opacity-50' : ''}>
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            disabled={isReloading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!role.isSystem && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteRole(role)}
                              className="text-red-600 hover:text-red-700"
                              disabled={isReloading}
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

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoleCreated={handleCreateRole}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRole(null);
        }}
        role={selectedRole}
        onRoleUpdated={handleRoleUpdated}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vai trò "{roleToDelete?.name}" không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteRole}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
