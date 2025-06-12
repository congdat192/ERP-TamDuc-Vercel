import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';
import { MultiSelectFilter } from '../../../inventory/components/filters/MultiSelectFilter';

interface SalesFiltersProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isMobile: boolean;
}

export function SalesFilters({ onClearFilters, onApplyFilters, isMobile }: SalesFiltersProps) {
  // Multi-select states
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [selectedPriceLists, setSelectedPriceLists] = useState<string[]>([]);
  const [selectedSalesChannels, setSelectedSalesChannels] = useState<string[]>([]);
  
  const [timeFilterType, setTimeFilterType] = useState<'quick' | 'custom'>('quick');
  const [selectedQuickTime, setSelectedQuickTime] = useState('this-month');
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});
  const [statusFilters, setStatusFilters] = useState({
    completed: true,
    canceled: false
  });

  // Options for dropdown filters
  const branchOptions = [
    { value: 'tan-binh', label: '01. Tân Bình' },
    { value: 'q11', label: 'Chi nhánh Q11' },
    { value: 'thu-duc', label: 'Thủ Đức' },
    { value: 'binh-thanh', label: 'Bình Thạnh' },
    { value: 'district-1', label: 'Quận 1' },
    { value: 'district-3', label: 'Quận 3' }
  ];

  const paymentMethodOptions = [
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'card', label: 'Thẻ' },
    { value: 'transfer', label: 'Chuyển khoản' },
    { value: 'points', label: 'Điểm' },
    { value: 'voucher', label: 'Voucher' }
  ];

  const creatorOptions = [
    { value: 'user1', label: 'Nguyễn Văn A' },
    { value: 'user2', label: 'Trần Thị B' },
    { value: 'user3', label: 'Lê Văn C' },
    { value: 'user4', label: 'Phạm Thị D' }
  ];

  const sellerOptions = [
    { value: 'seller1', label: 'Lê Văn C' },
    { value: 'seller2', label: 'Phạm Thị D' },
    { value: 'seller3', label: 'Hoàng Văn E' },
    { value: 'seller4', label: 'Ngô Thị F' }
  ];

  const priceListOptions = [
    { value: 'standard', label: 'Bảng giá chuẩn' },
    { value: 'vip', label: 'Bảng giá VIP' },
    { value: 'wholesale', label: 'Bảng giá sỉ' },
    { value: 'retail', label: 'Bảng giá lẻ' }
  ];

  const salesChannelOptions = [
    { value: 'store', label: 'Cửa hàng' },
    { value: 'online', label: 'Online' },
    { value: 'phone', label: 'Điện thoại' },
    { value: 'social', label: 'Mạng xã hội' }
  ];

  // Quick time options organized by tabs
  const quickTimeOptions = {
    day: [
      { value: 'today', label: 'Hôm nay' },
      { value: 'yesterday', label: 'Hôm qua' }
    ],
    week: [
      { value: 'this-week', label: 'Tuần này' },
      { value: 'last-week', label: 'Tuần trước' },
      { value: 'last-7-days', label: '7 ngày qua' }
    ],
    month: [
      { value: 'this-month', label: 'Tháng này' },
      { value: 'last-month', label: 'Tháng trước' },
      { value: 'this-month-lunar', label: 'Tháng này (âm lịch)' },
      { value: 'last-month-lunar', label: 'Tháng trước (âm lịch)' },
      { value: 'last-30-days', label: '30 ngày qua' }
    ],
    quarter: [
      { value: 'this-quarter', label: 'Quý này' },
      { value: 'last-quarter', label: 'Quý trước' }
    ],
    year: [
      { value: 'this-year', label: 'Năm nay' },
      { value: 'last-year', label: 'Năm trước' },
      { value: 'this-year-lunar', label: 'Năm nay (âm lịch)' },
      { value: 'last-year-lunar', label: 'Năm trước (âm lịch)' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Chi nhánh */}
      <MultiSelectFilter
        label="Chi nhánh"
        placeholder="Chọn chi nhánh"
        options={branchOptions}
        selectedValues={selectedBranches}
        onSelectionChange={setSelectedBranches}
      />

      {/* Time Period - keep existing implementation */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Thời gian</label>
        <RadioGroup value={timeFilterType} onValueChange={(value: 'quick' | 'custom') => setTimeFilterType(value)} className="space-y-4">
          <div className="flex items-center space-x-3 min-h-[36px]">
            <RadioGroupItem value="quick" id="quick" />
            <label htmlFor="quick" className="text-sm theme-text cursor-pointer">Chọn nhanh</label>
          </div>
          
          {timeFilterType === 'quick' && (
            <div className="ml-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs min-h-[36px] theme-border-primary">
                    <span className="theme-text">
                      {quickTimeOptions.month.find(opt => opt.value === selectedQuickTime)?.label || 'Tháng này'}
                    </span>
                    <ChevronDown className="ml-auto h-3 w-3 theme-text-primary" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 theme-card border theme-border-primary">
                  <Tabs defaultValue="month" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 text-xs h-10">
                      <TabsTrigger value="day" className="text-xs">Ngày</TabsTrigger>
                      <TabsTrigger value="week" className="text-xs">Tuần</TabsTrigger>
                      <TabsTrigger value="month" className="text-xs">Tháng</TabsTrigger>
                      <TabsTrigger value="quarter" className="text-xs">Quý</TabsTrigger>
                      <TabsTrigger value="year" className="text-xs">Năm</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(quickTimeOptions).map(([key, options]) => (
                      <TabsContent key={key} value={key} className="p-2 space-y-1">
                        <ScrollArea className="h-auto max-h-40">
                          <div className="space-y-1 pr-4">
                            {options.map((option) => (
                              <Button
                                key={option.value}
                                variant={selectedQuickTime === option.value ? "default" : "ghost"}
                                size="sm"
                                className="w-full justify-start text-xs min-h-[36px]"
                                onClick={() => setSelectedQuickTime(option.value)}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <div className="flex items-center space-x-3 min-h-[36px]">
            <RadioGroupItem value="custom" id="custom" />
            <label htmlFor="custom" className="text-sm theme-text cursor-pointer">Tùy chỉnh</label>
          </div>
          
          {timeFilterType === 'custom' && (
            <div className="ml-6 space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs min-h-[36px] theme-border-primary">
                    <Calendar className="mr-2 h-3 w-3 theme-text-primary" />
                    <span className="theme-text">
                      {dateRange.from && dateRange.to 
                        ? `${dateRange.from.toLocaleDateString('vi-VN')} - ${dateRange.to.toLocaleDateString('vi-VN')}`
                        : 'Chọn khoảng thời gian'
                      }
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 theme-card border theme-border-primary" align="start">
                  <div className="p-3 space-y-3">
                    <div className="flex space-x-2">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        className="rounded-md border theme-border-primary"
                      />
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        className="rounded-md border theme-border-primary"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setDateRange({ from: new Date(), to: new Date() })}>
                        Hôm nay
                      </Button>
                      <Button size="sm" variant="outline">
                        Áp dụng
                      </Button>
                      <Button size="sm" variant="ghost">
                        Hủy
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </RadioGroup>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Trạng thái</label>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 min-h-[36px]">
            <Checkbox 
              id="completed"
              checked={statusFilters.completed}
              onCheckedChange={(checked) => 
                setStatusFilters(prev => ({ ...prev, completed: checked as boolean }))
              }
            />
            <label htmlFor="completed" className="text-sm theme-text cursor-pointer">Hoàn thành</label>
          </div>
          <div className="flex items-center space-x-3 min-h-[36px]">
            <Checkbox 
              id="canceled"
              checked={statusFilters.canceled}
              onCheckedChange={(checked) => 
                setStatusFilters(prev => ({ ...prev, canceled: checked as boolean }))
              }
            />
            <label htmlFor="canceled" className="text-sm theme-text cursor-pointer">Đã hủy</label>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <MultiSelectFilter
        label="Phương thức thanh toán"
        placeholder="Chọn phương thức thanh toán"
        options={paymentMethodOptions}
        selectedValues={selectedPaymentMethods}
        onSelectionChange={setSelectedPaymentMethods}
      />

      {/* Creator */}
      <MultiSelectFilter
        label="Người tạo"
        placeholder="Chọn người tạo"
        options={creatorOptions}
        selectedValues={selectedCreators}
        onSelectionChange={setSelectedCreators}
      />

      {/* Seller */}
      <MultiSelectFilter
        label="Người bán"
        placeholder="Chọn người bán"
        options={sellerOptions}
        selectedValues={selectedSellers}
        onSelectionChange={setSelectedSellers}
      />

      {/* Price List */}
      <MultiSelectFilter
        label="Bảng giá"
        placeholder="Chọn bảng giá"
        options={priceListOptions}
        selectedValues={selectedPriceLists}
        onSelectionChange={setSelectedPriceLists}
      />

      {/* Sales Channel */}
      <div className="space-y-3">
        <MultiSelectFilter
          label="Kênh bán"
          placeholder="Chọn kênh bán"
          options={salesChannelOptions}
          selectedValues={selectedSalesChannels}
          onSelectionChange={setSelectedSalesChannels}
        />
        <Button variant="link" className="text-sm p-0 h-auto theme-text-primary hover:theme-text-primary/80">
          Tạo mới
        </Button>
      </div>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <div className="flex space-x-3 pt-4 border-t theme-border-primary/20">
          <Button variant="outline" className="flex-1" onClick={onClearFilters}>
            Xóa tất cả
          </Button>
          <Button className="flex-1" onClick={onApplyFilters}>
            Áp dụng
          </Button>
        </div>
      )}
    </div>
  );
}
