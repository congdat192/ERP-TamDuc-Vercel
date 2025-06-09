
import { useState } from 'react';
import { X, Calendar, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CustomerFiltersProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export function CustomerFilters({ sidebarOpen, setSidebarOpen }: CustomerFiltersProps) {
  // Filter states
  const [customerGroup, setCustomerGroup] = useState('all');
  const [branch, setBranch] = useState('all');
  const [createDate, setCreateDate] = useState('all');
  const [creator, setCreator] = useState('all');
  const [customerType, setCustomerType] = useState('all');
  const [gender, setGender] = useState('all');
  const [birthday, setBirthday] = useState('all');
  const [lastTransaction, setLastTransaction] = useState('all');
  const [totalSales, setTotalSales] = useState('all');
  const [currentDebt, setCurrentDebt] = useState({ from: '', to: '' });
  const [debtDays, setDebtDays] = useState({ from: '', to: '' });
  const [currentPoints, setCurrentPoints] = useState({ from: '', to: '' });
  const [deliveryArea, setDeliveryArea] = useState('');
  const [status, setStatus] = useState('all');

  return (
    <>
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 
        fixed lg:relative 
        z-50 lg:z-auto
        w-[255px]
        theme-card border-r theme-border-primary 
        h-screen lg:min-h-[calc(100vh-120px)]
        transition-transform duration-300 ease-in-out
        overflow-y-auto
      `}>
        <div className="p-4">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 theme-text-primary" />
              <h3 className="font-semibold theme-text">Bộ lọc</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4 theme-text-primary" />
            </Button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center space-x-2 mb-4 pb-2 border-b theme-border-primary/20">
            <Filter className="w-5 h-5 theme-text-primary" />
            <h3 className="font-semibold theme-text">Bộ lọc khách hàng</h3>
          </div>

          <div className="space-y-4">
            {/* Nhóm khách hàng */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Nhóm khách hàng</h4>
              <select 
                value={customerGroup}
                onChange={(e) => setCustomerGroup(e.target.value)}
                className="w-full px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors theme-text"
              >
                <option value="all">Tất cả</option>
                <option value="vip">VIP</option>
                <option value="thuong">Thường</option>
                <option value="gioi-thieu">Giới thiệu</option>
              </select>
            </div>

            {/* Chi nhánh tạo */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Chi nhánh tạo</h4>
              <select 
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors theme-text"
              >
                <option value="all">Tất cả chi nhánh</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
              </select>
            </div>

            {/* Ngày tạo */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Ngày tạo</h4>
              <RadioGroup value={createDate} onValueChange={setCreateDate}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="create-all" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="create-all" className="text-sm theme-text cursor-pointer">
                    Toàn thời gian
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="create-custom" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="create-custom" className="text-sm theme-text cursor-pointer flex items-center">
                    Tùy chỉnh
                    <Calendar className="w-4 h-4 theme-text-muted ml-2" />
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Người tạo */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Người tạo</h4>
              <select 
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors theme-text"
              >
                <option value="all">Tất cả</option>
                <option value="admin">Admin</option>
                <option value="nhanvien1">Nhân viên 1</option>
                <option value="nhanvien2">Nhân viên 2</option>
              </select>
            </div>

            {/* Loại khách hàng */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Loại khách hàng</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="type-all" 
                    checked={customerType === 'all'} 
                    onCheckedChange={() => setCustomerType('all')}
                    className="theme-border-primary data-[state=checked]:theme-bg-primary"
                  />
                  <Label htmlFor="type-all" className="text-sm theme-text cursor-pointer">Tất cả</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="type-personal" 
                    checked={customerType === 'personal'} 
                    onCheckedChange={() => setCustomerType('personal')}
                    className="theme-border-primary data-[state=checked]:theme-bg-primary"
                  />
                  <Label htmlFor="type-personal" className="text-sm theme-text cursor-pointer">Cá nhân</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="type-company" 
                    checked={customerType === 'company'} 
                    onCheckedChange={() => setCustomerType('company')}
                    className="theme-border-primary data-[state=checked]:theme-bg-primary"
                  />
                  <Label htmlFor="type-company" className="text-sm theme-text cursor-pointer">Công ty</Label>
                </div>
              </div>
            </div>

            {/* Giới tính */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Giới tính</h4>
              <RadioGroup value={gender} onValueChange={setGender}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="gender-all" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="gender-all" className="text-sm theme-text cursor-pointer">Tất cả</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="gender-male" className="text-sm theme-text cursor-pointer">Nam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="gender-female" className="text-sm theme-text cursor-pointer">Nữ</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Sinh nhật */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Sinh nhật</h4>
              <RadioGroup value={birthday} onValueChange={setBirthday}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="birthday-all" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="birthday-all" className="text-sm theme-text cursor-pointer">Toàn thời gian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="birthday-custom" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="birthday-custom" className="text-sm theme-text cursor-pointer flex items-center">
                    Tùy chỉnh
                    <Calendar className="w-4 h-4 theme-text-muted ml-2" />
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Ngày giao dịch cuối */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Ngày giao dịch cuối</h4>
              <RadioGroup value={lastTransaction} onValueChange={setLastTransaction}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="transaction-all" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="transaction-all" className="text-sm theme-text cursor-pointer">Toàn thời gian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="transaction-custom" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="transaction-custom" className="text-sm theme-text cursor-pointer flex items-center">
                    Tùy chỉnh
                    <Calendar className="w-4 h-4 theme-text-muted ml-2" />
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Tổng bán */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Tổng bán</h4>
              <div className="space-y-2">
                <RadioGroup value={totalSales} onValueChange={setTotalSales}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="sales-all" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                    <Label htmlFor="sales-all" className="text-sm theme-text cursor-pointer">Toàn thời gian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="sales-custom" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                    <Label htmlFor="sales-custom" className="text-sm theme-text cursor-pointer">Tùy chỉnh</Label>
                  </div>
                </RadioGroup>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Từ" 
                    className="px-2 py-1.5 text-sm border theme-border-primary rounded voucher-input focus:theme-border-primary transition-colors theme-text" 
                  />
                  <input 
                    type="text" 
                    placeholder="Đến" 
                    className="px-2 py-1.5 text-sm border theme-border-primary rounded voucher-input focus:theme-border-primary transition-colors theme-text" 
                  />
                </div>
              </div>
            </div>

            {/* Nợ hiện tại */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Nợ hiện tại</h4>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Từ" 
                  value={currentDebt.from}
                  onChange={(e) => setCurrentDebt(prev => ({ ...prev, from: e.target.value }))}
                  className="px-2 py-1.5 text-sm border theme-border-primary rounded voucher-input focus:theme-border-primary transition-colors theme-text" 
                />
                <input 
                  type="text" 
                  placeholder="Đến" 
                  value={currentDebt.to}
                  onChange={(e) => setCurrentDebt(prev => ({ ...prev, to: e.target.value }))}
                  className="px-2 py-1.5 text-sm border theme-border-primary rounded voucher-input focus:theme-border-primary transition-colors theme-text" 
                />
              </div>
            </div>

            {/* Số ngày nợ */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Số ngày nợ</h4>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Từ" 
                  value={debtDays.from}
                  onChange={(e) => setDebtDays(prev => ({ ...prev, from: e.target.value }))}
                  className="px-2 py-1.5 text-sm border theme-border-primary rounded voucher-input focus:theme-border-primary transition-colors theme-text" 
                />
                <input 
                  type="text" 
                  placeholder="Đến" 
                  value={debtDays.to}
                  onChange={(e) => setDebtDays(prev => ({ ...prev, to: e.target.value }))}
                  className="px-2 py-1.5 text-sm border theme-border-primary rounded voucher-input focus:theme-border-primary transition-colors theme-text" 
                />
              </div>
            </div>

            {/* Điểm hiện tại */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Điểm hiện tại</h4>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Từ" 
                  value={currentPoints.from}
                  onChange={(e) => setCurrentPoints(prev => ({ ...prev, from: e.target.value }))}
                  className="px-2 py-1.5 text-sm border theme-border-primary rounded voucher-input focus:theme-border-primary transition-colors theme-text" 
                />
                <input 
                  type="text" 
                  placeholder="Đến" 
                  value={currentPoints.to}
                  onChange={(e) => setCurrentPoints(prev => ({ ...prev, to: e.target.value }))}
                  className="px-2 py-1.5 text-sm border theme-border-primary rounded voucher-input focus:theme-border-primary transition-colors theme-text" 
                />
              </div>
            </div>

            {/* Khu vực giao hàng */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Khu vực giao hàng</h4>
              <select 
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors theme-text"
              >
                <option value="">Chọn Tỉnh/TP - Quận/Huyện</option>
                <option value="hanoi-hoankiem">Hà Nội - Hoàn Kiếm</option>
                <option value="hcm-quan1">TP.HCM - Quận 1</option>
                <option value="hcm-quan3">TP.HCM - Quận 3</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div>
              <h4 className="font-medium theme-text mb-2 text-sm">Trạng thái</h4>
              <div className="space-y-2">
                <Button 
                  variant={status === 'all' ? 'default' : 'outline'}
                  size="sm" 
                  onClick={() => setStatus('all')}
                  className={`w-full justify-start text-sm ${
                    status === 'all' 
                      ? 'voucher-button-primary' 
                      : 'theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary'
                  }`}
                >
                  Tất cả
                </Button>
                <Button 
                  variant={status === 'active' ? 'default' : 'outline'}
                  size="sm" 
                  onClick={() => setStatus('active')}
                  className={`w-full justify-start text-sm ${
                    status === 'active' 
                      ? 'voucher-button-primary' 
                      : 'theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary'
                  }`}
                >
                  Đang hoạt động
                </Button>
                <Button 
                  variant={status === 'inactive' ? 'default' : 'outline'}
                  size="sm" 
                  onClick={() => setStatus('inactive')}
                  className={`w-full justify-start text-sm ${
                    status === 'inactive' 
                      ? 'voucher-button-primary' 
                      : 'theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary'
                  }`}
                >
                  Ngưng hoạt động
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
