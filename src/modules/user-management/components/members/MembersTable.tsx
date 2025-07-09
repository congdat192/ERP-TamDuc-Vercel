
import React from 'react';
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
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { EnhancedUser } from '../../types';
import { TableLoadingSkeleton } from '@/components/ui/loading';
import { EmptyTableState } from '@/components/ui/empty-states';

interface MembersTableProps {
  users: EnhancedUser[];
  isLoading: boolean;
  selectedUsers: string[];
  onSelectUser: (userId: string, selected: boolean) => void;
  onUserUpdate?: (userId: string, data: any) => void;
  onUserDelete?: (userId: string) => void;
}

export function MembersTable({
  users,
  isLoading,
  selectedUsers,
  onSelectUser,
  onUserUpdate,
  onUserDelete
}: MembersTableProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800", label: "Hoạt Động" },
      inactive: { className: "bg-gray-100 text-gray-800", label: "Không Hoạt Động" },
      locked: { className: "bg-red-100 text-red-800", label: "Bị Khóa" },
      pending_verification: { className: "bg-yellow-100 text-yellow-800", label: "Chờ Xác Thực" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config?.className}>{config?.label || status}</Badge>;
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
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
          <TableHead>Phòng Ban</TableHead>
          <TableHead>Vai Trò</TableHead>
          <TableHead>Trạng Thái</TableHead>
          <TableHead>Lần Đăng Nhập Cuối</TableHead>
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
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {user.department ? (
                <div>
                  <p className="font-medium">{user.department.name}</p>
                  {user.department.description && (
                    <p className="text-sm text-gray-500">{user.department.description}</p>
                  )}
                </div>
              ) : (
                <span className="text-gray-400">Chưa phân công</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{user.role.name}</Badge>
            </TableCell>
            <TableCell>
              {getStatusBadge(user.status)}
            </TableCell>
            <TableCell className="text-sm text-gray-600">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Xem Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUserUpdate?.(user.id, {})}>
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh Sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>
                    <Key className="w-4 h-4 mr-2" />
                    Đặt Lại Mật Khẩu
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {}}
                    className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                  >
                    {user.status === 'active' ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Khóa Tài Khoản
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Mở Khóa
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onUserDelete?.(user.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa Thành Viên
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
