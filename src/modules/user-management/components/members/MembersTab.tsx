
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberFilters } from './MemberFilters';
import { MembersTable } from './MembersTable';
import { BulkOperations } from './BulkOperations';

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

interface MembersTabProps {
  users: UIMember[];
  roles?: Role[];
  isLoading: boolean;
  onUserUpdate?: (userId: string, data: any) => void;
  onUserDelete?: (userId: string) => void;
  onUpdateMemberRole?: (memberId: string, roleId: string) => Promise<void>;
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

  const handleSelectUser = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản Lý Thành Viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MemberFilters onFiltersChange={onFiltersChange} />
            
            {selectedUsers.length > 0 && (
              <BulkOperations
                selectedUsers={selectedUsers}
                onBulkOperation={onBulkOperation}
                onClearSelection={() => setSelectedUsers([])}
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
