import { useLensFilters } from '../../hooks/useLensFilters';
import { LensProductAttribute } from '../../types/lens';
import { cn } from '@/lib/utils';

interface AttributeFilterChipsProps {
  attributes: LensProductAttribute[];
}

export function AttributeFilterChips({ attributes }: AttributeFilterChipsProps) {
  const { filters, toggleAttributeOption } = useLensFilters();

  // Show both select and multiselect attributes as chips
  // Users can multi-select for filtering even on select-type attributes
  const chipAttributes = attributes.filter(
    attr => attr.is_active && attr.options?.length > 0
  );

  if (chipAttributes.length === 0) return null;

  return (
    <div className="px-4 py-3 overflow-x-auto border-t">
      <div className="space-y-4">
        {chipAttributes.map((attribute) => {
          const selectedOptions = filters.attributeFilters[attribute.slug] || [];
          
          return (
            <div key={attribute.id} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {attribute.name}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {attribute.options.map((option: string) => {
                  const isActive = selectedOptions.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleAttributeOption(attribute.slug, option)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap',
                        isActive
                          ? 'bg-green-50 border-green-600 text-green-700 shadow-sm'
                          : 'bg-background border-border hover:bg-accent'
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
