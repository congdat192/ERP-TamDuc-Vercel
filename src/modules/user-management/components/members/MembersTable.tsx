
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, 
  Edit, 
  Trash2, 
  EyeOff, 
  Key, 
  MoreHorizontal,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { TableLoadingSkeleton } from '@/components/ui/loading';
import { EmptyTableState } from '@/components/ui/empty-states';
import { EditMemberRoleModal } from '../modals/EditMemberRoleModal';

interface UIMember {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: string;
  isActive: boolean;
  isOwner: boolean;
  createdAt: string;
  lastLogin?: string | null;
  role: { name: string };
  department?: { name: string; description?: string } | null;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface MembersTableProps {
  users: UIMember[];
  isLoading: boolean;
  selectedUsers: string[];
  roles?: Role[];
  onSelectUser: (userId: string, selected: boolean) => void;
  onUserUpdate?: (userId: string, data: any) => void;
  onUserDelete?: (userId: string) => void;
  onUpdateMemberRole?: (memberId: string, roleId: string) => Promise<void>;
}

export function MembersTable({
  users,
  isLoading,
  selectedUsers,
  roles = [],
  onSelectUser,
  onUserUpdate,
  onUserDelete,
  onUpdateMemberRole
}: MembersTableProps) {
  const navigate = useNavigate();
  const [editRoleModal, setEditRoleModal] = useState<{
    isOpen: boolean;
    member: UIMember | null;
  }>({
    isOpen: false,
    member: null
  });

  const getStatusBadge = (status: string, isOwner: boolean) => {
    if (isOwner) {
      return <Badge className="bg-purple-100 text-purple-800">Chủ Sở Hữu</Badge>;
    }
    
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800", label: "Hoạt Động" },
      inactive: { className: "bg-gray-100 text-gray-800", label: "Không Hoạt Động" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config?.className}>{config?.label || status}</Badge>;
  };

  const getRoleBadge = (user: UIMember) => {
    if (user.isOwner) {
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Owner</Badge>;
    }
    
    // Hiển thị vai trò thực tế của user nếu không phải Owner
    return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{user.role.name}</Badge>;
  };

  const handleToggleStatus = (member: UIMember) => {
    if (member.isOwner) return; // Can't change owner status
    
    console.log('🔄 [MembersTable] Toggling status for member:', member.id, 'from', member.isActive ? 'ACTIVE' : 'INACTIVE', 'to', !member.isActive ? 'ACTIVE' : 'INACTIVE');
    
    onUserUpdate?.(member.id, {
      isActive: !member.isActive
    });
  };

  const handleDeleteMember = (member: UIMember) => {
    if (member.isOwner) return; // Can't delete owner
    
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên "${member.fullName}"?`)) {
      onUserDelete?.(member.id);
    }
  };

  const handleEditRole = (member: UIMember) => {
    if (member.isOwner) return; // Can't change owner role
    
    setEditRoleModal({
      isOpen: true,
      member: member
    });
  };

  const handleCloseEditRoleModal = () => {
    setEditRoleModal({
      isOpen: false,
      member: null
    });
  };

  const handleUpdateRole = async (memberId: string, roleId: string) => {
    if (onUpdateMemberRole) {
      await onUpdateMemberRole(memberId, roleId);
    }
  };

  if (isLoading) {
    return <TableLoadingSkeleton />;
  }

  if (users.length === 0) {
    return (
      <EmptyTableState 
        entityName="thành viên"
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedUsers.length === users.length && users.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    users.forEach(user => onSelectUser(user.id, true));
                  } else {
                    users.forEach(user => onSelectUser(user.id, false));
                  }
                }}
              />
            </TableHead>
            <TableHead>Thành Viên</TableHead>
            <TableHead>Vai Trò</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Ngày Tham Gia</TableHead>
            <TableHead className="text-right">Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                  disabled={user.isOwner} // Can't select owner
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getRoleBadge(user)}
              </TableCell>
              <TableCell>
                {getStatusBadge(user.status, user.isOwner)}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {}}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Xem Profile
                    </DropdownMenuItem>
                    {!user.isOwner && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleEditRole(user)}
                          disabled={roles.length === 0}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Edit Vai Trò
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(user)}
                          className={user.isActive ? 'text-red-600' : 'text-green-600'}
                        >
                          {user.isActive ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Vô Hiệu Hóa
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Kích Hoạt
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteMember(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa Thành Viên
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditMemberRoleModal
        isOpen={editRoleModal.isOpen}
        onClose={handleCloseEditRoleModal}
        member={editRoleModal.member}
        roles={roles}
        onUpdateRole={handleUpdateRole}
      />
    </>
  );
}
