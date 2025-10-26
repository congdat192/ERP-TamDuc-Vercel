import { ChevronDown, X } from 'lucide-react';
import { useLensFilters } from '../../hooks/useLensFilters';
import { LensProductAttribute, AttributeOption } from '../../types/lens';
import { normalizeAttributeOptions } from '../../utils/attributeHelpers';
import { cn } from '@/lib/utils';
import { MegaMenuItem } from './MegaMenuItem';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface AttributeDropdownFiltersProps {
  attributes: LensProductAttribute[];
  actionButtons?: React.ReactNode;
}

// Helper functions
const getColumnsForOptions = (count: number): 1 | 2 | 3 | 4 => {
  if (count <= 6) return 1;
  if (count <= 12) return 2;
  if (count <= 18) return 3;
  return 4;
};

const hasImages = (options: AttributeOption[]): boolean => {
  return options.some(opt => opt.image_url);
};

const getDropdownWidth = (columns: number, withImages: boolean): string => {
  if (!withImages) {
    return columns === 1 ? 'w-64' : 'w-[520px]';
  }
  
  const widths = {
    1: 'w-[240px]',
    2: 'w-[520px]',
    3: 'w-[800px]',
    4: 'w-[1080px]'
  };
  return widths[columns as keyof typeof widths];
};

export function AttributeDropdownFilters({ 
  attributes, 
  actionButtons 
}: AttributeDropdownFiltersProps) {
  const { filters, toggleAttributeValue } = useLensFilters();

  // Only show active attributes, sorted by display_order
  const activeAttributes = attributes
    .filter(attr => attr.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  const clearAttributeFilter = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentValues = filters.attributeFilters[slug] || [];
    currentValues.forEach(value => toggleAttributeValue(slug, value));
  };

  return (
    <div className="px-4 py-3 border-t bg-background">
      <div className="flex items-center gap-3">
        {/* Scrollable dropdown filters */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
          {activeAttributes.map((attr) => {
              const selectedValues = filters.attributeFilters[attr.slug] || [];
              const hasSelection = selectedValues.length > 0;
              const normalizedOptions = normalizeAttributeOptions(attr.options);
              const columns = getColumnsForOptions(normalizedOptions.length);
              const showImages = hasImages(normalizedOptions);
              const dropdownWidth = getDropdownWidth(columns, showImages);

              return (
                <DropdownMenu key={attr.id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-10 px-4 gap-2 font-medium text-sm whitespace-nowrap',
                        hasSelection && 'border-green-600 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                      )}
                    >
                      {attr.name}
                      {hasSelection && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-600 text-white rounded-full">
                          {selectedValues.length}
                        </span>
                      )}
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent 
                    className={cn(
                      dropdownWidth,
                      "max-h-[500px] overflow-y-auto bg-white dark:bg-gray-800"
                    )}
                    align="start"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>{attr.name}</span>
                      {hasSelection && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={(e) => clearAttributeFilter(attr.slug, e)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Xóa
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />

                    {showImages ? (
                      // Mega menu layout with images
                      <div className={cn(
                        "grid gap-3 p-4",
                        columns === 1 && "grid-cols-1",
                        columns === 2 && "grid-cols-2",
                        columns === 3 && "grid-cols-3",
                        columns === 4 && "grid-cols-4"
                      )}>
                        {normalizedOptions.map((opt) => (
                          <MegaMenuItem 
                            key={opt.value}
                            option={opt}
                            isChecked={selectedValues.includes(opt.value)}
                            onToggle={() => toggleAttributeValue(attr.slug, opt.value)}
                          />
                        ))}
                      </div>
                    ) : (
                      // Compact list layout without images
                      <div className={cn(
                        "grid gap-1 p-2",
                        columns === 1 && "grid-cols-1",
                        columns >= 2 && "grid-cols-2"
                      )}>
                        {normalizedOptions.map((opt) => {
                          const isChecked = selectedValues.includes(opt.value);
                          return (
                            <DropdownMenuCheckboxItem
                              key={opt.value}
                              checked={isChecked}
                              onCheckedChange={() => toggleAttributeValue(attr.slug, opt.value)}
                              className="cursor-pointer"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{opt.label}</div>
                                {opt.short_description && (
                                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                    {opt.short_description}
                                  </div>
                                )}
                              </div>
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
