
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
  const [customTimeRange, setCustomTimeRange] = useState<[Date?, Date?]>([undefined, undefined]);
  const [attributeFilters, setAttributeFilters] = useState<{ [key: string]: string[] }>({});

  // Mock data for attributes and categories
  const mockAttributes = [
    { 
      key: 'color', 
      label: 'Màu sắc', 
      options: [
        { value: 'red', label: 'Đỏ' },
        { value: 'blue', label: 'Xanh dương' },
        { value: 'green', label: 'Xanh lá' }
      ]
    },
    { 
      key: 'size', 
      label: 'Kích thước', 
      options: [
        { value: 's', label: 'S' },
        { value: 'm', label: 'M' },
        { value: 'l', label: 'L' }
      ]
    },
    { 
      key: 'material', 
      label: 'Chất liệu', 
      options: [
        { value: 'cotton', label: 'Cotton' },
        { value: 'polyester', label: 'Polyester' }
      ]
    },
  ];

  const mockCategories = [
    {
      id: '1',
      name: 'Thời trang',
      productCount: 150,
      children: [
        { id: '1-1', name: 'Áo', productCount: 50 },
        { id: '1-2', name: 'Quần', productCount: 40 }
      ]
    },
    {
      id: '2',
      name: 'Điện tử',
      productCount: 85,
      children: [
        { id: '2-1', name: 'Điện thoại', productCount: 25 },
        { id: '2-2', name: 'Laptop', productCount: 20 }
      ]
    }
  ];

  // Options for time presets
  const timePresetOptions = [
    { value: 'last_day', label: 'Last Day' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'last_month', label: 'Last Month' },
  ];

  const handleAttributeChange = (attributeKey: string, values: string[]) => {
    setAttributeFilters(prev => ({ ...prev, [attributeKey]: values }));
  };

  const handleStockStatusChange = (status: 'all' | 'in_stock' | 'out_of_stock') => {
    setStockStatus(status);
  };

  return (
    <div className="space-y-4">
      {/* Danh mục */}
      <CategoryTreeSelector 
        categories={mockCategories}
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
        onChange={handleStockStatusChange}
      />

      {/* Thời gian */}
      <TimePresetSelector
        label="Thời gian"
        type="created"
        value={timePreset}
        onChange={setTimePreset}
        customRange={customTimeRange}
        onCustomRangeChange={setCustomTimeRange}
      />

      {/* Thuộc tính */}
      <AttributeExpandableFilter
        attributes={mockAttributes}
        selectedAttributes={attributeFilters}
        onAttributeChange={handleAttributeChange}
      />

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
