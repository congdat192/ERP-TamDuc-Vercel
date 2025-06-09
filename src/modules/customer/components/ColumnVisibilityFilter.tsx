
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

  // Tạo danh sách đầy đủ columns theo hình 1
  const allColumns = [
    { key: 'ma_hoa_don', label: 'Mã hóa đơn', visible: true },
    { key: 'thoi_gian', label: 'Thời gian', visible: true },
    { key: 'thoi_gian_tao', label: 'Thời gian tạo', visible: false },
    { key: 'ngay_cap_nhat', label: 'Ngày cập nhật', visible: false },
    { key: 'ma_dat_hang', label: 'Mã đặt hàng', visible: false },
    { key: 'ma_tra_hang', label: 'Mã trả hàng', visible: true },
    { key: 'khach_hang', label: 'Khách hàng', visible: true },
    { key: 'email', label: 'Email', visible: false },
    { key: 'dien_thoai', label: 'Điện thoại', visible: false },
    { key: 'dia_chi', label: 'Địa chỉ', visible: false },
    { key: 'khu_vuc', label: 'Khu vực', visible: false },
    { key: 'phuong_xa', label: 'Phường/Xã', visible: false },
    { key: 'ngay_sinh', label: 'Ngày sinh', visible: false },
    { key: 'chi_nhanh', label: 'Chi nhánh', visible: false },
    { key: 'nguoi_ban', label: 'Người bán', visible: false },
    { key: 'nguoi_tao', label: 'Người tạo', visible: false },
    { key: 'kenh_ban', label: 'Kênh bán', visible: false },
    { key: 'ghi_chu', label: 'Ghi chú', visible: false },
    { key: 'tong_tien_hang', label: 'Tổng tiền hàng', visible: true },
    { key: 'giam_gia', label: 'Giảm giá', visible: true },
    { key: 'giam_thue', label: 'Giảm thuế', visible: false },
    { key: 'khach_can_tra', label: 'Khách cần trả', visible: false },
    { key: 'khach_da_tra', label: 'Khách đã trả', visible: true },
    { key: 'chiet_khau_thanh_toan', label: 'Chiết khấu thanh toán', visible: false },
    { key: 'thoi_gian_giao_hang', label: 'Thời gian giao hàng', visible: false },
    { key: 'trang_thai', label: 'Trạng thái', visible: false },
    { key: 'trang_thai_hddt', label: 'Trạng thái HĐDT', visible: true }
  ];

  // Chia columns thành 2 cột với spacing compact
  const leftColumns = allColumns.slice(0, Math.ceil(allColumns.length / 2));
  const rightColumns = allColumns.slice(Math.ceil(allColumns.length / 2));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-sm border-current theme-text theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary">
          <Filter className="h-4 w-4 mr-2 theme-text-primary" />
          Hiển thị cột
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-4 theme-card border theme-border-primary shadow-lg z-50" align="end" sideOffset={8}>
        <div className="space-y-3">
          <ScrollArea className="h-auto max-h-[400px]">
            <div className="grid grid-cols-2 gap-6 pr-3">
              {/* Cột trái */}
              <div className="space-y-2">
                {leftColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id={column.key}
                      checked={column.visible}
                      onCheckedChange={(checked) => onColumnToggle(column.key, checked as boolean)}
                      className="h-4 w-4 flex-shrink-0"
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm theme-text cursor-pointer select-none flex-1 leading-5"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Cột phải */}
              <div className="space-y-2">
                {rightColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id={column.key}
                      checked={column.visible}
                      onCheckedChange={(checked) => onColumnToggle(column.key, checked as boolean)}
                      className="h-4 w-4 flex-shrink-0"
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm theme-text cursor-pointer select-none flex-1 leading-5"
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
