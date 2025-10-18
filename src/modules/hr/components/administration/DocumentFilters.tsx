import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DocumentFilters, DocType, DocStatus } from '../../types/administration';
import { getDocTypeLabel, getStatusLabel } from '../../types/administration';

interface DocumentFiltersProps {
  filters: DocumentFilters;
  onFilterChange: (filters: DocumentFilters) => void;
}

export function DocumentFiltersComponent({ filters, onFilterChange }: DocumentFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm theo số văn bản hoặc tiêu đề..."
          value={filters.search || ''}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-9"
        />
      </div>

      {/* Doc Type Filter */}
      <Select
        value={filters.doc_type || 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            doc_type: value === 'all' ? undefined : (value as DocType),
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Loại văn bản" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="decision">{getDocTypeLabel('decision')}</SelectItem>
          <SelectItem value="notice">{getDocTypeLabel('notice')}</SelectItem>
          <SelectItem value="contract">{getDocTypeLabel('contract')}</SelectItem>
          <SelectItem value="form">{getDocTypeLabel('form')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status || 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            status: value === 'all' ? undefined : (value as DocStatus),
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="draft">{getStatusLabel('draft')}</SelectItem>
          <SelectItem value="pending">{getStatusLabel('pending')}</SelectItem>
          <SelectItem value="approved">{getStatusLabel('approved')}</SelectItem>
          <SelectItem value="published">{getStatusLabel('published')}</SelectItem>
          <SelectItem value="archived">{getStatusLabel('archived')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
