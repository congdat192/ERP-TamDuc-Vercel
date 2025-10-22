import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLensFilters } from '../../hooks/useLensFilters';

interface AdvancedFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedFilterDrawer({ open, onOpenChange }: AdvancedFilterDrawerProps) {
  const { filters, updateFilter, clearFilters } = useLensFilters();

  const materials = ['CR-39', 'Polycarbonate', 'Trivex', 'Hi-Index'];
  const refractiveIndexes = ['1.50', '1.56', '1.60', '1.67', '1.74'];
  const origins = ['Pháp', 'Đức', 'Nhật Bản', 'Hàn Quốc', 'Thái Lan', 'Việt Nam'];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Lọc nâng cao</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Refractive Index */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Chiết suất</Label>
            <RadioGroup value={filters.refractiveIndex || ''} onValueChange={(v) => updateFilter('refractiveIndex', v || null)}>
              {refractiveIndexes.map((ri) => (
                <div key={ri} className="flex items-center space-x-2">
                  <RadioGroupItem value={ri} id={`ri-${ri}`} />
                  <Label htmlFor={`ri-${ri}`} className="cursor-pointer">{ri}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Materials */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Chất liệu</Label>
            <div className="space-y-2">
              {materials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mat-${material}`}
                    checked={filters.material === material}
                    onCheckedChange={(checked) => {
                      updateFilter('material', checked ? material : null);
                    }}
                  />
                  <Label htmlFor={`mat-${material}`} className="cursor-pointer">{material}</Label>
                </div>
              ))}
            </div>
          </div>

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

          {/* Origin */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Xuất xứ</Label>
            <Select value={filters.origin || ''} onValueChange={(v) => updateFilter('origin', v || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn xuất xứ" />
              </SelectTrigger>
              <SelectContent>
                {origins.map((origin) => (
                  <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warranty */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="warranty"
              checked={filters.hasWarranty}
              onCheckedChange={(checked) => updateFilter('hasWarranty', !!checked)}
            />
            <Label htmlFor="warranty" className="cursor-pointer">Có bảo hành</Label>
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
