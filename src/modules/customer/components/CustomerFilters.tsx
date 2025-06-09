import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Filter } from 'lucide-react';

interface CustomerFiltersProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function CustomerFilters({ sidebarOpen, setSidebarOpen }: CustomerFiltersProps) {
  const [customerGroup, setCustomerGroup] = useState('all');
  const [branch, setBranch] = useState('all');
  const [creator, setCreator] = useState('all');
  const [customerType, setCustomerType] = useState('all');
  const [gender, setGender] = useState('all');
  const [birthdayRange, setBirthdayRange] = useState('all');
  const [lastTransactionRange, setLastTransactionRange] = useState('all');
  const [totalSalesRange, setTotalSalesRange] = useState('all');
  const [currentDebtFrom, setCurrentDebtFrom] = useState('');
  const [currentDebtTo, setCurrentDebtTo] = useState('');
  const [debtDaysFrom, setDebtDaysFrom] = useState('');
  const [debtDaysTo, setDebtDaysTo] = useState('');
  const [currentPointsFrom, setCurrentPointsFrom] = useState('');
  const [currentPointsTo, setCurrentPointsTo] = useState('');
  const [province, setProvince] = useState('all');
  const [district, setDistrict] = useState('all');
  const [status, setStatus] = useState('all');

  const resetFilters = () => {
    setCustomerGroup('all');
    setBranch('all');
    setCreator('all');
    setCustomerType('all');
    setGender('all');
    setBirthdayRange('all');
    setLastTransactionRange('all');
    setTotalSalesRange('all');
    setCurrentDebtFrom('');
    setCurrentDebtTo('');
    setDebtDaysFrom('');
    setDebtDaysTo('');
    setCurrentPointsFrom('');
    setCurrentPointsTo('');
    setProvince('all');
    setDistrict('all');
    setStatus('all');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[260px] flex-shrink-0">
        <Card className="theme-card h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold theme-text flex items-center">
              <Filter className="w-5 h-5 mr-2 voucher-text-primary" />
              Bộ lọc
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="px-4 pb-4 space-y-4">
                {/* Nhóm khách hàng */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Nhóm khách hàng</Label>
                  <Select value={customerGroup} onValueChange={setCustomerGroup}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="1">1.Giới thiệu</SelectItem>
                      <SelectItem value="2">2.Khách VIP</SelectItem>
                      <SelectItem value="3">3.Khách thường</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="theme-border-primary" />

                {/* Chi nhánh tạo */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Chi nhánh tạo</Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn chi nhánh" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="hcm">Chi nhánh HCM</SelectItem>
                      <SelectItem value="hanoi">Chi nhánh Hà Nội</SelectItem>
                      <SelectItem value="danang">Chi nhánh Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="theme-border-primary" />

                {/* Ngày tạo */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Ngày tạo</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Từ ngày"
                      className="voucher-input voucher-border-primary"
                    />
                    <Input
                      type="date"
                      placeholder="Đến ngày"
                      className="voucher-input voucher-border-primary"
                    />
                  </div>
                </div>

                <Separator className="theme-border-primary" />

                {/* Người tạo */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Người tạo</Label>
                  <Select value={creator} onValueChange={setCreator}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn người tạo" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user1">Người dùng 1</SelectItem>
                      <SelectItem value="user2">Người dùng 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="theme-border-primary" />

                {/* Loại khách hàng */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium theme-text">Loại khách hàng</Label>
                  <RadioGroup value={customerType} onValueChange={setCustomerType} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="type-all" className="voucher-radio" />
                      <Label htmlFor="type-all" className="text-sm theme-text cursor-pointer">Tất cả</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="type-individual" className="voucher-radio" />
                      <Label htmlFor="type-individual" className="text-sm theme-text cursor-pointer">Cá nhân</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="type-company" className="voucher-radio" />
                      <Label htmlFor="type-company" className="text-sm theme-text cursor-pointer">Công ty</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="theme-border-primary" />

                {/* Giới tính */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium theme-text">Giới tính</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="gender-all" className="voucher-radio" />
                      <Label htmlFor="gender-all" className="text-sm theme-text cursor-pointer">Tất cả</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" className="voucher-radio" />
                      <Label htmlFor="gender-male" className="text-sm theme-text cursor-pointer">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" className="voucher-radio" />
                      <Label htmlFor="gender-female" className="text-sm theme-text cursor-pointer">Nữ</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="theme-border-primary" />

                {/* Sinh nhật */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Sinh nhật</Label>
                  <Select value={birthdayRange} onValueChange={setBirthdayRange}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Toàn thời gian</SelectItem>
                      <SelectItem value="this-month">Tháng này</SelectItem>
                      <SelectItem value="next-month">Tháng tới</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                  {birthdayRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="date"
                        placeholder="Từ ngày"
                        className="voucher-input voucher-border-primary"
                      />
                      <Input
                        type="date"
                        placeholder="Đến ngày"
                        className="voucher-input voucher-border-primary"
                      />
                    </div>
                  )}
                </div>

                <Separator className="theme-border-primary" />

                {/* Ngày giao dịch cuối */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Ngày giao dịch cuối</Label>
                  <Select value={lastTransactionRange} onValueChange={setLastTransactionRange}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Toàn thời gian</SelectItem>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="this-week">Tuần này</SelectItem>
                      <SelectItem value="this-month">Tháng này</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                  {lastTransactionRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="date"
                        placeholder="Từ ngày"
                        className="voucher-input voucher-border-primary"
                      />
                      <Input
                        type="date"
                        placeholder="Đến ngày"
                        className="voucher-input voucher-border-primary"
                      />
                    </div>
                  )}
                </div>

                <Separator className="theme-border-primary" />

                {/* Tổng bán */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Tổng bán</Label>
                  <Select value={totalSalesRange} onValueChange={setTotalSalesRange}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Toàn thời gian</SelectItem>
                      <SelectItem value="this-month">Tháng này</SelectItem>
                      <SelectItem value="this-year">Năm này</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                  {totalSalesRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Từ"
                        className="voucher-input voucher-border-primary"
                      />
                      <Input
                        type="number"
                        placeholder="Đến"
                        className="voucher-input voucher-border-primary"
                      />
                    </div>
                  )}
                </div>

                <Separator className="theme-border-primary" />

                {/* Nợ hiện tại */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Nợ hiện tại</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={currentDebtFrom}
                      onChange={(e) => setCurrentDebtFrom(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={currentDebtTo}
                      onChange={(e) => setCurrentDebtTo(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                  </div>
                </div>

                <Separator className="theme-border-primary" />

                {/* Số ngày nợ */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Số ngày nợ</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={debtDaysFrom}
                      onChange={(e) => setDebtDaysFrom(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={debtDaysTo}
                      onChange={(e) => setDebtDaysTo(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                  </div>
                </div>

                <Separator className="theme-border-primary" />

                {/* Điểm hiện tại */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Điểm hiện tại</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={currentPointsFrom}
                      onChange={(e) => setCurrentPointsFrom(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={currentPointsTo}
                      onChange={(e) => setCurrentPointsTo(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                  </div>
                </div>

                <Separator className="theme-border-primary" />

                {/* Khu vực giao hàng */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Khu vực giao hàng</Label>
                  <Select value={province} onValueChange={setProvince}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn Tỉnh/TP" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="hanoi">Hà Nội</SelectItem>
                      <SelectItem value="danang">Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn Quận/Huyện" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="q1">Quận 1</SelectItem>
                      <SelectItem value="q2">Quận 2</SelectItem>
                      <SelectItem value="q3">Quận 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="theme-border-primary" />

                {/* Trạng thái */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium theme-text">Trạng thái</Label>
                  <RadioGroup value={status} onValueChange={setStatus} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="status-all" className="voucher-radio" />
                      <Label htmlFor="status-all" className="text-sm theme-text cursor-pointer">Tất cả</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="status-active" className="voucher-radio" />
                      <Label htmlFor="status-active" className="text-sm theme-text cursor-pointer">Đang hoạt động</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="status-inactive" className="voucher-radio" />
                      <Label htmlFor="status-inactive" className="text-sm theme-text cursor-pointer">Ngừng hoạt động</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Reset button */}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full voucher-border-primary hover:voucher-bg-primary/10 hover:voucher-text-primary"
                  >
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Card className="theme-card h-full">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold theme-text flex items-center">
              <Filter className="w-5 h-5 mr-2 voucher-text-primary" />
              Bộ lọc
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 p-0 hover:voucher-bg-primary/10"
            >
              <X className="w-4 h-4 voucher-text-primary" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="px-4 pb-4 space-y-4">
                {/* Nhóm khách hàng */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Nhóm khách hàng</Label>
                  <Select value={customerGroup} onValueChange={setCustomerGroup}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="1">1.Giới thiệu</SelectItem>
                      <SelectItem value="2">2.Khách VIP</SelectItem>
                      <SelectItem value="3">3.Khách thường</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="theme-border-primary" />

                {/* Chi nhánh tạo */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Chi nhánh tạo</Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn chi nhánh" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="hcm">Chi nhánh HCM</SelectItem>
                      <SelectItem value="hanoi">Chi nhánh Hà Nội</SelectItem>
                      <SelectItem value="danang">Chi nhánh Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="theme-border-primary" />

                {/* Ngày tạo */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Ngày tạo</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Từ ngày"
                      className="voucher-input voucher-border-primary"
                    />
                    <Input
                      type="date"
                      placeholder="Đến ngày"
                      className="voucher-input voucher-border-primary"
                    />
                  </div>
                </div>

                <Separator className="theme-border-primary" />

                {/* Người tạo */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Người tạo</Label>
                  <Select value={creator} onValueChange={setCreator}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn người tạo" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user1">Người dùng 1</SelectItem>
                      <SelectItem value="user2">Người dùng 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="theme-border-primary" />

                {/* Loại khách hàng */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium theme-text">Loại khách hàng</Label>
                  <RadioGroup value={customerType} onValueChange={setCustomerType} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="type-all-mobile" className="voucher-radio" />
                      <Label htmlFor="type-all-mobile" className="text-sm theme-text cursor-pointer">Tất cả</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="type-individual-mobile" className="voucher-radio" />
                      <Label htmlFor="type-individual-mobile" className="text-sm theme-text cursor-pointer">Cá nhân</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="type-company-mobile" className="voucher-radio" />
                      <Label htmlFor="type-company-mobile" className="text-sm theme-text cursor-pointer">Công ty</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="theme-border-primary" />

                {/* Giới tính */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium theme-text">Giới tính</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="gender-all-mobile" className="voucher-radio" />
                      <Label htmlFor="gender-all-mobile" className="text-sm theme-text cursor-pointer">Tất cả</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male-mobile" className="voucher-radio" />
                      <Label htmlFor="gender-male-mobile" className="text-sm theme-text cursor-pointer">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female-mobile" className="voucher-radio" />
                      <Label htmlFor="gender-female-mobile" className="text-sm theme-text cursor-pointer">Nữ</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="theme-border-primary" />

                {/* Sinh nhật */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Sinh nhật</Label>
                  <Select value={birthdayRange} onValueChange={setBirthdayRange}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Toàn thời gian</SelectItem>
                      <SelectItem value="this-month">Tháng này</SelectItem>
                      <SelectItem value="next-month">Tháng tới</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                  {birthdayRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="date"
                        placeholder="Từ ngày"
                        className="voucher-input voucher-border-primary"
                      />
                      <Input
                        type="date"
                        placeholder="Đến ngày"
                        className="voucher-input voucher-border-primary"
                      />
                    </div>
                  )}
                </div>

                <Separator className="theme-border-primary" />

                {/* Ngày giao dịch cuối */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Ngày giao dịch cuối</Label>
                  <Select value={lastTransactionRange} onValueChange={setLastTransactionRange}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Toàn thời gian</SelectItem>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="this-week">Tuần này</SelectItem>
                      <SelectItem value="this-month">Tháng này</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                  {lastTransactionRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="date"
                        placeholder="Từ ngày"
                        className="voucher-input voucher-border-primary"
                      />
                      <Input
                        type="date"
                        placeholder="Đến ngày"
                        className="voucher-input voucher-border-primary"
                      />
                    </div>
                  )}
                </div>

                <Separator className="theme-border-primary" />

                {/* Tổng bán */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Tổng bán</Label>
                  <Select value={totalSalesRange} onValueChange={setTotalSalesRange}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Toàn thời gian</SelectItem>
                      <SelectItem value="this-month">Tháng này</SelectItem>
                      <SelectItem value="this-year">Năm này</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                  {totalSalesRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Từ"
                        className="voucher-input voucher-border-primary"
                      />
                      <Input
                        type="number"
                        placeholder="Đến"
                        className="voucher-input voucher-border-primary"
                      />
                    </div>
                  )}
                </div>

                <Separator className="theme-border-primary" />

                {/* Nợ hiện tại */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Nợ hiện tại</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={currentDebtFrom}
                      onChange={(e) => setCurrentDebtFrom(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={currentDebtTo}
                      onChange={(e) => setCurrentDebtTo(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                  </div>
                </div>

                <Separator className="theme-border-primary" />

                {/* Số ngày nợ */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Số ngày nợ</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={debtDaysFrom}
                      onChange={(e) => setDebtDaysFrom(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={debtDaysTo}
                      onChange={(e) => setDebtDaysTo(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                  </div>
                </div>

                <Separator className="theme-border-primary" />

                {/* Điểm hiện tại */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Điểm hiện tại</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={currentPointsFrom}
                      onChange={(e) => setCurrentPointsFrom(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={currentPointsTo}
                      onChange={(e) => setCurrentPointsTo(e.target.value)}
                      className="voucher-input voucher-border-primary"
                    />
                  </div>
                </div>

                <Separator className="theme-border-primary" />

                {/* Khu vực giao hàng */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium theme-text">Khu vực giao hàng</Label>
                  <Select value={province} onValueChange={setProvince}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn Tỉnh/TP" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="hanoi">Hà Nội</SelectItem>
                      <SelectItem value="danang">Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="voucher-input voucher-border-primary">
                      <SelectValue placeholder="Chọn Quận/Huyện" />
                    </SelectTrigger>
                    <SelectContent className="theme-card voucher-border-primary">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="q1">Quận 1</SelectItem>
                      <SelectItem value="q2">Quận 2</SelectItem>
                      <SelectItem value="q3">Quận 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="theme-border-primary" />

                {/* Trạng thái */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium theme-text">Trạng thái</Label>
                  <RadioGroup value={status} onValueChange={setStatus} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="status-all-mobile" className="voucher-radio" />
                      <Label htmlFor="status-all-mobile" className="text-sm theme-text cursor-pointer">Tất cả</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="status-active-mobile" className="voucher-radio" />
                      <Label htmlFor="status-active-mobile" className="text-sm theme-text cursor-pointer">Đang hoạt động</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="status-inactive-mobile" className="voucher-radio" />
                      <Label htmlFor="status-inactive-mobile" className="text-sm theme-text cursor-pointer">Ngừng hoạt động</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Reset button */}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full voucher-border-primary hover:voucher-bg-primary/10 hover:voucher-text-primary"
                  >
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
