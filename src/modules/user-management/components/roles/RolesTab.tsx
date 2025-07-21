

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Shield,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateRoleModal } from './CreateRoleModal';
import { EditRoleModal } from './EditRoleModal';
import { RoleService } from '../../services/roleService';
import { getMembersWithRoles } from '../../services/membersService';
import { CustomRole } from '../../types/role-management';
import { useToast } from '@/hooks/use-toast';
import { TableLoadingSkeleton } from '@/components/ui/loading';
import { EmptyTableState } from '@/components/ui/empty-states';

export function RolesTab() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [roleUserCounts, setRoleUserCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 [RolesTab] Loading roles...');
      
      const rolesData = await RoleService.getRoles();
      console.log('📋 [RolesTab] Roles loaded:', rolesData);
      
      setRoles(rolesData);
      
      // Load user counts for each role
      await loadRoleUserCounts(rolesData);
    } catch (error: any) {
      console.error('❌ [RolesTab] Error loading roles:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải danh sách vai trò",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoleUserCounts = async (rolesData: CustomRole[]) => {
    try {
      console.log('👥 [RolesTab] Loading actual user counts for roles...');
      
      // Fetch all members with their role details
      const membersWithRoles = await getMembersWithRoles();
      
      console.log('📊 [RolesTab] Members with roles:', membersWithRoles);
      
      const userCounts: Record<string, number> = {};
      
      // Initialize all role counts to 0
      rolesData.forEach(role => {
        userCounts[role.id] = 0;
      });
      
      // Count actual members by role
      membersWithRoles.forEach(member => {
        // Only count active, non-owner members
        if (member.status === 'ACTIVE' && !member.is_owner && member.roles) {
          member.roles.forEach(role => {
            // Count this member for this role
            if (userCounts.hasOwnProperty(role.id.toString())) {
              userCounts[role.id.toString()]++;
            }
          });
        }
      });
      
      console.log('📈 [RolesTab] Actual user counts:', userCounts);
      setRoleUserCounts(userCounts);
    } catch (error) {
      console.error('❌ [RolesTab] Error loading role user counts:', error);
      // Set default counts to 0 if we can't load member data
      const defaultCounts: Record<string, number> = {};
      rolesData.forEach(role => {
        defaultCounts[role.id] = 0;
      });
      console.log('🔧 [RolesTab] Using default counts (0) due to error');
      setRoleUserCounts(defaultCounts);
      
      toast({
        title: "Cảnh báo",
        description: "Không thể tải số lượng người dùng cho vai trò",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (role: CustomRole) => {
    const userCount = roleUserCounts[role.id] || 0;
    
    if (userCount > 0) {
      toast({
        title: "Không thể xóa",
        description: `Vai trò "${role.name}" đang được ${userCount} người dùng sử dụng`,
        variant: "destructive",
      });
      return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.name}"?`)) {
      try {
        console.log('🗑️ [RolesTab] Deleting role:', role.id);
        await RoleService.deleteRole(role.id.toString());
        toast({
          title: "Thành công",
          description: "Đã xóa vai trò",
        });
        loadRoles();
      } catch (error: any) {
        console.error('❌ [RolesTab] Error deleting role:', error);
        toast({
          title: "Lỗi",  
          description: error.message || "Không thể xóa vai trò",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (role: CustomRole) => {
    console.log('✏️ [RolesTab] Editing role:', role.id);
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleRoleCreated = () => {
    console.log('✅ [RolesTab] Role created, reloading...');
    loadRoles();
  };

  const handleRoleUpdated = () => {
    console.log('✅ [RolesTab] Role updated, reloading...');
    loadRoles();
    setIsEditModalOpen(false);
    setSelectedRole(null);
  };

  if (isLoading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Quản lý Vai trò</h3>
              <p className="text-sm text-gray-500 mt-1">
                Tạo và quản lý các vai trò với quyền hạn khác nhau
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo Vai Trò
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Danh Sách Vai Trò ({roles.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <EmptyTableState entityName="vai trò" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Vai Trò</TableHead>
                  <TableHead>Mô Tả</TableHead>
                  <TableHead>Quyền Hạn</TableHead>
                  <TableHead>Người Dùng</TableHead>
                  <TableHead>Ngày Tạo</TableHead>
                  <TableHead className="text-right">Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => {
                  const userCount = roleUserCounts[role.id] || 0;
                  return (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {role.description || 'Không có mô tả'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {role.permissions.length} quyền
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            {userCount} người dùng
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(role.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(role)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(role)}
                              className="text-red-600"
                              disabled={userCount > 0}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa {userCount > 0 && `(${userCount} người dùng)`}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoleCreated={handleRoleCreated}
      />

      {/* Edit Role Modal */}
      {selectedRole && (
        <EditRoleModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
          }}
          role={selectedRole}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
    </div>
  );
}
