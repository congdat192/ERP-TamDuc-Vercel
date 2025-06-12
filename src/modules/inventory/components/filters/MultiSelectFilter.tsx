
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, X } from 'lucide-react';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  placeholder: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
}

export function MultiSelectFilter({ 
  label, 
  placeholder, 
  options, 
  selectedValues, 
  onSelectionChange 
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newValues);
  };

  const handleRemoveTag = (value: string) => {
    onSelectionChange(selectedValues.filter(v => v !== value));
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} được chọn`;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium theme-text">{label}</label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="voucher-input h-10 rounded-md w-full justify-between theme-border-primary"
          >
            <span className="truncate">{getDisplayText()}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 theme-card border theme-border-primary rounded-lg z-50">
          <div className="p-3">
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 voucher-input rounded-md mb-2"
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 p-2 hover:theme-bg-primary/10 cursor-pointer rounded-md"
                  onClick={() => handleOptionToggle(option.value)}
                >
                  <div className="flex h-4 w-4 items-center justify-center">
                    {selectedValues.includes(option.value) && (
                      <Check className="h-3 w-3 theme-text-primary" />
                    )}
                  </div>
                  <span className="text-sm theme-text">{option.label}</span>
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="p-2 text-sm theme-text-muted">Không tìm thấy kết quả</div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected tags */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="text-xs h-6 px-2 theme-bg-primary/10 theme-text-primary rounded-md"
              >
                {option?.label || value}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer hover:theme-text-primary/70"
                  onClick={() => handleRemoveTag(value)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
