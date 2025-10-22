import { X } from 'lucide-react';
import { useLensFilters } from '../../hooks/useLensFilters';
import { Badge } from '@/components/ui/badge';

export function QuickTags() {
  const { filters, updateFilter, hasActiveFilters } = useLensFilters();

  if (!hasActiveFilters) return null;

  const tags: Array<{ label: string; onRemove: () => void }> = [];

  if (filters.material) {
    tags.push({
      label: `Chất liệu: ${filters.material}`,
      onRemove: () => updateFilter('material', null),
    });
  }

  if (filters.refractiveIndex) {
    tags.push({
      label: `Chiết suất: ${filters.refractiveIndex}`,
      onRemove: () => updateFilter('refractiveIndex', null),
    });
  }

  if (filters.origin) {
    tags.push({
      label: `Xuất xứ: ${filters.origin}`,
      onRemove: () => updateFilter('origin', null),
    });
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const min = filters.minPrice ? `${filters.minPrice / 1000}k` : '0';
    const max = filters.maxPrice ? `${filters.maxPrice / 1000}k` : '∞';
    tags.push({
      label: `Giá: ${min} - ${max}`,
      onRemove: () => {
        updateFilter('minPrice', null);
        updateFilter('maxPrice', null);
      },
    });
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag, i) => (
        <Badge key={i} variant="secondary" className="gap-1 pr-1">
          {tag.label}
          <button
            onClick={tag.onRemove}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
