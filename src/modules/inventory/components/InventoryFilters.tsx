import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MultiSelectFilter } from './filters/MultiSelectFilter';
import { CategoryTreeSelector } from './filters/CategoryTreeSelector';
import { AttributeExpandableFilter } from './filters/AttributeExpandableFilter';
import { StockStatusFilter } from './filters/StockStatusFilter';
import { TimePresetSelector } from './filters/TimePresetSelector';
import { ThreeStateButtonGroup } from './filters/ThreeStateButtonGroup';

interface InventoryFiltersProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isMobile: boolean;
}

export function InventoryFilters({ onClearFilters, onApplyFilters, isMobile }: InventoryFiltersProps) {
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'out_of_stock' | 'all'>('all');
  const [timePreset, setTimePreset] = useState('');
  const [customTimeRange, setCustomTimeRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [attributeFilters, setAttributeFilters] = useState<{ [key: string]: string[] }>({});

  // Mock data for attributes
  const mockAttributes = [
    { id: 'color', name: 'Color', values: ['Red', 'Blue', 'Green'] },
    { id: 'size', name: 'Size', values: ['S', 'M', 'L'] },
    { id: 'material', name: 'Material', values: ['Cotton', 'Polyester'] },
  ];

  // Options for time presets
  const timePresetOptions = [
    { value: 'last_day', label: 'Last Day' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'last_month', label: 'Last Month' },
  ];

  const handleAttributeChange = (attributeId: string, values: string[]) => {
    setAttributeFilters(prev => ({ ...prev, [attributeId]: values }));
  };

  return (
    <div className="space-y-4">
      {/* Danh mục */}
      <CategoryTreeSelector 
        label="Danh mục"
        selectedCategories={selectedCategories}
        onSelectionChange={setSelectedCategories}
      />

      {/* Tên sản phẩm */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Tên sản phẩm</label>
        <Input
          placeholder="Nhập tên sản phẩm"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="voucher-input h-10 rounded-md"
        />
      </div>

      {/* SKU */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">SKU</label>
        <Input
          placeholder="Nhập SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="voucher-input h-10 rounded-md"
        />
      </div>

      {/* Barcode */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Barcode</label>
        <Input
          placeholder="Nhập Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="voucher-input h-10 rounded-md"
        />
      </div>

      {/* Trạng thái kho */}
      <StockStatusFilter
        value={stockStatus}
        onChange={setStatus => setStockStatus(setStatus)}
      />

      {/* Thời gian */}
      <TimePresetSelector
        value={timePreset}
        onChange={setTimePreset}
        customTimeRange={customTimeRange}
        onCustomTimeRangeChange={setCustomTimeRange}
        options={timePresetOptions}
      />

      {/* Thuộc tính */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Thuộc tính</label>
        {mockAttributes.map(attribute => (
          <AttributeExpandableFilter
            key={attribute.id}
            attribute={attribute}
            selectedValues={attributeFilters[attribute.id] || []}
            onSelectionChange={(values) => handleAttributeChange(attribute.id, values)}
          />
        ))}
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
