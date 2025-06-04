
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter } from 'lucide-react';

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

  // Chia columns thành 2 cột
  const leftColumns = columns.slice(0, Math.ceil(columns.length / 2));
  const rightColumns = columns.slice(Math.ceil(columns.length / 2));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-sm">
          <Filter className="h-4 w-4 mr-2" />
          Hiển thị cột
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 bg-white border border-gray-200 shadow-lg z-50" align="end" sideOffset={8}>
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Hiển thị cột</h4>
          <ScrollArea className="h-auto max-h-96">
            <div className="grid grid-cols-2 gap-4 pr-4">
              {/* Cột trái */}
              <div className="space-y-3">
                {leftColumns.map((column) => (
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
              
              {/* Cột phải */}
              <div className="space-y-3">
                {rightColumns.map((column) => (
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
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
