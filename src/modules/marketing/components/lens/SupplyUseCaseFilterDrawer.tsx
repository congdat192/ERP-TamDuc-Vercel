
import { useQuery } from '@tanstack/react-query';
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
import { Slider } from '@/components/ui/slider';
import { X, Check } from 'lucide-react';
import { useLensFilters } from '../../hooks/useLensFilters';
import { supabase } from '@/integrations/supabase/client';

interface SupplyUseCaseFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplyUseCaseFilterDrawer({ open, onOpenChange }: SupplyUseCaseFilterDrawerProps) {
  const { filters, updateFilter } = useLensFilters();
  
  // Use filters directly - no local state
  const currentSph = filters.sph ?? 0;
  const currentCyl = filters.cyl ?? 0;
  const currentUseCases = filters.useCases || [];
  const currentTiers = filters.availableTiers || [];

  // Fetch use cases
  const { data: useCases = [] } = useQuery({
    queryKey: ['lens-use-cases'],
    queryFn: async () => {
      const { data } = await supabase
        .from('lens_use_cases')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      return data || [];
    },
  });

  const activeFilterCount = 
    (currentSph !== 0 ? 1 : 0) + 
    (currentCyl !== 0 ? 1 : 0) + 
    currentUseCases.length + 
    currentTiers.length;

  const tierOptions: Array<{ value: 'IN_STORE' | 'NEXT_DAY' | 'CUSTOM_ORDER' | 'FACTORY_ORDER', label: string }> = [
    { value: 'IN_STORE', label: 'Có sẵn tại cửa hàng' },
    { value: 'NEXT_DAY', label: 'Giao trong 1 ngày' },
    { value: 'CUSTOM_ORDER', label: 'Đặt hàng theo yêu cầu' },
    { value: 'FACTORY_ORDER', label: 'Đặt hàng từ nhà máy' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[66vw] max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Lọc thông số & nhu cầu</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* SPH/CYL Section */}
            <div className="bg-card p-4 rounded-lg border">
              <Label className="text-lg font-semibold mb-4 block">
                Thông số kính (SPH & CYL)
              </Label>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>SPH (Cầu)</Label>
                    <span className="text-sm font-medium">{currentSph.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[currentSph]}
                    onValueChange={(val) => {
                      if (val[0] === 0) updateFilter('sph', undefined);
                      else updateFilter('sph', val[0]);
                    }}
                    min={-20}
                    max={10}
                    step={0.25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-20.00</span>
                    <span>+10.00</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>CYL (Trụ)</Label>
                    <span className="text-sm font-medium">{currentCyl.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[currentCyl]}
                    onValueChange={(val) => {
                      if (val[0] === 0) updateFilter('cyl', undefined);
                      else updateFilter('cyl', val[0]);
                    }}
                    min={-6}
                    max={0}
                    step={0.25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-6.00</span>
                    <span>0.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases Section */}
            {useCases.length > 0 && (
              <div className="bg-card p-4 rounded-lg border">
                <Label className="text-lg font-semibold mb-4 block">
                  Nhu cầu sử dụng
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {useCases.map(useCase => {
                    const isChecked = currentUseCases.includes(useCase.code);
                    return (
                      <div key={useCase.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`usecase-${useCase.code}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newUseCases = checked
                              ? [...currentUseCases, useCase.code]
                              : currentUseCases.filter(c => c !== useCase.code);
                            updateFilter('useCases', newUseCases.length > 0 ? newUseCases : undefined);
                          }}
                        />
                        <label
                          htmlFor={`usecase-${useCase.code}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {useCase.icon} {useCase.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Tier Availability Section */}
            <div className="bg-card p-4 rounded-lg border">
              <Label className="text-lg font-semibold mb-4 block">
                Tầng cung ứng
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {tierOptions.map(tier => {
                  const isChecked = currentTiers.includes(tier.value);
                  return (
                    <div key={tier.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tier-${tier.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const newTiers = checked
                            ? [...currentTiers, tier.value]
                            : currentTiers.filter(t => t !== tier.value);
                          updateFilter('availableTiers', newTiers.length > 0 ? newTiers as any : undefined);
                        }}
                      />
                      <label
                        htmlFor={`tier-${tier.value}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {tier.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1 text-base" 
              onClick={() => {
                updateFilter('sph', undefined);
                updateFilter('cyl', undefined);
                updateFilter('useCases', undefined);
                updateFilter('availableTiers', undefined);
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
            <Button 
              size="lg"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-base font-semibold" 
              onClick={() => onOpenChange(false)}
            >
              <Check className="w-4 h-4 mr-2" />
              Đóng {activeFilterCount > 0 && `(${activeFilterCount} bộ lọc)`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
