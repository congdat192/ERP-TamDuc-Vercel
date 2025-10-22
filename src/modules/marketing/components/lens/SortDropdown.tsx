import { ArrowUpDown } from 'lucide-react';
import { useLensFilters } from '../../hooks/useLensFilters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SortDropdown() {
  const { filters, updateFilter } = useLensFilters();

  return (
    <Select value={filters.sort} onValueChange={(value: any) => updateFilter('sort', value)}>
      <SelectTrigger className="w-[180px]">
        <ArrowUpDown className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Mới nhất</SelectItem>
        <SelectItem value="popular">Phổ biến</SelectItem>
        <SelectItem value="price-asc">Giá tăng dần</SelectItem>
        <SelectItem value="price-desc">Giá giảm dần</SelectItem>
      </SelectContent>
    </Select>
  );
}
