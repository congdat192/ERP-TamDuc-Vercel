import { useLensFilters } from '../../hooks/useLensFilters';
import { cn } from '@/lib/utils';

interface FeatureFilterChipsProps {
  features: any[];
}

export function FeatureFilterChips({ features }: FeatureFilterChipsProps) {
  const { filters, toggleAttributeValue } = useLensFilters();
  
  // Get multiselect attributes and flatten their options
  const multiselectAttrs = features.filter(f => f.type === 'multiselect');
  
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
                'px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-green-50 border-green-600 text-green-700 shadow-sm'
                  : 'bg-background border-border hover:bg-accent'
              )}
            >
              {chip.icon && <span className="mr-1">{chip.icon}</span>}
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
