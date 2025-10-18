import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { BenefitFilters } from '../../types/benefits';

interface BenefitsFiltersProps {
  filters: BenefitFilters;
  onFiltersChange: (filters: BenefitFilters) => void;
}

export function BenefitsFilters({ filters, onFiltersChange }: BenefitsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên, mã phúc lợi..."
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
          <SelectValue placeholder="Loại phúc lợi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="insurance">Bảo Hiểm</SelectItem>
          <SelectItem value="allowance">Phụ Cấp</SelectItem>
          <SelectItem value="bonus">Thưởng</SelectItem>
          <SelectItem value="leave">Nghỉ Phép</SelectItem>
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
          <SelectItem value="active">Hoạt Động</SelectItem>
          <SelectItem value="inactive">Tạm Ngưng</SelectItem>
          <SelectItem value="expired">Hết Hạn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
