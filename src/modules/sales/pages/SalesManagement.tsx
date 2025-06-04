import { useState } from 'react';
import { ArrowLeft, Search, Plus, ChevronDown, Calendar, X, Menu } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { ColumnVisibilityFilter, ColumnConfig } from '../components/ColumnVisibilityFilter';

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

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'invoiceCode', label: 'Mã hóa đơn', visible: true },
    { key: 'datetime', label: 'Thời gian', visible: true },
    { key: 'createdTime', label: 'Thời gian tạo', visible: false },
    { key: 'lastUpdated', label: 'Ngày cập nhật', visible: false },
    { key: 'orderCode', label: 'Mã đặt hàng', visible: false },
    { key: 'returnCode', label: 'Mã trả hàng', visible: true },
    { key: 'customer', label: 'Khách hàng', visible: true },
    { key: 'email', label: 'Email', visible: false },
    { key: 'phone', label: 'Điện thoại', visible: false },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'area', label: 'Khu vực', visible: false },
    { key: 'method', label: 'Phương/Xá', visible: false },
    { key: 'birthdate', label: 'Ngày sinh', visible: false },
    { key: 'branch', label: 'Chi nhánh', visible: false },
    { key: 'seller', label: 'Người bán', visible: false },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'channel', label: 'Kênh bán', visible: false },
    { key: 'note', label: 'Ghi chú', visible: false },
    { key: 'totalAmount', label: 'Tổng tiền hàng', visible: true },
    { key: 'discount', label: 'Giảm giá', visible: true },
    { key: 'tax', label: 'Giảm thuế', visible: false },
    { key: 'needToPay', label: 'Khách cần trả', visible: false },
    { key: 'paidAmount', label: 'Khách đã trả', visible: true },
    { key: 'totalDiscount', label: 'Chiết khấu thanh toán', visible: false },
    { key: 'deliveryTime', label: 'Thời gian giao hàng', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true },
    { key: 'invoiceStatus', label: 'Trạng thái HĐDT', visible: true }
  ]);

  const isMobile = useIsMobile();

  const handleColumnToggle = (columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

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
            <ScrollArea className="h-auto max-h-64">
              <div className="space-y-2 pr-4">
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
            </ScrollArea>
          </PopoverContent>
        </Popover>
        
        {/* Selected branch tags with horizontal scroll */}
        {selectedBranches.length > 0 && (
          <ScrollArea className="w-full">
            <div className="flex space-x-1 pb-2 min-w-max">
              {getBranchDisplayTags().map((tag) => (
                <Badge key={tag.value} variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
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
          </ScrollArea>
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
                          <ScrollArea className="h-auto max-h-40">
                            <div className="space-y-1 pr-4">
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
                            </div>
                          </ScrollArea>
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
            <h1 className="text-2xl font-bold text-gray-900">Hóa Đơn</h1>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Filter Sidebar */}
        {!isMobile && (
          <div className="w-64 max-w-64 bg-white border-r p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 text-base">Bộ lọc</h3>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="pr-4">
                <FilterContent />
              </div>
            </ScrollArea>
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
                
                {/* Column visibility filter */}
                {isMobile ? (
                  <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DrawerTrigger asChild>
                      <ColumnVisibilityFilter 
                        columns={columns} 
                        onColumnToggle={handleColumnToggle} 
                      />
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
                  <ColumnVisibilityFilter 
                    columns={columns} 
                    onColumnToggle={handleColumnToggle} 
                  />
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

          {/* Sales Table with proper ScrollArea */}
          <div className="bg-white rounded-lg border">
            <ScrollArea className="w-full">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.filter(col => col.visible).map((column) => (
                        <TableHead key={column.key} className="whitespace-nowrap min-w-[120px]">
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-gray-50">
                        {columns.filter(col => col.visible).map((column) => (
                          <TableCell key={column.key} className="whitespace-nowrap">
                            {column.key === 'invoiceCode' && sale.id}
                            {column.key === 'datetime' && sale.date}
                            {column.key === 'returnCode' && (
                              sale.returnCode ? (
                                <Badge variant="outline" className="text-orange-600">
                                  {sale.returnCode}
                                </Badge>
                              ) : null
                            )}
                            {column.key === 'customer' && sale.customer}
                            {column.key === 'totalAmount' && formatCurrency(sale.totalAmount)}
                            {column.key === 'discount' && (
                              <span className="text-red-600">
                                {sale.discount > 0 ? formatCurrency(sale.discount) : '-'}
                              </span>
                            )}
                            {column.key === 'paidAmount' && (
                              <span className="text-green-600">
                                {formatCurrency(sale.paidAmount)}
                              </span>
                            )}
                            {column.key === 'status' && (
                              <Badge 
                                variant={sale.status === 'Hoàn thành' ? 'default' : 'destructive'}
                                className={sale.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {sale.status}
                              </Badge>
                            )}
                            {column.key === 'invoiceStatus' && (
                              <Badge variant="outline">
                                Chưa có
                              </Badge>
                            )}
                            {/* Add default empty content for other columns */}
                            {!['invoiceCode', 'datetime', 'returnCode', 'customer', 'totalAmount', 'discount', 'paidAmount', 'status', 'invoiceStatus'].includes(column.key) && '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
