import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useLensFilters } from '../../hooks/useLensFilters';
import { LensProductAttribute } from '../../types/lens';

interface AdvancedFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attributes: LensProductAttribute[];
}

export function AdvancedFilterDrawer({ open, onOpenChange, attributes }: AdvancedFilterDrawerProps) {
  const { filters, updateFilter, toggleAttributeValue, clearFilters } = useLensFilters();

  // Separate attributes by type
  const selectAttrs = attributes.filter(a => a.type === 'select' && a.is_active);
  const multiselectAttrs = attributes.filter(a => a.type === 'multiselect' && a.is_active);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Lọc nâng cao</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Price Range */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Giá: {filters.minPrice?.toLocaleString() || 0}₫ - {filters.maxPrice?.toLocaleString() || '∞'}₫
            </Label>
            <Slider
              min={0}
              max={5000000}
              step={100000}
              value={[filters.minPrice || 0, filters.maxPrice || 5000000]}
              onValueChange={([min, max]) => {
                updateFilter('minPrice', min);
                updateFilter('maxPrice', max);
              }}
            />
          </div>

          {/* Render all SELECT type attributes */}
          {selectAttrs.map(attr => (
            <div key={attr.id}>
              <Label className="text-base font-semibold mb-3 block">
                {attr.name}
              </Label>
              <div className="flex flex-wrap gap-2">
                {(attr.options as string[]).map(option => {
                  const isActive = filters.attributeFilters[attr.slug]?.includes(option) || false;
                  return (
                    <button
                      key={option}
                      onClick={() => toggleAttributeValue(attr.slug, option)}
                      className={`px-3 py-1.5 rounded-md border text-sm transition-all ${
                        isActive
                          ? 'bg-green-50 border-green-600 text-green-700 dark:bg-green-950 dark:text-green-400'
                          : 'bg-background border-border hover:bg-accent'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Render all MULTISELECT type attributes */}
          {multiselectAttrs.map(attr => (
            <div key={attr.id}>
              <Label className="text-base font-semibold mb-3 block">
                {attr.name}
              </Label>
              <div className="space-y-2">
                {(attr.options as string[]).map(option => {
                  const isChecked = filters.attributeFilters[attr.slug]?.includes(option) || false;
                  return (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${attr.slug}-${option}`}
                        checked={isChecked}
                        onCheckedChange={() => toggleAttributeValue(attr.slug, option)}
                      />
                      <label
                        htmlFor={`${attr.slug}-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={clearFilters}>
              Xóa tất cả
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => onOpenChange(false)}>
              Áp dụng
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
