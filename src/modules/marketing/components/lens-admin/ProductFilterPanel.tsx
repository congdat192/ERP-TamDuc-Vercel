import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LensProductAttribute } from '../../types/lens';
import { normalizeAttributeOptions } from '../../utils/attributeHelpers';

interface ProductFilterPanelProps {
  attributes: LensProductAttribute[];
  filters: Record<string, string[]>;
  onFilterChange: (slug: string, value: string) => void;
  onClearAll: () => void;
}

export function ProductFilterPanel({
  attributes,
  filters,
  onFilterChange,
  onClearAll,
}: ProductFilterPanelProps) {
  const activeAttributes = attributes
    .filter(attr => attr.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  const totalFilterCount = Object.values(filters).reduce(
    (sum, values) => sum + values.length,
    0
  );

  return (
    <div className="flex items-center gap-3 mb-4 p-4 border rounded-lg bg-muted/30">
      <Filter className="w-5 h-5 text-muted-foreground" />
      <div className="flex-1 flex items-center gap-2 flex-wrap">
        {activeAttributes.map((attr) => {
          const selectedValues = filters[attr.slug] || [];
          const hasSelection = selectedValues.length > 0;
          const normalizedOptions = normalizeAttributeOptions(attr.options);

          return (
            <DropdownMenu key={attr.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={hasSelection ? 'border-primary bg-primary/10' : ''}
                >
                  {attr.name}
                  {hasSelection && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedValues.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>{attr.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {normalizedOptions.map((opt) => (
                  <DropdownMenuCheckboxItem
                    key={opt.value}
                    checked={selectedValues.includes(opt.value)}
                    onCheckedChange={() => onFilterChange(attr.slug, opt.value)}
                  >
                    {opt.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>

      {totalFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          <X className="w-4 h-4 mr-1" />
          Xóa lọc ({totalFilterCount})
        </Button>
      )}
    </div>
  );
}
