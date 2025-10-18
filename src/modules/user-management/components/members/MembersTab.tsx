import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MemberFilters } from './MemberFilters';
import { MembersTable } from './MembersTable';
import { BulkOperations } from './BulkOperations';
import { CreateUserModal } from '../modals/CreateUserModal';
import { UserManagementFilters } from '../../types';
import { UserPlus, RefreshCw } from 'lucide-react';

interface UIMember {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE'; // Simplified: directly use DB status
  isOwner: boolean;
  createdAt: string;
  lastLogin?: string | null;
  role: { name: string };
  department?: { name: string; description?: string } | null;
}

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface MembersTabProps {
  users: UIMember[];
  roles?: Role[];
  isLoading: boolean;
  onUserUpdate?: (userId: string, data: any) => void;
  onUserDelete?: (userId: string) => void;
  onUpdateMemberRole?: (memberId: string, roleId: number) => Promise<void>;
  onBulkOperation?: (operation: any) => void;
  onFiltersChange?: (filters: any) => void;
  onRefreshMembers?: () => Promise<void>;
}

export function MembersTab({
  users,
  roles = [],
  isLoading,
  onUserUpdate,
  onUserDelete,
  onUpdateMemberRole,
  onBulkOperation,
  onFiltersChange,
  onRefreshMembers
}: MembersTabProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserManagementFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleUserCreated = async () => {
    console.log('✅ User created successfully, refreshing list...');
    // Wait for DB commit
    await new Promise(resolve => setTimeout(resolve, 500));
    // Refetch members
    if (onRefreshMembers) {
      await onRefreshMembers();
    }
  };

  const handleSelectUser = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleFiltersChange = (newFilters: UserManagementFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map(user => user.id));
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh Sách Thành Viên</CardTitle>
              <CardDescription>
                Quản lý thông tin và quyền hạn của các thành viên trong hệ thống
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm Thành Viên
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <MemberFilters 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  roles={roles}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('🔄 [MembersTab] Manual refresh triggered');
                  window.location.reload(); // Force full page reload
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm Mới
              </Button>
            </div>
            
            {selectedUsers.length > 0 && (
              <BulkOperations
                selectedCount={selectedUsers.length}
                totalCount={users.length}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onBulkOperation={onBulkOperation}
              />
            )}

            <MembersTable
              users={users}
              roles={roles}
              isLoading={isLoading}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onUserUpdate={onUserUpdate}
              onUserDelete={onUserDelete}
              onUpdateMemberRole={onUpdateMemberRole}
            />
          </div>
        </CardContent>
      </Card>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </>
  );
}
