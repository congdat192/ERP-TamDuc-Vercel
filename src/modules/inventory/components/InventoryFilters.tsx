import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CategoryTreeSelector } from './filters/CategoryTreeSelector';
import { StockStatusFilter } from './filters/StockStatusFilter';
import { TimePresetSelector } from './filters/TimePresetSelector';
import { AttributeExpandableFilter } from './filters/AttributeExpandableFilter';
import { ThreeStateButtonGroup } from './filters/ThreeStateButtonGroup';
import { MultiSelectFilter } from './filters/MultiSelectFilter';
import { 
  categoryTree, 
  productAttributes, 
  brandOptions, 
  locationOptions, 
  productTypeOptions 
} from '@/data/inventoryMockData';

interface InventoryFiltersProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isMobile: boolean;
}

export function InventoryFilters({ onClearFilters, onApplyFilters, isMobile }: InventoryFiltersProps) {
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stockStatus, setStockStatus] = useState('all');
  const [stockCustomRange, setStockCustomRange] = useState<[number, number]>([0, 1000]);
  const [outOfStockTime, setOutOfStockTime] = useState('all');
  const [outOfStockCustomRange, setOutOfStockCustomRange] = useState<[Date?, Date?]>([undefined, undefined]);
  const [createdTime, setCreatedTime] = useState('all');
  const [createdCustomRange, setCreatedCustomRange] = useState<[Date?, Date?]>([undefined, undefined]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [pointsEarning, setPointsEarning] = useState<'all' | 'yes' | 'no'>('all');
  const [directSales, setDirectSales] = useState<'all' | 'yes' | 'no'>('all');
  const [channelLinked, setChannelLinked] = useState<'all' | 'yes' | 'no'>('all');
  const [productStatus, setProductStatus] = useState('all');

  const handleAttributeChange = (key: string, values: string[]) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [key]: values
    }));
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setStockStatus('all');
    setStockCustomRange([0, 1000]);
    setOutOfStockTime('all');
    setOutOfStockCustomRange([undefined, undefined]);
    setCreatedTime('all');
    setCreatedCustomRange([undefined, undefined]);
    setSelectedAttributes({});
    setSelectedBrands([]);
    setSelectedLocations([]);
    setSelectedProductTypes([]);
    setPointsEarning('all');
    setDirectSales('all');
    setChannelLinked('all');
    setProductStatus('all');
    onClearFilters();
  };

  // Convert brand options to the format expected by MultiSelectFilter
  const brandMultiSelectOptions = brandOptions.map(brand => ({
    value: brand.toLowerCase(),
    label: brand
  }));

  const locationMultiSelectOptions = locationOptions.map(location => ({
    value: location.toLowerCase(),
    label: location
  }));

  const productTypeMultiSelectOptions = productTypeOptions.map(type => ({
    value: type.value,
    label: type.label
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <ScrollArea className="flex-1 px-1">
        <div className="space-y-[10px] py-1">
          {/* A. Nhóm hàng */}
          <CategoryTreeSelector
            categories={categoryTree}
            selectedCategories={selectedCategories}
            onSelectionChange={setSelectedCategories}
          />

          {/* B. Tồn kho */}
          <StockStatusFilter
            value={stockStatus}
            onChange={setStockStatus}
            customRange={stockCustomRange}
            onCustomRangeChange={setStockCustomRange}
          />

          {/* C. Dự kiến hết hàng */}
          <TimePresetSelector
            label="Dự kiến hết hàng"
            type="outOfStock"
            value={outOfStockTime}
            onChange={setOutOfStockTime}
            customRange={outOfStockCustomRange}
            onCustomRangeChange={setOutOfStockCustomRange}
          />

          {/* D. Thời gian tạo */}
          <TimePresetSelector
            label="Thời gian tạo"
            type="created"
            value={createdTime}
            onChange={setCreatedTime}
            customRange={createdCustomRange}
            onCustomRangeChange={setCreatedCustomRange}
          />

          {/* E. Thuộc tính */}
          <AttributeExpandableFilter
            attributes={productAttributes}
            selectedAttributes={selectedAttributes}
            onAttributeChange={handleAttributeChange}
          />

          {/* F. Thương hiệu - Multi-select */}
          <MultiSelectFilter
            label="Thương hiệu"
            placeholder="Chọn thương hiệu"
            options={brandMultiSelectOptions}
            selectedValues={selectedBrands}
            onSelectionChange={setSelectedBrands}
          />

          {/* G. Vị trí - Multi-select */}
          <MultiSelectFilter
            label="Vị trí"
            placeholder="Chọn vị trí"
            options={locationMultiSelectOptions}
            selectedValues={selectedLocations}
            onSelectionChange={setSelectedLocations}
          />

          {/* H. Loại hàng - Multi-select */}
          <MultiSelectFilter
            label="Loại hàng"
            placeholder="Chọn loại hàng"
            options={productTypeMultiSelectOptions}
            selectedValues={selectedProductTypes}
            onSelectionChange={setSelectedProductTypes}
          />

          {/* I. Các trường dạng chọn 3 trạng thái */}
          <ThreeStateButtonGroup
            label="Tích điểm"
            value={pointsEarning}
            onChange={setPointsEarning}
          />

          <ThreeStateButtonGroup
            label="Bán trực tiếp"
            value={directSales}
            onChange={setDirectSales}
          />

          <ThreeStateButtonGroup
            label="Liên kết kênh bán"
            value={channelLinked}
            onChange={setChannelLinked}
          />

          {/* J. Trạng thái hàng hóa */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Trạng thái hàng hóa</label>
            <Select value={productStatus} onValueChange={setProductStatus}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hàng đang kinh doanh</SelectItem>
                <SelectItem value="inactive">Hàng ngừng kinh doanh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="flex-shrink-0 space-y-[5px] pt-[10px] border-t border-border">
        <Button onClick={onApplyFilters} className="w-full voucher-button-primary h-10 rounded-md">
          Áp dụng bộ lọc
        </Button>
        <Button onClick={handleClearAll} variant="outline" className="w-full theme-border-primary h-10 rounded-md">
          Đặt lại
        </Button>
      </div>
    </div>
  );
}
