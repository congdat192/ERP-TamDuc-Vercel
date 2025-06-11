
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { timePresets } from '@/data/inventoryMockData';

interface TimePresetSelectorProps {
  label: string;
  type: 'outOfStock' | 'created';
  value: 'all' | 'custom' | string;
  onChange: (value: string) => void;
  customRange?: [Date?, Date?];
  onCustomRangeChange?: (range: [Date?, Date?]) => void;
}

export function TimePresetSelector({ 
  label, 
  type, 
  value, 
  onChange, 
  customRange, 
  onCustomRangeChange 
}: TimePresetSelectorProps) {
  const [showCustom, setShowCustom] = useState(value === 'custom');
  const [showPresets, setShowPresets] = useState(false);

  const presetData = timePresets[type];

  const handleModeChange = (mode: 'all' | 'custom') => {
    if (mode === 'all') {
      setShowCustom(false);
      setShowPresets(true);
    } else {
      setShowCustom(true);
      setShowPresets(false);
      onChange('custom');
    }
  };

  const handlePresetSelect = (presetValue: string) => {
    onChange(presetValue);
    setShowPresets(false);
  };

  const renderPresetButton = (preset: { value: string; label: string }) => (
    <Button
      key={preset.value}
      variant={value === preset.value ? "default" : "outline"}
      size="sm"
      onClick={() => handlePresetSelect(preset.value)}
      className={`text-xs h-8 ${
        value === preset.value 
          ? "voucher-button-primary" 
          : "theme-border-primary hover:theme-bg-primary/10"
      }`}
    >
      {preset.label}
    </Button>
  );

  // Get the first category based on type with proper type checking
  const firstCategoryData = type === 'outOfStock' && 'daily' in presetData ? presetData.daily : 
                            type === 'created' && 'recent' in presetData ? presetData.recent : [];
  const firstCategoryLabel = type === 'outOfStock' ? 'Theo ngày' : 'Gần đây';

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium theme-text">{label}</label>
      
      {/* Radio buttons */}
      <div className="flex gap-2">
        <Button
          variant={!showCustom ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange('all')}
          className={`text-xs h-8 ${
            !showCustom 
              ? "voucher-button-primary" 
              : "theme-border-primary hover:theme-bg-primary/10"
          }`}
        >
          Toàn thời gian
        </Button>
        <Button
          variant={showCustom ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange('custom')}
          className={`text-xs h-8 gap-1 ${
            showCustom 
              ? "voucher-button-primary" 
              : "theme-border-primary hover:theme-bg-primary/10"
          }`}
        >
          <CalendarIcon className="h-3 w-3" />
          Tùy chỉnh
        </Button>
      </div>

      {/* Preset selection */}
      {showPresets && (
        <Popover open={showPresets} onOpenChange={setShowPresets}>
          <PopoverTrigger asChild>
            <div className="hidden" />
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4 theme-card border theme-border-primary shadow-lg z-50 rounded-lg" align="start">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium theme-text mb-2">
                  {firstCategoryLabel}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {firstCategoryData.map(renderPresetButton)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium theme-text mb-2">
                  {type === 'outOfStock' ? 'Theo tuần/tháng' : 'Theo kỳ'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {presetData.period.map(renderPresetButton)}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <Button
                  variant={value === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetSelect('all')}
                  className={`w-full text-xs h-8 ${
                    value === 'all' 
                      ? "voucher-button-primary" 
                      : "theme-border-primary hover:theme-bg-primary/10"
                  }`}
                >
                  Toàn thời gian
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Custom date range */}
      {showCustom && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start voucher-input h-9 text-xs rounded-md">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {customRange?.[0] ? format(customRange[0], "dd/MM/yyyy") : "Từ ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 theme-card rounded-lg">
                <Calendar 
                  mode="single" 
                  selected={customRange?.[0]} 
                  onSelect={(date) => onCustomRangeChange?.([date, customRange?.[1]])} 
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start voucher-input h-9 text-xs rounded-md">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {customRange?.[1] ? format(customRange[1], "dd/MM/yyyy") : "Đến ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 theme-card rounded-lg">
                <Calendar 
                  mode="single" 
                  selected={customRange?.[1]} 
                  onSelect={(date) => onCustomRangeChange?.([customRange?.[0], date])} 
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onCustomRangeChange?.([undefined, undefined])}
              className="text-xs h-8"
            >
              Bỏ qua
            </Button>
            <Button 
              size="sm"
              className="voucher-button-primary text-xs h-8"
            >
              Áp dụng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
