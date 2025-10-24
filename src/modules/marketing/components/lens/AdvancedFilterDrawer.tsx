import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Check } from 'lucide-react';
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

  const activeFilterCount = selectAttrs.filter(a => filters.attributeFilters[a.slug]?.length).length + 
    multiselectAttrs.filter(a => filters.attributeFilters[a.slug]?.length).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[66vw] max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Lọc nâng cao</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Price Range - Full width */}
            <div className="bg-card p-4 rounded-lg border">
              <Label className="text-lg font-semibold mb-4 block">
                Khoảng giá: {filters.minPrice?.toLocaleString() || 0}₫ - {filters.maxPrice?.toLocaleString() || '5,000,000'}₫
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
                className="mt-2"
              />
            </div>

            {/* 3-column grid for all attributes */}
            <div className="grid grid-cols-3 gap-4">
              {/* SELECT type attributes */}
              {selectAttrs.map(attr => (
                <div key={attr.id} className="bg-card p-4 rounded-lg border">
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
                          className={`px-3 py-2 rounded-md border text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-green-600 border-green-600 text-white shadow-sm'
                              : 'bg-background border-border hover:bg-accent hover:border-green-400'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* MULTISELECT type attributes */}
              {multiselectAttrs.map(attr => (
                <div key={attr.id} className="bg-card p-4 rounded-lg border">
                  <Label className="text-base font-semibold mb-3 block">
                    {attr.name}
                  </Label>
                  <div className="space-y-2.5">
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
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {option}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1 text-base" 
              onClick={clearFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Xóa tất cả bộ lọc
            </Button>
            <Button 
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-base font-semibold" 
              onClick={() => onOpenChange(false)}
            >
              <Check className="w-4 h-4 mr-2" />
              Áp dụng {activeFilterCount > 0 && `(${activeFilterCount} bộ lọc)`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
