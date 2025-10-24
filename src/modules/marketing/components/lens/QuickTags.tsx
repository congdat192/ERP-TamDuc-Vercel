import { X } from 'lucide-react';
import { useLensFilters } from '../../hooks/useLensFilters';
import { Badge } from '@/components/ui/badge';

export function QuickTags() {
  const { filters, updateFilter, toggleAttributeValue, hasActiveFilters } = useLensFilters();

  if (!hasActiveFilters) return null;

  const tags: Array<{ label: string; onRemove: () => void }> = [];

  // Attribute filters
  Object.entries(filters.attributeFilters).forEach(([slug, values]) => {
    values.forEach(value => {
      tags.push({
        label: value,
        onRemove: () => toggleAttributeValue(slug, value),
      });
    });
  });

  // Price filter
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
  
  // SPH filter
  if (filters.sph !== undefined) {
    tags.push({
      label: `SPH: ${filters.sph.toFixed(2)}`,
      onRemove: () => updateFilter('sph', undefined),
    });
  }
  
  // CYL filter
  if (filters.cyl !== undefined) {
    tags.push({
      label: `CYL: ${filters.cyl.toFixed(2)}`,
      onRemove: () => updateFilter('cyl', undefined),
    });
  }
  
  // Use Cases filter
  if (filters.useCases && filters.useCases.length > 0) {
    filters.useCases.forEach(useCase => {
      tags.push({
        label: `Nhu cầu: ${useCase}`,
        onRemove: () => {
          const newUseCases = filters.useCases?.filter(uc => uc !== useCase);
          updateFilter('useCases', newUseCases?.length ? newUseCases : undefined);
        },
      });
    });
  }
  
  // Tier filter
  if (filters.availableTiers && filters.availableTiers.length > 0) {
    filters.availableTiers.forEach(tier => {
      const tierLabel = tier === 'IN_STORE' ? 'Có sẵn' : tier === 'NEXT_DAY' ? 'Giao 1 ngày' : tier;
      tags.push({
        label: `Tầng: ${tierLabel}`,
        onRemove: () => {
          const newTiers = filters.availableTiers?.filter(t => t !== tier);
          updateFilter('availableTiers', newTiers?.length ? newTiers as any : undefined);
        },
      });
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
