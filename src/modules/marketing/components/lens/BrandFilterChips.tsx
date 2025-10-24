import { X } from 'lucide-react';
import { useLensFilters } from '../../hooks/useLensFilters';
import { LensBrand } from '../../types/lens';
import { cn } from '@/lib/utils';

interface BrandFilterChipsProps {
  brands: LensBrand[];
  actionButtons?: React.ReactNode;
}

export function BrandFilterChips({ brands, actionButtons }: BrandFilterChipsProps) {
  const { filters, toggleAttributeValue } = useLensFilters();

  return (
    <div className="px-4 py-3 border-t">
      <div className="flex items-center gap-4">
        {/* Scrollable brand chips */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
        {brands.map((brand) => {
          const isActive = filters.attributeFilters.lens_brand?.includes(brand.name) || false;
          return (
            <button
              key={brand.id}
              onClick={() => toggleAttributeValue('lens_brand', brand.name)}
              className={cn(
                'relative px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-green-600 border-green-600 text-white shadow-sm pr-8'
                  : 'bg-background border-border hover:bg-accent'
              )}
            >
              {brand.name}
              
              {isActive && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAttributeValue('lens_brand', brand.name);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 hover:bg-red-500 rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-red-400 hover:text-white" />
                </span>
              )}
            </button>
          );
        })}
          </div>
        </div>

        {/* Vertical divider and action buttons */}
        {actionButtons && (
          <>
            <div className="h-8 w-px bg-border flex-shrink-0" />
            
            <div className="flex items-center gap-3 flex-shrink-0">
              {actionButtons}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
