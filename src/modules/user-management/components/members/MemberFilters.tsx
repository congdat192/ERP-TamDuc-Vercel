
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { UserManagementFilters } from '../../types';

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface MemberFiltersProps {
  filters: UserManagementFilters;
  onFiltersChange: (filters: UserManagementFilters) => void;
  roles?: Role[];
}

export function MemberFilters({ filters, onFiltersChange, roles = [] }: MemberFiltersProps) {
  const handleSearchChange = (value: string) => {
    console.log('🔍 [MemberFilters] Search changed:', value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    console.log('📊 [MemberFilters] Status changed:', value);
    const statusValue = value === 'all' ? undefined : [value.toUpperCase()]; // Convert to API format
    onFiltersChange({ 
      ...filters, 
      status: statusValue
    });
  };

  const handleRoleChange = (value: string) => {
    console.log('👤 [MemberFilters] Role changed:', value);
    const roleIds = value === 'all' ? undefined : [parseInt(value)]; // Convert to number array
    onFiltersChange({ 
      ...filters, 
      roleIds: roleIds
    });
  };

  const handleClearFilters = () => {
    console.log('🧹 [MemberFilters] Clearing all filters');
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(
    filters.search || 
    filters.status?.length || 
    filters.roleIds?.length
  );

  // Get current filter values for display
  const currentStatus = filters.status?.[0]?.toLowerCase() || 'all';
  const currentRoleId = filters.roleIds?.[0]?.toString() || 'all';

  console.log('🎛️ [MemberFilters] Current filters:', {
    search: filters.search,
    status: filters.status,
    roleIds: filters.roleIds,
    currentStatus,
    currentRoleId,
    hasActiveFilters
  });

  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm theo tên, email, username..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Không hoạt động</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentRoleId} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo vai trò" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả vai trò</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id.toString()}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Xóa Bộ Lọc</span>
        </Button>
      )}
    </div>
  );
}
