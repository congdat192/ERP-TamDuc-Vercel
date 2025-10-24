import { useState } from 'react';
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
  
  const [localSph, setLocalSph] = useState(filters.sph ?? 0);
  const [localCyl, setLocalCyl] = useState(filters.cyl ?? 0);
  const [localUseCases, setLocalUseCases] = useState<string[]>(filters.useCases || []);
  const [localTiers, setLocalTiers] = useState<string[]>(filters.availableTiers || []);

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
    (localSph !== 0 ? 1 : 0) + 
    (localCyl !== 0 ? 1 : 0) + 
    localUseCases.length + 
    localTiers.length;

  const applyFilters = () => {
    if (localSph !== 0) updateFilter('sph', localSph);
    else updateFilter('sph', undefined);
    
    if (localCyl !== 0) updateFilter('cyl', localCyl);
    else updateFilter('cyl', undefined);
    
    if (localUseCases.length > 0) updateFilter('useCases', localUseCases);
    else updateFilter('useCases', undefined);
    
    if (localTiers.length > 0) updateFilter('availableTiers', localTiers as any);
    else updateFilter('availableTiers', undefined);
    
    onOpenChange(false);
  };

  const clearLocalFilters = () => {
    setLocalSph(0);
    setLocalCyl(0);
    setLocalUseCases([]);
    setLocalTiers([]);
    updateFilter('sph', undefined);
    updateFilter('cyl', undefined);
    updateFilter('useCases', undefined);
    updateFilter('availableTiers', undefined);
  };

  const tierOptions = [
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
                    <span className="text-sm font-medium">{localSph.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[localSph]}
                    onValueChange={(val) => setLocalSph(val[0])}
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
                    <span className="text-sm font-medium">{localCyl.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[localCyl]}
                    onValueChange={(val) => setLocalCyl(val[0])}
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
                    const isChecked = localUseCases.includes(useCase.code);
                    return (
                      <div key={useCase.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`usecase-${useCase.code}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setLocalUseCases([...localUseCases, useCase.code]);
                            } else {
                              setLocalUseCases(localUseCases.filter(c => c !== useCase.code));
                            }
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
                  const isChecked = localTiers.includes(tier.value);
                  return (
                    <div key={tier.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tier-${tier.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLocalTiers([...localTiers, tier.value]);
                          } else {
                            setLocalTiers(localTiers.filter(t => t !== tier.value));
                          }
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
              onClick={clearLocalFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
            <Button 
              size="lg"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-base font-semibold" 
              onClick={applyFilters}
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
