
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberFilters } from './MemberFilters';
import { MembersTable } from './MembersTable';
import { BulkOperations } from './BulkOperations';
import { UserManagementFilters } from '../../types';

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
  id: number; // Changed to number to match API
  name: string;
  description?: string;
}

interface MembersTabProps {
  users: UIMember[];
  roles?: Role[];
  isLoading: boolean;
  onUserUpdate?: (userId: string, data: any) => void;
  onUserDelete?: (userId: string) => void;
  onUpdateMemberRole?: (memberId: string, roleId: number) => Promise<void>; // Changed roleId to number
  onBulkOperation?: (operation: any) => void;
  onFiltersChange?: (filters: any) => void;
}

export function MembersTab({
  users,
  roles = [],
  isLoading,
  onUserUpdate,
  onUserDelete,
  onUpdateMemberRole,
  onBulkOperation,
  onFiltersChange
}: MembersTabProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserManagementFilters>({});

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản Lý Thành Viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MemberFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange} 
            />
            
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
    </div>
  );
}
