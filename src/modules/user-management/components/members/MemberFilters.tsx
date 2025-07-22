
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
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      status: value === 'all' ? undefined : [value]
    });
  };

  const handleRoleChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      roleIds: value === 'all' ? undefined : [parseInt(value)]
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(
    filters.search || 
    filters.status?.length || 
    filters.roleIds?.length
  );

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
      
      <Select value={filters.status?.[0] || 'all'} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Không hoạt động</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.roleIds?.[0]?.toString() || 'all'} onValueChange={handleRoleChange}>
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
