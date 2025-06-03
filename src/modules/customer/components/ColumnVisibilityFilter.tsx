
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnVisibilityFilterProps {
  columns: ColumnConfig[];
  onColumnToggle: (columnKey: string, visible: boolean) => void;
}

export function ColumnVisibilityFilter({ columns, onColumnToggle }: ColumnVisibilityFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-sm">
          Khách hàng
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-white border border-gray-200 shadow-lg" align="end">
        <div className="space-y-2">
          {columns.map((column) => (
            <div key={column.key} className="flex items-center space-x-2">
              <Checkbox
                id={column.key}
                checked={column.visible}
                onCheckedChange={(checked) => onColumnToggle(column.key, checked as boolean)}
                className="h-4 w-4"
              />
              <label
                htmlFor={column.key}
                className="text-sm font-normal text-gray-700 cursor-pointer select-none"
              >
                {column.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
