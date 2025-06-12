
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';

interface CustomerFiltersProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function CustomerFilters({ sidebarOpen, setSidebarOpen }: CustomerFiltersProps) {
  // Filter states
  const [customerGroup, setCustomerGroup] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('');
  const [creator, setCreator] = useState('');
  const [createDateFrom, setCreateDateFrom] = useState('');
  const [createDateTo, setCreateDateTo] = useState('');
  const [lastTransactionFrom, setLastTransactionFrom] = useState('');
  const [lastTransactionTo, setLastTransactionTo] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [debtFrom, setDebtFrom] = useState('');
  const [debtTo, setDebtTo] = useState('');
  const [totalSpentFrom, setTotalSpentFrom] = useState('');
  const [totalSpentTo, setTotalSpentTo] = useState('');
  const [pointsFrom, setPointsFrom] = useState('');
  const [pointsTo, setPointsTo] = useState('');
  const [status, setStatus] = useState('');
  const [hasEmail, setHasEmail] = useState(false);
  const [hasBirthday, setHasBirthday] = useState(false);

  const handleHasEmailChange = (checked: CheckedState) => {
    setHasEmail(checked === true);
  };

  const handleHasBirthdayChange = (checked: CheckedState) => {
    setHasBirthday(checked === true);
  };

  const clearAllFilters = () => {
    setCustomerGroup('');
    setCustomerType('');
    setGender('');
    setAddress('');
    setBranch('');
    setCreator('');
    setCreateDateFrom('');
    setCreateDateTo('');
    setLastTransactionFrom('');
    setLastTransactionTo('');
    setBirthMonth('');
    setDebtFrom('');
    setDebtTo('');
    setTotalSpentFrom('');
    setTotalSpentTo('');
    setPointsFrom('');
    setPointsTo('');
    setStatus('');
    setHasEmail(false);
    setHasBirthday(false);
  };

  return (
    <div className="space-y-[10px]">
      {/* Nhóm khách hàng */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Nhóm khách hàng</label>
        <Select value={customerGroup} onValueChange={setCustomerGroup}>
          <SelectTrigger className="voucher-input h-10 rounded-md">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="regular">Thường</SelectItem>
            <SelectItem value="wholesale">Bán sỉ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loại khách hàng */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Loại khách hàng</label>
        <Select value={customerType} onValueChange={setCustomerType}>
          <SelectTrigger className="voucher-input h-10 rounded-md">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="individual">Cá nhân</SelectItem>
            <SelectItem value="company">Công ty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Giới tính */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Giới tính</label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="voucher-input h-10 rounded-md">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="male">Nam</SelectItem>
            <SelectItem value="female">Nữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Địa chỉ */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Địa chỉ</label>
        <Input
          placeholder="Nhập địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="voucher-input h-10 rounded-md"
        />
      </div>

      {/* Chi nhánh */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Chi nhánh</label>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="voucher-input h-10 rounded-md">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="hcm">Chi nhánh HCM</SelectItem>
            <SelectItem value="hanoi">Chi nhánh Hà Nội</SelectItem>
            <SelectItem value="danang">Chi nhánh Đà Nẵng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Người tạo */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Người tạo</label>
        <Select value={creator} onValueChange={setCreator}>
          <SelectTrigger className="voucher-input h-10 rounded-md">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff1">Nhân viên A</SelectItem>
            <SelectItem value="staff2">Nhân viên B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ngày tạo */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Ngày tạo</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            placeholder="Từ ngày"
            value={createDateFrom}
            onChange={(e) => setCreateDateFrom(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
          <Input
            type="date"
            placeholder="Đến ngày"
            value={createDateTo}
            onChange={(e) => setCreateDateTo(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Ngày giao dịch cuối */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Ngày giao dịch cuối</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            placeholder="Từ ngày"
            value={lastTransactionFrom}
            onChange={(e) => setLastTransactionFrom(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
          <Input
            type="date"
            placeholder="Đến ngày"
            value={lastTransactionTo}
            onChange={(e) => setLastTransactionTo(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Tháng sinh */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Tháng sinh</label>
        <Select value={birthMonth} onValueChange={setBirthMonth}>
          <SelectTrigger className="voucher-input h-10 rounded-md">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Tháng {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nợ hiện tại */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Nợ hiện tại</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={debtFrom}
            onChange={(e) => setDebtFrom(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={debtTo}
            onChange={(e) => setDebtTo(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Tổng bán */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Tổng bán</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={totalSpentFrom}
            onChange={(e) => setTotalSpentFrom(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={totalSpentTo}
            onChange={(e) => setTotalSpentTo(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Điểm tích lũy */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Điểm tích lũy</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={pointsFrom}
            onChange={(e) => setPointsFrom(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={pointsTo}
            onChange={(e) => setPointsTo(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Trạng thái</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="voucher-input h-10 rounded-md">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Có email */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasEmail"
          checked={hasEmail}
          onCheckedChange={handleHasEmailChange}
          className="voucher-checkbox"
        />
        <label htmlFor="hasEmail" className="text-sm theme-text cursor-pointer">
          Có email
        </label>
      </div>

      {/* Có ngày sinh */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasBirthday"
          checked={hasBirthday}
          onCheckedChange={handleHasBirthdayChange}
          className="voucher-checkbox"
        />
        <label htmlFor="hasBirthday" className="text-sm theme-text cursor-pointer">
          Có ngày sinh
        </label>
      </div>

      {/* Clear filters button */}
      <div className="pt-[10px] border-t border-border">
        <Button onClick={clearAllFilters} variant="outline" className="w-full theme-border-primary h-10 rounded-md">
          Đặt lại
        </Button>
      </div>
    </div>
  );
}
