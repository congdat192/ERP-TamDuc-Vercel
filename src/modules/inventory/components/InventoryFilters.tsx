
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

interface InventoryFiltersProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isMobile: boolean;
}

export function InventoryFilters({ onClearFilters, onApplyFilters, isMobile }: InventoryFiltersProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [expiredDateFrom, setExpiredDateFrom] = useState<Date>();
  const [expiredDateTo, setExpiredDateTo] = useState<Date>();
  const [stockFrom, setStockFrom] = useState('');
  const [stockTo, setStockTo] = useState('');

  // Mock data
  const brands = ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'Nokia', 'Huawei', 'Realme'];
  const categories = ['Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện', 'Tai nghe', 'Sạc dự phòng'];
  const locations = ['Kho A1', 'Kho A2', 'Kho B1', 'Kho B2', 'Kho C1', 'Showroom 1', 'Showroom 2'];
  const productTypes = ['Hàng mới', 'Hàng cũ', 'Hàng trưng bày', 'Hàng thanh lý'];

  const handleMultiSelect = (value: string, selectedItems: string[], setSelectedItems: (items: string[]) => void) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter(item => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };

  const MultiSelectDropdown = ({ 
    label, 
    items, 
    selectedItems, 
    onSelectionChange, 
    placeholder 
  }: {
    label: string;
    items: string[];
    selectedItems: string[];
    onSelectionChange: (items: string[]) => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium theme-text">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between voucher-input h-10">
            <span className="truncate">
              {selectedItems.length > 0 
                ? `Đã chọn ${selectedItems.length} mục` 
                : placeholder
              }
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 theme-card" align="start">
          <div className="max-h-60 overflow-auto p-2">
            {items.map((item) => (
              <div key={item} className="flex items-center space-x-2 p-2 hover:theme-bg-primary/5 rounded">
                <Checkbox
                  id={item}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => handleMultiSelect(item, selectedItems, onSelectionChange)}
                />
                <label htmlFor={item} className="text-sm theme-text cursor-pointer flex-1">
                  {item}
                </label>
              </div>
            ))}
          </div>
          {selectedItems.length > 0 && (
            <div className="border-t p-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelectionChange([])}
                className="w-full"
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedItems.map((item) => (
            <span key={item} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
              {item}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => handleMultiSelect(item, selectedItems, onSelectionChange)}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const DateRangePicker = ({ 
    label, 
    fromDate, 
    toDate, 
    onFromChange, 
    onToChange 
  }: {
    label: string;
    fromDate?: Date;
    toDate?: Date;
    onFromChange: (date?: Date) => void;
    onToChange: (date?: Date) => void;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium theme-text">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start voucher-input h-10">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "dd/MM/yyyy") : "Từ ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 theme-card">
            <Calendar mode="single" selected={fromDate} onSelect={onFromChange} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start voucher-input h-10">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "dd/MM/yyyy") : "Đến ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 theme-card">
            <Calendar mode="single" selected={toDate} onSelect={onToChange} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  const RadioGroup = ({ label, options, value, onChange }: {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium theme-text">{label}</Label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
            className={`text-xs ${
              value === option.value 
                ? "voucher-button-primary" 
                : "theme-border-primary hover:theme-bg-primary/10"
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Thuộc tính */}
      <RadioGroup
        label="Thuộc tính"
        options={[
          { label: "Tất cả", value: "all" },
          { label: "Có", value: "yes" },
          { label: "Không", value: "no" }
        ]}
        value="all"
        onChange={() => {}}
      />

      {/* Vị trí */}
      <MultiSelectDropdown
        label="Vị trí"
        items={locations}
        selectedItems={selectedLocations}
        onSelectionChange={setSelectedLocations}
        placeholder="Chọn vị trí"
      />

      {/* Loại hàng */}
      <MultiSelectDropdown
        label="Loại hàng"
        items={productTypes}
        selectedItems={selectedProductTypes}
        onSelectionChange={setSelectedProductTypes}
        placeholder="Chọn loại hàng"
      />

      {/* Tích điểm */}
      <RadioGroup
        label="Tích điểm"
        options={[
          { label: "Tất cả", value: "all" },
          { label: "Có", value: "yes" },
          { label: "Không", value: "no" }
        ]}
        value="all"
        onChange={() => {}}
      />

      {/* Bán trực tiếp */}
      <RadioGroup
        label="Bán trực tiếp"
        options={[
          { label: "Tất cả", value: "all" },
          { label: "Có", value: "yes" },
          { label: "Không", value: "no" }
        ]}
        value="all"
        onChange={() => {}}
      />

      {/* Liên kết kênh bán */}
      <RadioGroup
        label="Liên kết kênh bán"
        options={[
          { label: "Tất cả", value: "all" },
          { label: "Có", value: "yes" },
          { label: "Không", value: "no" }
        ]}
        value="all"
        onChange={() => {}}
      />

      {/* Trạng thái hàng hóa */}
      <RadioGroup
        label="Trạng thái hàng hóa"
        options={[
          { label: "Tất cả", value: "all" },
          { label: "Đang bán", value: "active" },
          { label: "Ngừng bán", value: "inactive" }
        ]}
        value="all"
        onChange={() => {}}
      />

      {/* Nhóm hàng */}
      <MultiSelectDropdown
        label="Nhóm hàng"
        items={categories}
        selectedItems={selectedCategories}
        onSelectionChange={setSelectedCategories}
        placeholder="Chọn nhóm hàng"
      />

      {/* Tồn kho */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Tồn kho</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={stockFrom}
            onChange={(e) => setStockFrom(e.target.value)}
            className="voucher-input h-10"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={stockTo}
            onChange={(e) => setStockTo(e.target.value)}
            className="voucher-input h-10"
          />
        </div>
      </div>

      {/* Dự kiến hết hàng */}
      <DateRangePicker
        label="Dự kiến hết hàng"
        fromDate={expiredDateFrom}
        toDate={expiredDateTo}
        onFromChange={setExpiredDateFrom}
        onToChange={setExpiredDateTo}
      />

      {/* Thời gian tạo */}
      <DateRangePicker
        label="Thời gian tạo"
        fromDate={dateFrom}
        toDate={dateTo}
        onFromChange={setDateFrom}
        onToChange={setDateTo}
      />

      {/* Thương hiệu */}
      <MultiSelectDropdown
        label="Thương hiệu"
        items={brands}
        selectedItems={selectedBrands}
        onSelectionChange={setSelectedBrands}
        placeholder="Chọn thương hiệu"
      />

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button onClick={onApplyFilters} className="w-full voucher-button-primary">
          Áp dụng bộ lọc
        </Button>
        <Button onClick={onClearFilters} variant="outline" className="w-full theme-border-primary">
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
}
