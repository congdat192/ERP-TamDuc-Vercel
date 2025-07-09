
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Mail } from 'lucide-react';
import { MembersTable } from './MembersTable';
import { MemberFilters } from './MemberFilters';
import { BulkOperations } from './BulkOperations';
import { CreateUserModal } from '../modals/CreateUserModal';
import { InviteUserModal } from '../modals/InviteUserModal';
import { UserManagementFilters, EnhancedUser } from '../../types';

interface MembersTabProps {
  users?: EnhancedUser[];
  isLoading?: boolean;
  onUserCreate?: (userData: any) => void;
  onUserUpdate?: (userId: string, userData: any) => void;
  onUserDelete?: (userId: string) => void;
  onBulkOperation?: (operation: any) => void;
  onFiltersChange?: (filters: UserManagementFilters) => void;
}

export function MembersTab({
  users = [],
  isLoading = false,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onBulkOperation,
  onFiltersChange
}: MembersTabProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserManagementFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleFiltersChange = (newFilters: UserManagementFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSelectUser = (userId: string, selected: boolean) => {
    setSelectedUsers(prev => 
      selected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map(user => user.id));
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1">
              <MemberFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                onClick={() => setIsInviteModalOpen(true)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Mời Thành Viên
              </Button>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm Thành Viên
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      {selectedUsers.length > 0 && (
        <BulkOperations
          selectedCount={selectedUsers.length}
          totalCount={users.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkOperation={onBulkOperation}
        />
      )}

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh Sách Thành Viên {users.length > 0 && `(${users.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MembersTable
            users={users}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onUserUpdate={onUserUpdate}
            onUserDelete={onUserDelete}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={onUserCreate}
      />

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSent={onUserCreate}
      />
    </div>
  );
}
