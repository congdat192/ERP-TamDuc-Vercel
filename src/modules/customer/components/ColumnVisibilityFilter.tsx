
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

  // Đầy đủ 27 cột khách hàng
  const allCustomerColumns: ColumnConfig[] = [
    { key: 'customerCode', label: 'Mã khách hàng', visible: true },
    { key: 'customerName', label: 'Tên khách hàng', visible: true },
    { key: 'customerType', label: 'Loại khách hàng', visible: true },
    { key: 'phone', label: 'Điện thoại', visible: true },
    { key: 'customerGroup', label: 'Nhóm khách hàng', visible: true },
    { key: 'gender', label: 'Giới tính', visible: false },
    { key: 'birthDate', label: 'Ngày sinh', visible: false },
    { key: 'email', label: 'Email', visible: true },
    { key: 'facebook', label: 'Facebook', visible: false },
    { key: 'company', label: 'Công ty', visible: false },
    { key: 'taxCode', label: 'Mã số thuế', visible: false },
    { key: 'idNumber', label: 'Số CCCD/CMND', visible: false },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'deliveryArea', label: 'Khu vực giao hàng', visible: false },
    { key: 'ward', label: 'Phường/Xã', visible: false },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'createDate', label: 'Ngày tạo', visible: true },
    { key: 'notes', label: 'Ghi chú', visible: false },
    { key: 'lastTransactionDate', label: 'Ngày giao dịch cuối', visible: true },
    { key: 'createBranch', label: 'Chi nhánh tạo', visible: false },
    { key: 'currentDebt', label: 'Nợ hiện tại', visible: false },
    { key: 'debtDays', label: 'Số ngày nợ', visible: false },
    { key: 'totalSales', label: 'Tổng bán', visible: true },
    { key: 'currentPoints', label: 'Điểm hiện tại', visible: false },
    { key: 'totalPoints', label: 'Tổng điểm', visible: false },
    { key: 'totalSalesMinusReturns', label: 'Tổng bán trừ trả hàng', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true }
  ];

  // Sử dụng columns từ props hoặc fallback về allCustomerColumns
  const displayColumns = columns.length > 0 ? columns : allCustomerColumns;

  // Chia columns thành 2 cột
  const leftColumns = displayColumns.slice(0, Math.ceil(displayColumns.length / 2));
  const rightColumns = displayColumns.slice(Math.ceil(displayColumns.length / 2));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-sm border-current theme-text theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary">
          <Filter className="h-4 w-4 mr-2 theme-text-primary" />
          Hiển thị cột
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-4 theme-card border theme-border-primary shadow-lg z-50" align="end" sideOffset={8}>
        <div className="space-y-3">
          <ScrollArea className="h-auto max-h-[520px]">
            <div className="grid grid-cols-2 gap-6 pr-3">
              {/* Cột trái */}
              <div className="space-y-2">
                {leftColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-3 min-h-[32px] py-1">
                    <Checkbox
                      id={column.key}
                      checked={column.visible}
                      onCheckedChange={(checked) => onColumnToggle(column.key, checked as boolean)}
                      className="h-4 w-4 flex-shrink-0"
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm theme-text cursor-pointer select-none leading-relaxed flex-1"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Cột phải */}
              <div className="space-y-2">
                {rightColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-3 min-h-[32px] py-1">
                    <Checkbox
                      id={column.key}
                      checked={column.visible}
                      onCheckedChange={(checked) => onColumnToggle(column.key, checked as boolean)}
                      className="h-4 w-4 flex-shrink-0"
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm theme-text cursor-pointer select-none leading-relaxed flex-1"
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
