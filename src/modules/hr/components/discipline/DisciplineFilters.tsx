import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { DisciplineFilters } from '../../types/benefits';

interface DisciplineFiltersProps {
  filters: DisciplineFilters;
  onFiltersChange: (filters: DisciplineFilters) => void;
}

export function DisciplineFilters({ filters, onFiltersChange }: DisciplineFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã, nhân viên..."
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
          <SelectValue placeholder="Loại vi phạm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="late">Đi Trễ</SelectItem>
          <SelectItem value="absent">Vắng Mặt</SelectItem>
          <SelectItem value="policy-violation">Vi Phạm Quy Định</SelectItem>
          <SelectItem value="misconduct">Hành Vi Sai Trái</SelectItem>
          <SelectItem value="other">Khác</SelectItem>
        </SelectContent>
      </Select>

      {/* Severity Filter */}
      <Select
        value={filters.severity || 'all'}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, severity: value === 'all' ? undefined : value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Mức độ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả mức độ</SelectItem>
          <SelectItem value="warning">Nhắc Nhở</SelectItem>
          <SelectItem value="minor">Nhẹ</SelectItem>
          <SelectItem value="major">Nghiêm Trọng</SelectItem>
          <SelectItem value="critical">Cực Kỳ Nghiêm Trọng</SelectItem>
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
          <SelectItem value="pending">Chờ Xử Lý</SelectItem>
          <SelectItem value="reviewed">Đã Xem Xét</SelectItem>
          <SelectItem value="resolved">Đã Xử Lý</SelectItem>
          <SelectItem value="appealed">Đang Khiếu Nại</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
