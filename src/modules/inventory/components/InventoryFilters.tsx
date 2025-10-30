import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { KiotVietProductsFullService } from '@/services/kiotvietProductsFullService';
import { CategoryTreeSelector } from './filters/CategoryTreeSelector';
import { supabase } from '@/integrations/supabase/client';

interface InventoryFiltersProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isMobile: boolean;
  selectedCategories: number[];
  selectedCategoryPaths: string[];
  onCategoriesChange: (ids: number[], paths: string[]) => void;
  selectedBrands: number[];
  setSelectedBrands: (brands: number[]) => void;
  lowStockOnly: boolean;
  setLowStockOnly: (value: boolean) => void;
  overstockOnly: boolean;
  setOverstockOnly: (value: boolean) => void;
}

export function InventoryFilters({ 
  onClearFilters, 
  onApplyFilters, 
  isMobile,
  selectedCategories,
  selectedCategoryPaths,
  onCategoriesChange,
  selectedBrands,
  setSelectedBrands,
  lowStockOnly,
  setLowStockOnly,
  overstockOnly,
  setOverstockOnly
}: InventoryFiltersProps) {
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Fetch categories and brands
  const { data: categories = [] } = useQuery({
    queryKey: ['kiotviet-categories'],
    queryFn: () => KiotVietProductsFullService.getCategories()
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['kiotviet-brands'],
    queryFn: () => KiotVietProductsFullService.getTrademarks()
  });

  // Realtime listener for product changes
  useEffect(() => {
    const channel = supabase
      .channel('kiotviet-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kiotviet_products_full'
        },
        (payload) => {
          console.log('Product change detected:', payload.eventType);
          
          // Clear existing timer
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }

          // Set new timer - refetch after 2 seconds of no changes
          debounceTimerRef.current = setTimeout(() => {
            console.log('Refetching categories and brands after changes...');
            queryClient.invalidateQueries({ queryKey: ['kiotviet-categories'] });
            queryClient.invalidateQueries({ queryKey: ['kiotviet-brands'] });
            queryClient.invalidateQueries({ queryKey: ['kiotviet-products-full'] });
          }, 2000);
        }
      )
      .subscribe();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const brandOptions = brands
    .filter(brand => brand.name)
    .map(brand => ({
      value: brand.id.toString(),
      label: brand.name
    }));

  return (
    <div className="space-y-4">
      {/* Nhóm hàng - Tree Selector */}
      <CategoryTreeSelector
        categories={categories}
        selectedCategories={selectedCategories}
        selectedCategoryPaths={selectedCategoryPaths}
        onSelectionChange={(ids, paths) => onCategoriesChange(ids, paths)}
      />

      {/* Trạng thái tồn kho */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Trạng thái tồn kho</label>
        
        <div className="flex items-center justify-between p-3 theme-card rounded-lg border theme-border-primary">
          <span className="text-sm theme-text">Tồn kho thấp</span>
          <Switch
            checked={lowStockOnly}
            onCheckedChange={setLowStockOnly}
          />
        </div>
        
        <div className="flex items-center justify-between p-3 theme-card rounded-lg border theme-border-primary">
          <span className="text-sm theme-text">Quá tồn</span>
          <Switch
            checked={overstockOnly}
            onCheckedChange={setOverstockOnly}
          />
        </div>
      </div>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <div className="flex space-x-3 pt-4 border-t theme-border-primary/20">
          <Button variant="outline" className="flex-1" onClick={onClearFilters}>
            Xóa tất cả
          </Button>
          <Button className="flex-1" onClick={onApplyFilters}>
            Áp dụng
          </Button>
        </div>
      )}
    </div>
  );
}
