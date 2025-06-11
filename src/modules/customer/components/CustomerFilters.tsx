
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

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

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Nhóm khách hàng */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Nhóm khách hàng</Label>
        <Select value={customerGroup} onValueChange={setCustomerGroup}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Chọn nhóm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="1">1.Giới thiệu</SelectItem>
            <SelectItem value="2">2.Khách VIP</SelectItem>
            <SelectItem value="3">3.Khách thường</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Chi nhánh tạo */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Chi nhánh tạo</Label>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Chọn chi nhánh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="hcm">Chi nhánh HCM</SelectItem>
            <SelectItem value="hanoi">Chi nhánh Hà Nội</SelectItem>
            <SelectItem value="danang">Chi nhánh Đà Nẵng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Ngày tạo */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Ngày tạo</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            placeholder="Từ ngày"
            className="h-9 text-sm"
          />
          <Input
            type="date"
            placeholder="Đến ngày"
            className="h-9 text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Người tạo */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Người tạo</Label>
        <Select value={creator} onValueChange={setCreator}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Chọn người tạo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user1">Người dùng 1</SelectItem>
            <SelectItem value="user2">Người dùng 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Loại khách hàng */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Loại khách hàng</Label>
        <RadioGroup value={customerType} onValueChange={setCustomerType} className="space-y-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="type-all" className="h-4 w-4" />
            <Label htmlFor="type-all" className="text-sm theme-text cursor-pointer">Tất cả</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="type-individual" className="h-4 w-4" />
            <Label htmlFor="type-individual" className="text-sm theme-text cursor-pointer">Cá nhân</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="type-company" className="h-4 w-4" />
            <Label htmlFor="type-company" className="text-sm theme-text cursor-pointer">Công ty</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Giới tính */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Giới tính</Label>
        <RadioGroup value={gender} onValueChange={setGender} className="space-y-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="gender-all" className="h-4 w-4" />
            <Label htmlFor="gender-all" className="text-sm theme-text cursor-pointer">Tất cả</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="gender-male" className="h-4 w-4" />
            <Label htmlFor="gender-male" className="text-sm theme-text cursor-pointer">Nam</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="gender-female" className="h-4 w-4" />
            <Label htmlFor="gender-female" className="text-sm theme-text cursor-pointer">Nữ</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Sinh nhật */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Sinh nhật</Label>
        <Select value={birthdayRange} onValueChange={setBirthdayRange}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
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
              className="h-9 text-sm"
            />
            <Input
              type="date"
              placeholder="Đến ngày"
              className="h-9 text-sm"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Ngày giao dịch cuối */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Ngày giao dịch cuối</Label>
        <Select value={lastTransactionRange} onValueChange={setLastTransactionRange}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
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
              className="h-9 text-sm"
            />
            <Input
              type="date"
              placeholder="Đến ngày"
              className="h-9 text-sm"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Tổng bán */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Tổng bán</Label>
        <Select value={totalSalesRange} onValueChange={setTotalSalesRange}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
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
              className="h-9 text-sm"
            />
            <Input
              type="number"
              placeholder="Đến"
              className="h-9 text-sm"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Nợ hiện tại */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Nợ hiện tại</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={currentDebtFrom}
            onChange={(e) => setCurrentDebtFrom(e.target.value)}
            className="h-9 text-sm"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={currentDebtTo}
            onChange={(e) => setCurrentDebtTo(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Số ngày nợ */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Số ngày nợ</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={debtDaysFrom}
            onChange={(e) => setDebtDaysFrom(e.target.value)}
            className="h-9 text-sm"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={debtDaysTo}
            onChange={(e) => setDebtDaysTo(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Điểm hiện tại */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Điểm hiện tại</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={currentPointsFrom}
            onChange={(e) => setCurrentPointsFrom(e.target.value)}
            className="h-9 text-sm"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={currentPointsTo}
            onChange={(e) => setCurrentPointsTo(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Khu vực giao hàng */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Khu vực giao hàng</Label>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Chọn Tỉnh/TP" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
            <SelectItem value="hanoi">Hà Nội</SelectItem>
            <SelectItem value="danang">Đà Nẵng</SelectItem>
          </SelectContent>
        </Select>
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Chọn Quận/Huyện" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="q1">Quận 1</SelectItem>
            <SelectItem value="q2">Quận 2</SelectItem>
            <SelectItem value="q3">Quận 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label className="text-sm font-medium theme-text">Trạng thái</Label>
        <RadioGroup value={status} onValueChange={setStatus} className="space-y-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="status-all" className="h-4 w-4" />
            <Label htmlFor="status-all" className="text-sm theme-text cursor-pointer">Tất cả</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="status-active" className="h-4 w-4" />
            <Label htmlFor="status-active" className="text-sm theme-text cursor-pointer">Đang hoạt động</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inactive" id="status-inactive" className="h-4 w-4" />
            <Label htmlFor="status-inactive" className="text-sm theme-text cursor-pointer">Ngừng hoạt động</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Reset button */}
      <div className="pt-4">
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full h-9 text-sm"
        >
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Content */}
      <div className="hidden lg:block">
        <ScrollArea className="h-full">
          <div className="p-4">
            <FilterContent />
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Filter Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="fixed left-0 top-0 h-full w-80 theme-card border-r theme-border-primary">
            <div className="flex items-center justify-between p-4 border-b theme-border-primary">
              <h3 className="font-semibold theme-text text-base">Bộ lọc</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-73px)]">
              <div className="p-4">
                <FilterContent />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
}
