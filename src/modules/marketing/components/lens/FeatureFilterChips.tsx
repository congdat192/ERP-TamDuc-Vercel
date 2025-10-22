import { useLensFilters } from '../../hooks/useLensFilters';

interface FeatureFilterChipsProps {
  features: any[];
}

export function FeatureFilterChips({ features }: FeatureFilterChipsProps) {
  const { filters, toggleFeature } = useLensFilters();
  
  const multiselectAttrs = features.filter(f => f.type === 'multiselect');

  return (
    <div className="px-4 py-3 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {multiselectAttrs.map((feature) => {
          const isActive = filters.featureIds.includes(feature.id);
          return (
            <button
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-green-50 border-green-600 text-green-700 shadow-sm'
                  : 'bg-background border-border hover:bg-accent'
              )}
            >
              {feature.icon && <span className="mr-1">{feature.icon}</span>}
              {feature.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
