import { useState } from 'react';
import { ArrowLeft, Search, Filter, Plus, ChevronDown, Calendar, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface SalesManagementProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function SalesManagement({ currentUser, onBackToModules }: SalesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isMobile = useIsMobile();

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

  // Mock data for sales
  const salesData = [
    {
      id: 'HD001',
      date: '10/06/2024 14:30',
      returnCode: '',
      customer: 'Nguyễn Văn A',
      totalAmount: 1500000,
      discount: 50000,
      paidAmount: 1450000,
      status: 'Hoàn thành'
    },
    {
      id: 'HD002', 
      date: '10/06/2024 15:45',
      returnCode: 'TH001',
      customer: 'Trần Thị B',
      totalAmount: 2200000,
      discount: 100000,
      paidAmount: 2100000,
      status: 'Hoàn thành'
    },
    {
      id: 'HD003',
      date: '09/06/2024 09:15',
      returnCode: '',
      customer: 'Lê Văn C',
      totalAmount: 800000,
      discount: 0,
      paidAmount: 800000,
      status: 'Đã hủy'
    }
  ];

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const totalSales = salesData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalDiscount = salesData.reduce((sum, item) => sum + item.discount, 0);
  const totalPaid = salesData.reduce((sum, item) => sum + item.paidAmount, 0);

  const clearAllFilters = () => {
    setSelectedBranches([]);
    setTimeFilterType('quick');
    setSelectedQuickTime('this-month');
    setDateRange({});
    setStatusFilters({ completed: true, canceled: false });
    setPaymentMethod('');
    setCreator('');
    setSeller('');
    setPriceList('');
    setSalesChannel('');
  };

  const applyFilters = () => {
    // Apply filter logic here
    setIsFilterOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Branch Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Chi nhánh</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-sm">
              <span className="text-gray-500">Chọn chi nhánh</span>
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-2">
              {branchOptions.map((branch) => (
                <div key={branch.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={branch.value}
                    checked={selectedBranches.includes(branch.value)}
                    onCheckedChange={() => handleBranchSelect(branch.value)}
                  />
                  <label htmlFor={branch.value} className="text-sm cursor-pointer">
                    {branch.label}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Selected branch tags */}
        {selectedBranches.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {getBranchDisplayTags().map((tag) => (
              <Badge key={tag.value} variant="secondary" className="text-xs">
                {tag.label}
                {tag.value !== 'more' && (
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => removeBranch(tag.value)}
                  />
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Time Period */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Thời gian</label>
        <RadioGroup value={timeFilterType} onValueChange={(value: 'quick' | 'custom') => setTimeFilterType(value)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="quick" id="quick" />
              <label htmlFor="quick" className="text-sm">Chọn nhanh</label>
            </div>
            
            {timeFilterType === 'quick' && (
              <div className="ml-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <span>
                        {quickTimeOptions.month.find(opt => opt.value === selectedQuickTime)?.label || 'Tháng này'}
                      </span>
                      <ChevronDown className="ml-auto h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <Tabs defaultValue="month" className="w-full">
                      <TabsList className="grid w-full grid-cols-5 text-xs h-8">
                        <TabsTrigger value="day" className="text-xs">Ngày</TabsTrigger>
                        <TabsTrigger value="week" className="text-xs">Tuần</TabsTrigger>
                        <TabsTrigger value="month" className="text-xs">Tháng</TabsTrigger>
                        <TabsTrigger value="quarter" className="text-xs">Quý</TabsTrigger>
                        <TabsTrigger value="year" className="text-xs">Năm</TabsTrigger>
                      </TabsList>
                      
                      {Object.entries(quickTimeOptions).map(([key, options]) => (
                        <TabsContent key={key} value={key} className="p-2 space-y-1">
                          {options.map((option) => (
                            <Button
                              key={option.value}
                              variant={selectedQuickTime === option.value ? "default" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-xs h-8"
                              onClick={() => setSelectedQuickTime(option.value)}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <label htmlFor="custom" className="text-sm">Tùy chỉnh</label>
            </div>
            
            {timeFilterType === 'custom' && (
              <div className="ml-6 space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Calendar className="mr-2 h-3 w-3" />
                      <span>
                        {dateRange.from && dateRange.to 
                          ? `${dateRange.from.toLocaleDateString('vi-VN')} - ${dateRange.to.toLocaleDateString('vi-VN')}`
                          : 'Chọn khoảng thời gian'
                        }
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 space-y-3">
                      <div className="flex space-x-2">
                        <CalendarComponent
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                          className="rounded-md border"
                        />
                        <CalendarComponent
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                          className="rounded-md border"
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
          </div>
        </RadioGroup>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Trạng thái</label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="completed"
              checked={statusFilters.completed}
              onCheckedChange={(checked) => 
                setStatusFilters(prev => ({ ...prev, completed: checked as boolean }))
              }
            />
            <label htmlFor="completed" className="text-sm">Hoàn thành</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="canceled"
              checked={statusFilters.canceled}
              onCheckedChange={(checked) => 
                setStatusFilters(prev => ({ ...prev, canceled: checked as boolean }))
              }
            />
            <label htmlFor="canceled" className="text-sm">Đã hủy</label>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Phương thức thanh toán</label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="text-sm">
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
        <label className="text-sm font-medium text-gray-700">Người tạo</label>
        <Select value={creator} onValueChange={setCreator}>
          <SelectTrigger className="text-sm">
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
        <label className="text-sm font-medium text-gray-700">Người bán</label>
        <Select value={seller} onValueChange={setSeller}>
          <SelectTrigger className="text-sm">
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
        <label className="text-sm font-medium text-gray-700">Bảng giá</label>
        <Select value={priceList} onValueChange={setPriceList}>
          <SelectTrigger className="text-sm">
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
        <label className="text-sm font-medium text-gray-700">Kênh bán</label>
        <div className="space-y-2">
          <Select value={salesChannel} onValueChange={setSalesChannel}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Chọn kênh bán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="store">Cửa hàng</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="phone">Điện thoại</SelectItem>
              <SelectItem value="social">Mạng xã hội</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="link" className="text-sm p-0 h-auto text-blue-600 hover:text-blue-800">
            Tạo mới
          </Button>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <div className="flex space-x-3 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={clearAllFilters}>
            Xóa tất cả
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={applyFilters}>
            Áp dụng
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToModules}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay về ERP
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Bán Hàng</h1>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Filter Sidebar */}
        {!isMobile && (
          <div className="w-80 max-w-80 bg-white border-r p-6 space-y-6">
            <h3 className="font-semibold text-gray-900 text-lg">Bộ lọc</h3>
            <FilterContent />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search and Actions */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo mã hóa đơn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Mobile Filter Button */}
                {isMobile ? (
                  <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[85vh]">
                      <DrawerHeader>
                        <DrawerTitle>Bộ lọc</DrawerTitle>
                      </DrawerHeader>
                      <div className="px-4 pb-4 overflow-auto">
                        <FilterContent />
                      </div>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </Button>
                )}
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Hóa đơn
              </Button>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600">Tổng doanh thu</div>
                <div className="font-semibold text-lg">{formatCurrency(totalSales)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Tổng giảm giá</div>
                <div className="font-semibold text-lg text-red-600">{formatCurrency(totalDiscount)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Khách thanh toán</div>
                <div className="font-semibold text-lg text-green-600">{formatCurrency(totalPaid)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Số hóa đơn</div>
                <div className="font-semibold text-lg">{salesData.length}</div>
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-lg border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hóa đơn</TableHead>
                  <TableHead>Ngày/Giờ</TableHead>
                  <TableHead>Mã trả hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Khách thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      {sale.returnCode && (
                        <Badge variant="outline" className="text-orange-600">
                          {sale.returnCode}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                    <TableCell className="text-red-600">
                      {sale.discount > 0 ? formatCurrency(sale.discount) : '-'}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(sale.paidAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={sale.status === 'Hoàn thành' ? 'default' : 'destructive'}
                        className={sale.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
