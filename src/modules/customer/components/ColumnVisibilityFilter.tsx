
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
  const [open, setOpen] = useState(false);

  // Chia columns thành 2 cột để hiển thị đẹp hơn (27 cột chia 2)
  const leftColumns = columns.slice(0, Math.ceil(columns.length / 2)); // 14 cột
  const rightColumns = columns.slice(Math.ceil(columns.length / 2)); // 13 cột

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-current theme-text theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary">
          <Filter className="h-4 w-4 mr-2 theme-text-primary" />
          Hiển thị cột
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[520px] p-4 theme-card border theme-border-primary shadow-lg z-50" align="end" sideOffset={8}>
        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-2 gap-4 pr-3">
            {/* Cột trái */}
            <div className="space-y-2">
              {leftColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={column.key}
                    checked={column.visible}
                    onCheckedChange={(checked) => onColumnToggle(column.key, checked as boolean)}
                    className="h-4 w-4 flex-shrink-0"
                  />
                  <label
                    htmlFor={column.key}
                    className="text-sm theme-text cursor-pointer select-none leading-4 flex-1 break-words"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
            
            {/* Cột phải */}
            <div className="space-y-2">
              {rightColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={column.key}
                    checked={column.visible}
                    onCheckedChange={(checked) => onColumnToggle(column.key, checked as boolean)}
                    className="h-4 w-4 flex-shrink-0"
                  />
                  <label
                    htmlFor={column.key}
                    className="text-sm theme-text cursor-pointer select-none leading-4 flex-1 break-words"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
