
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';

interface SingleSelectOption {
  value: string;
  label: string;
}

interface SingleSelectFilterProps {
  label: string;
  placeholder: string;
  options: SingleSelectOption[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
}

export function SingleSelectFilter({ 
  label, 
  placeholder, 
  options, 
  selectedValue, 
  onSelectionChange 
}: SingleSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (value: string) => {
    onSelectionChange(value);
    setOpen(false);
    setSearchTerm('');
  };

  const getDisplayText = () => {
    if (!selectedValue) return placeholder;
    const option = options.find(opt => opt.value === selectedValue);
    return option?.label || placeholder;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium theme-text">{label}</label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm min-h-[36px] theme-border-primary"
          >
            <span className="truncate theme-text">{getDisplayText()}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 theme-card border theme-border-primary rounded-lg z-50">
          <div className="p-3">
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm rounded-md mb-2"
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center p-2 hover:theme-bg-primary/10 cursor-pointer rounded-md"
                  onClick={() => handleOptionSelect(option.value)}
                >
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
    </div>
  );
}
