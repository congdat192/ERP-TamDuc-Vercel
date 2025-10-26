import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
  const { filters, toggleAttributeValue, clearFilters } = useLensFilters();

  // Separate attributes: Full width vs Grid
  const fullWidthSlugs = ['lens_brand', 'tinh_nang_trong', 'refractive_index'];
  const fullWidthAttrs = attributes
    .filter(a => fullWidthSlugs.includes(a.slug) && a.is_active)
    .sort((a, b) => fullWidthSlugs.indexOf(a.slug) - fullWidthSlugs.indexOf(b.slug));

  const gridAttrs = attributes.filter(a => !fullWidthSlugs.includes(a.slug) && a.is_active);

  const activeFilterCount = Object.keys(filters.attributeFilters).filter(
    slug => filters.attributeFilters[slug]?.length > 0
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[66vw] max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Lọc nâng cao</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Section 1: Full Width Attributes */}
            {fullWidthAttrs.map(attr => (
              <div key={attr.id} className="bg-card p-4 rounded-lg border">
                <Label className="text-lg font-semibold mb-4 block">
                  {attr.name}
                </Label>
                
                {attr.type === 'select' ? (
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map(option => {
                      const opt = typeof option === 'string' ? { value: option, label: option } : option;
                      const isActive = filters.attributeFilters[attr.slug]?.includes(opt.value) || false;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleAttributeValue(attr.slug, opt.value)}
                          className={`px-4 py-2.5 rounded-md border text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-green-600 border-green-600 text-white shadow-sm'
                              : 'bg-background border-border hover:bg-accent hover:border-green-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {attr.options.map(option => {
                      const opt = typeof option === 'string' ? { value: option, label: option } : option;
                      const isChecked = filters.attributeFilters[attr.slug]?.includes(opt.value) || false;
                      return (
                        <div key={opt.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${attr.slug}-${opt.value}`}
                            checked={isChecked}
                            onCheckedChange={() => toggleAttributeValue(attr.slug, opt.value)}
                          />
                          <label
                            htmlFor={`${attr.slug}-${opt.value}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {opt.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Section 2: 3-Column Grid Attributes */}
            <div className="grid grid-cols-3 gap-4">
              {gridAttrs.map(attr => (
                <div key={attr.id} className="bg-card p-4 rounded-lg border">
                  <Label className="text-base font-semibold mb-3 block">
                    {attr.name}
                  </Label>
                  
                  {attr.type === 'select' ? (
                    <div className="flex flex-wrap gap-2">
                      {attr.options.map(option => {
                        const opt = typeof option === 'string' ? { value: option, label: option } : option;
                        const isActive = filters.attributeFilters[attr.slug]?.includes(opt.value) || false;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => toggleAttributeValue(attr.slug, opt.value)}
                            className={`px-3 py-2 rounded-md border text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-green-600 border-green-600 text-white shadow-sm'
                                : 'bg-background border-border hover:bg-accent hover:border-green-400'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {attr.options.map(option => {
                        const opt = typeof option === 'string' ? { value: option, label: option } : option;
                        const isChecked = filters.attributeFilters[attr.slug]?.includes(opt.value) || false;
                        return (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${attr.slug}-${opt.value}`}
                              checked={isChecked}
                              onCheckedChange={() => toggleAttributeValue(attr.slug, opt.value)}
                            />
                            <label
                              htmlFor={`${attr.slug}-${opt.value}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {opt.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
