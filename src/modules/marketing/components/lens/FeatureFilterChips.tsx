import { X } from 'lucide-react';
import { useLensFilters } from '../../hooks/useLensFilters';
import { cn } from '@/lib/utils';

interface FeatureFilterChipsProps {
  features: any[];
}

export function FeatureFilterChips({ features }: FeatureFilterChipsProps) {
  const { filters, toggleAttributeValue } = useLensFilters();
  
  // Get multiselect attributes and flatten their options (sorted by display_order)
  const multiselectAttrs = features.filter(f => f.type === 'multiselect').sort((a, b) => a.display_order - b.display_order);
  
  const chips: { slug: string; value: string; label: string; icon: string | null }[] = [];
  multiselectAttrs.forEach(attr => {
    (attr.options as string[]).forEach(option => {
      chips.push({
        slug: attr.slug,
        value: option,
        label: option,
        icon: attr.icon,
      });
    });
  });

  return (
    <div className="px-4 py-3 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {chips.map((chip, index) => {
          const isActive = filters.attributeFilters[chip.slug]?.includes(chip.value) || false;
          return (
            <button
              key={`${chip.slug}-${chip.value}-${index}`}
              onClick={() => toggleAttributeValue(chip.slug, chip.value)}
              className={cn(
                'relative px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-green-600 border-green-600 text-white shadow-sm pr-8'
                  : 'bg-background border-border hover:bg-accent'
              )}
            >
              {chip.icon && <span className="mr-1">{chip.icon}</span>}
              {chip.label}
              
              {isActive && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAttributeValue(chip.slug, chip.value);
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
  );
}
