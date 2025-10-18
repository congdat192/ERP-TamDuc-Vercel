import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { RewardFilters } from '../../types/benefits';

interface RewardsFiltersProps {
  filters: RewardFilters;
  onFiltersChange: (filters: RewardFilters) => void;
}

export function RewardsFilters({ filters, onFiltersChange }: RewardsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tiêu đề, nhân viên..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      {/* Type Filter */}
      <Select
        value={filters.type || 'all'}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, type: value === 'all' ? undefined : value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Loại khen thưởng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="bonus">Tiền Thưởng</SelectItem>
          <SelectItem value="recognition">Khen Ngợi</SelectItem>
          <SelectItem value="gift">Quà Tặng</SelectItem>
          <SelectItem value="promotion">Thăng Chức</SelectItem>
          <SelectItem value="other">Khác</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status || 'all'}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, status: value === 'all' ? undefined : value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="pending">Chờ Duyệt</SelectItem>
          <SelectItem value="approved">Đã Duyệt</SelectItem>
          <SelectItem value="rejected">Từ Chối</SelectItem>
          <SelectItem value="paid">Đã Trả</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
