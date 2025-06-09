import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';

interface SalesFiltersProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isMobile: boolean;
}

export function SalesFilters({ onClearFilters, onApplyFilters, isMobile }: SalesFiltersProps) {
  // Branch state
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [timeFilterType, setTimeFilterType] = useState<'quick' | 'custom'>('quick');
  const [selectedQuickTime, setSelectedQuickTime] = useState('this-month');
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});
  const [statusFilters, setStatusFilters] = useState({
    completed: true,
    canceled: false
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [creator, setCreator] = useState('');
  const [seller, setSeller] = useState('');
  const [priceList, setPriceList] = useState('');
  const [salesChannel, setSalesChannel] = useState('');

  // Branch options
  const branchOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'tan-binh', label: '01. Tân Bình' },
    { value: 'q11', label: 'Chi nhánh Q11' },
    { value: 'thu-duc', label: 'Thủ Đức' },
    { value: 'binh-thanh', label: 'Bình Thạnh' },
    { value: 'district-1', label: 'Quận 1' },
    { value: 'district-3', label: 'Quận 3' }
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

  const handleBranchSelect = (branchValue: string) => {
    if (branchValue === 'all') {
      if (selectedBranches.includes('all')) {
        setSelectedBranches([]);
      } else {
        setSelectedBranches(['all', ...branchOptions.slice(1).map(b => b.value)]);
      }
    } else {
      const newSelection = selectedBranches.includes(branchValue)
        ? selectedBranches.filter(b => b !== branchValue && b !== 'all')
        : [...selectedBranches.filter(b => b !== 'all'), branchValue];
      
      if (newSelection.length === branchOptions.length - 1) {
        setSelectedBranches(['all', ...newSelection]);
      } else {
        setSelectedBranches(newSelection);
      }
    }
  };

  const removeBranch = (branchValue: string) => {
    if (branchValue === 'all') {
      setSelectedBranches([]);
    } else {
      setSelectedBranches(selectedBranches.filter(b => b !== branchValue && b !== 'all'));
    }
  };

  const getBranchDisplayTags = () => {
    const nonAllBranches = selectedBranches.filter(b => b !== 'all');
    if (selectedBranches.includes('all')) {
      return [{ value: 'all', label: 'Tất cả' }];
    }
    if (nonAllBranches.length <= 2) {
      return nonAllBranches.map(b => branchOptions.find(opt => opt.value === b)!);
    }
    return [
      ...nonAllBranches.slice(0, 2).map(b => branchOptions.find(opt => opt.value === b)!),
      { value: 'more', label: `+${nonAllBranches.length - 2} khác` }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Branch Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Chi nhánh</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-sm theme-border-primary">
              <span className="theme-text-muted">Chọn chi nhánh</span>
              <ChevronDown className="ml-auto h-4 w-4 theme-text-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3 theme-card border theme-border-primary">
            <ScrollArea className="h-auto max-h-64">
              <div className="space-y-3 pr-4">
                {branchOptions.map((branch) => (
                  <div key={branch.value} className="flex items-center space-x-3 min-h-[36px]">
                    <Checkbox 
                      id={branch.value}
                      checked={selectedBranches.includes(branch.value)}
                      onCheckedChange={() => handleBranchSelect(branch.value)}
                      className="flex-shrink-0"
                    />
                    <label htmlFor={branch.value} className="text-sm cursor-pointer theme-text leading-relaxed flex-1">
                      {branch.label}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        
        {/* Selected branch tags with horizontal scroll */}
        {selectedBranches.length > 0 && (
          <ScrollArea className="w-full">
            <div className="flex space-x-1 pb-2 min-w-max">
              {getBranchDisplayTags().map((tag) => (
                <Badge key={tag.value} variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0 theme-badge-primary">
                  {tag.label}
                  {tag.value !== 'more' && (
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer hover:theme-text-primary transition-colors" 
                      onClick={() => removeBranch(tag.value)}
                    />
                  )}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Time Period */}
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
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Phương thức thanh toán</label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="text-sm min-h-[36px]">
            <SelectValue placeholder="Chọn phương thức thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Tiền mặt</SelectItem>
            <SelectItem value="card">Thẻ</SelectItem>
            <SelectItem value="transfer">Chuyển khoản</SelectItem>
            <SelectItem value="points">Điểm</SelectItem>
            <SelectItem value="voucher">Voucher</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Creator */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Người tạo</label>
        <Select value={creator} onValueChange={setCreator}>
          <SelectTrigger className="text-sm min-h-[36px]">
            <SelectValue placeholder="Chọn người tạo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user1">Nguyễn Văn A</SelectItem>
            <SelectItem value="user2">Trần Thị B</SelectItem>
            <SelectItem value="user3">Lê Văn C</SelectItem>
            <SelectItem value="user4">Phạm Thị D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Seller */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Người bán</label>
        <Select value={seller} onValueChange={setSeller}>
          <SelectTrigger className="text-sm min-h-[36px]">
            <SelectValue placeholder="Chọn người bán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seller1">Lê Văn C</SelectItem>
            <SelectItem value="seller2">Phạm Thị D</SelectItem>
            <SelectItem value="seller3">Hoàng Văn E</SelectItem>
            <SelectItem value="seller4">Ngô Thị F</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price List */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Bảng giá</label>
        <Select value={priceList} onValueChange={setPriceList}>
          <SelectTrigger className="text-sm min-h-[36px]">
            <SelectValue placeholder="Chọn bảng giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Bảng giá chuẩn</SelectItem>
            <SelectItem value="vip">Bảng giá VIP</SelectItem>
            <SelectItem value="wholesale">Bảng giá sỉ</SelectItem>
            <SelectItem value="retail">Bảng giá lẻ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sales Channel */}
      <div className="space-y-3">
        <label className="text-sm font-medium theme-text">Kênh bán</label>
        <div className="space-y-2">
          <Select value={salesChannel} onValueChange={setSalesChannel}>
            <SelectTrigger className="text-sm min-h-[36px]">
              <SelectValue placeholder="Chọn kênh bán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="store">Cửa hàng</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="phone">Điện thoại</SelectItem>
              <SelectItem value="social">Mạng xã hội</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="link" className="text-sm p-0 h-auto theme-text-primary hover:theme-text-primary/80">
            Tạo mới
          </Button>
        </div>
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
