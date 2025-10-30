
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { KiotVietProductsFullService } from '@/services/kiotvietProductsFullService';
import { MultiSelectFilter } from './filters/MultiSelectFilter';

interface InventoryFiltersProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isMobile: boolean;
  selectedCategories: number[];
  setSelectedCategories: (categories: number[]) => void;
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
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  lowStockOnly,
  setLowStockOnly,
  overstockOnly,
  setOverstockOnly
}: InventoryFiltersProps) {
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');

  // Fetch categories and brands
  const { data: categories = [] } = useQuery({
    queryKey: ['kiotviet-categories'],
    queryFn: () => KiotVietProductsFullService.getCategories()
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['kiotviet-brands'],
    queryFn: () => KiotVietProductsFullService.getTrademarks()
  });

  // Convert categories to tree format for display
  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name
  }));

  const brandOptions = brands.map(brand => ({
    value: brand.id.toString(),
    label: brand.name
  }));

  return (
    <div className="space-y-4">
      {/* Nhóm hàng */}
      <MultiSelectFilter
        label="Nhóm hàng"
        options={categoryOptions}
        selectedValues={selectedCategories.map(String)}
        onSelectionChange={(values) => setSelectedCategories(values.map(Number))}
        placeholder="Chọn nhóm hàng"
      />

      {/* Thương hiệu */}
      <MultiSelectFilter
        label="Thương hiệu"
        options={brandOptions}
        selectedValues={selectedBrands.map(String)}
        onSelectionChange={(values) => setSelectedBrands(values.map(Number))}
        placeholder="Chọn thương hiệu"
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
