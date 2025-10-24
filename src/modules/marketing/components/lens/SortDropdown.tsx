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
      <SelectTrigger className="w-auto p-2 border-border" title="Sắp xếp">
        <ArrowUpDown className="w-5 h-5 text-blue-600" />
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
