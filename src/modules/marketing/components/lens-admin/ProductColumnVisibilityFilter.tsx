import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye } from 'lucide-react';

export interface ProductColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

interface ProductColumnVisibilityFilterProps {
  columns: ProductColumnConfig[];
  onColumnToggle: (columnKey: string) => void;
}

export function ProductColumnVisibilityFilter({ columns, onColumnToggle }: ProductColumnVisibilityFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-border hover:bg-accent">
          <Eye className="h-4 w-4 mr-2" />
          Tùy chỉnh cột
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="end" sideOffset={8}>
        <div className="space-y-1 mb-3">
          <h4 className="font-semibold text-sm">Hiển thị cột</h4>
          <p className="text-xs text-muted-foreground">Chọn các cột muốn hiển thị trong bảng</p>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-3">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={column.key}
                  checked={column.visible}
                  onCheckedChange={() => onColumnToggle(column.key)}
                  className="h-4 w-4 flex-shrink-0"
                  disabled={column.key === 'actions'}
                />
                <label
                  htmlFor={column.key}
                  className="text-sm cursor-pointer select-none leading-4 flex-1"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
