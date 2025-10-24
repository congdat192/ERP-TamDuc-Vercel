import { useLensFilters } from '../../hooks/useLensFilters';
import { LensBrand } from '../../types/lens';
import { cn } from '@/lib/utils';

interface BrandFilterChipsProps {
  brands: LensBrand[];
}

export function BrandFilterChips({ brands }: BrandFilterChipsProps) {
  const { filters, toggleBrand } = useLensFilters();

  return (
    <div className="px-4 py-3 overflow-x-auto border-t">
      <div className="flex gap-2 min-w-max">
        {brands.map((brand) => {
          const isActive = filters.brandIds.includes(brand.id);
          return (
            <button
              key={brand.id}
              onClick={() => toggleBrand(brand.id)}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-green-50 border-green-600 text-green-700 shadow-sm'
                  : 'bg-background border-border hover:bg-accent'
              )}
            >
              {brand.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
