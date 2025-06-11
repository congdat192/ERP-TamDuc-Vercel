
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { stockStatusOptions } from '@/data/inventoryMockData';

interface StockStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  customRange?: [number, number];
  onCustomRangeChange?: (range: [number, number]) => void;
}

export function StockStatusFilter({ 
  value, 
  onChange, 
  customRange = [0, 1000], 
  onCustomRangeChange 
}: StockStatusFilterProps) {
  const [showCustom, setShowCustom] = useState(value === 'custom');

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
    setShowCustom(newValue === 'custom');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium theme-text">Tồn kho</label>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="voucher-input h-10 rounded-md">
          <SelectValue placeholder="Tất cả" />
        </SelectTrigger>
        <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
          {stockStatusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showCustom && (
        <div className="space-y-3 p-3 border border-border rounded-md theme-card">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs theme-text-muted">Từ</label>
              <Input
                type="number"
                value={customRange[0]}
                onChange={(e) => onCustomRangeChange?.([parseInt(e.target.value) || 0, customRange[1]])}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs theme-text-muted">Đến</label>
              <Input
                type="number"
                value={customRange[1]}
                onChange={(e) => onCustomRangeChange?.([customRange[0], parseInt(e.target.value) || 1000])}
                className="h-8 text-sm"
              />
            </div>
          </div>
          
          <div className="px-2">
            <Slider
              value={customRange}
              onValueChange={(value) => onCustomRangeChange?.(value as [number, number])}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
