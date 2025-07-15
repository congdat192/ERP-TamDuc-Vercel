
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { InvitationFilters as IInvitationFilters } from '../../types/invitation';

interface InvitationFiltersProps {
  filters: IInvitationFilters;
  onFiltersChange: (filters: IInvitationFilters) => void;
}

export function InvitationFilters({ filters, onFiltersChange }: InvitationFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      status: value === 'all' ? undefined : [value]
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.status;

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
      <div className="flex-1 max-w-sm">
        <Input
          placeholder="Tìm kiếm theo tên, email..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Select value={filters.status?.[0] || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ phản hồi</SelectItem>
            <SelectItem value="accepted">Đã chấp nhận</SelectItem>
            <SelectItem value="rejected">Đã từ chối</SelectItem>
            <SelectItem value="expired">Đã hết hạn</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>
    </div>
  );
}
