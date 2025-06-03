
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter } from 'lucide-react';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnVisibilityFilterProps {
  columns: ColumnConfig[];
  onColumnToggle: (columnKey: string) => void;
}

export function ColumnVisibilityFilter({ columns, onColumnToggle }: ColumnVisibilityFilterProps) {
  const [open, setOpen] = useState(false);

  // Chia columns thành 2 cột
  const leftColumns = columns.slice(0, Math.ceil(columns.length / 2));
  const rightColumns = columns.slice(Math.ceil(columns.length / 2));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Bộ lọc
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Hiển thị cột</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Cột trái */}
            <div className="space-y-3">
              {leftColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.key}
                    checked={column.visible}
                    onCheckedChange={() => onColumnToggle(column.key)}
                  />
                  <label
                    htmlFor={column.key}
                    className="text-sm font-normal cursor-pointer"
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
                    onCheckedChange={() => onColumnToggle(column.key)}
                  />
                  <label
                    htmlFor={column.key}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
