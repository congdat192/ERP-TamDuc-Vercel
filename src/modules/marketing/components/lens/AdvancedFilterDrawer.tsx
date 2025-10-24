import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useLensFilters } from '../../hooks/useLensFilters';

interface AdvancedFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedFilterDrawer({ open, onOpenChange }: AdvancedFilterDrawerProps) {
  const { filters, updateFilter, clearFilters } = useLensFilters();

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
