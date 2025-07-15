
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MembersTable } from './MembersTable';
import { MemberFilters } from './MemberFilters';
import { BulkOperations } from './BulkOperations';
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
      {/* Filters Bar */}
      <Card>
        <CardContent className="p-6">
          <MemberFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
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
    </div>
  );
}
