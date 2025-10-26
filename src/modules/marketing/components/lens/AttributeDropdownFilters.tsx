import { Check, ChevronDown, X } from 'lucide-react';
import { useLensFilters } from '../../hooks/useLensFilters';
import { LensProductAttribute } from '../../types/lens';
import { cn } from '@/lib/utils';
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

              return (
                <DropdownMenu key={attr.id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-10 px-4 gap-2 font-medium text-sm whitespace-nowrap',
                        hasSelection && 'border-green-600 bg-green-50 text-green-700'
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
                    className="w-64 max-h-[400px] overflow-y-auto"
                    align="start"
                  >
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>{attr.name}</span>
                      {hasSelection && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => clearAttributeFilter(attr.slug, e)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Xóa
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />

                    {attr.options.map((option) => {
                      const opt = typeof option === 'string' ? { value: option, label: option } : option;
                      const isChecked = selectedValues.includes(opt.value);
                      return (
                        <DropdownMenuCheckboxItem
                          key={opt.value}
                          checked={isChecked}
                          onCheckedChange={() => toggleAttributeValue(attr.slug, opt.value)}
                          className="cursor-pointer"
                        >
                          {opt.label}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
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
