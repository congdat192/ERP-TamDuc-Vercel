import { X, Filter, ChevronDown } from 'lucide-react';
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

  // Get all selected filter labels for display
  const getSelectedFilterLabels = () => {
    const labels: { slug: string; attrName: string; value: string; label: string }[] = [];

    Object.entries(filters).forEach(([slug, values]) => {
      const attr = activeAttributes.find(a => a.slug === slug);
      if (!attr) return;

      const normalizedOptions = normalizeAttributeOptions(attr.options);
      values.forEach(value => {
        const option = normalizedOptions.find(opt => opt.value === value);
        if (option) {
          labels.push({
            slug,
            attrName: attr.name,
            value,
            label: option.label,
          });
        }
      });
    });

    return labels;
  };

  const selectedFilterLabels = getSelectedFilterLabels();

  const removeFilter = (slug: string, value: string) => {
    onFilterChange(slug, value);
  };

  return (
    <div className="space-y-3">
      {/* Filter Controls */}
      <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Bộ lọc:</span>
        </div>

        <div className="flex-1 flex items-center gap-2 flex-wrap">
          {activeAttributes.map((attr) => {
            const selectedValues = filters[attr.slug] || [];
            const hasSelection = selectedValues.length > 0;
            const normalizedOptions = normalizeAttributeOptions(attr.options);

            return (
              <DropdownMenu key={attr.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={hasSelection ? "default" : "outline"}
                    size="sm"
                    className={hasSelection ? 'bg-primary hover:bg-primary/90' : ''}
                  >
                    {attr.name}
                    {hasSelection && (
                      <Badge variant="secondary" className="ml-2 bg-white/20">
                        {selectedValues.length}
                      </Badge>
                    )}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-64 max-h-[400px] overflow-y-auto">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>{attr.name}</span>
                    {selectedValues.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedValues.length} đã chọn
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {normalizedOptions.length > 0 ? (
                    normalizedOptions.map((opt) => (
                      <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={selectedValues.includes(opt.value)}
                        onCheckedChange={() => onFilterChange(attr.slug, opt.value)}
                      >
                        {opt.label}
                      </DropdownMenuCheckboxItem>
                    ))
                  ) : (
                    <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                      Không có tùy chọn
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>

        {totalFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-destructive hover:text-destructive">
            <X className="w-4 h-4 mr-1" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {selectedFilterLabels.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap px-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Đang lọc:
          </span>
          {selectedFilterLabels.map((filter, index) => (
            <Badge
              key={`${filter.slug}-${filter.value}-${index}`}
              variant="secondary"
              className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer"
              onClick={() => removeFilter(filter.slug, filter.value)}
            >
              <span className="text-xs font-medium">{filter.attrName}:</span>
              <span className="ml-1">{filter.label}</span>
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
