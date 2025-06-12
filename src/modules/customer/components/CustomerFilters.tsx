
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CustomerFiltersProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isMobile: boolean;
}

export function CustomerFilters({ onClearFilters, onApplyFilters, isMobile }: CustomerFiltersProps) {
  // Filter states
  const [customerType, setCustomerType] = useState('all');
  const [customerGroup, setCustomerGroup] = useState('all');
  const [customerSource, setCustomerSource] = useState('all');
  const [province, setProvince] = useState('all');
  const [district, setDistrict] = useState('all');
  const [ward, setWard] = useState('all');
  const [gender, setGender] = useState('all');
  const [ageRange, setAgeRange] = useState('all');
  const [pointsRange, setPointsRange] = useState('all');
  const [debtStatus, setDebtStatus] = useState('all');
  const [createdDateType, setCreatedDateType] = useState<'preset' | 'custom'>('preset');
  const [createdDatePreset, setCreatedDatePreset] = useState('this-month');
  const [createdDateRange, setCreatedDateRange] = useState<{from?: Date; to?: Date}>({});
  const [lastTransactionType, setLastTransactionType] = useState<'preset' | 'custom'>('preset');
  const [lastTransactionPreset, setLastTransactionPreset] = useState('last-30-days');
  const [lastTransactionRange, setLastTransactionRange] = useState<{from?: Date; to?: Date}>({});
  const [vipLevel, setVipLevel] = useState('all');
  const [birthMonth, setBirthMonth] = useState('all');
  const [emailSubscription, setEmailSubscription] = useState(false);
  const [smsSubscription, setSmsSubscription] = useState(false);

  const handleClearAll = () => {
    setCustomerType('all');
    setCustomerGroup('all');
    setCustomerSource('all');
    setProvince('all');
    setDistrict('all');
    setWard('all');
    setGender('all');
    setAgeRange('all');
    setPointsRange('all');
    setDebtStatus('all');
    setCreatedDateType('preset');
    setCreatedDatePreset('this-month');
    setCreatedDateRange({});
    setLastTransactionType('preset');
    setLastTransactionPreset('last-30-days');
    setLastTransactionRange({});
    setVipLevel('all');
    setBirthMonth('all');
    setEmailSubscription(false);
    setSmsSubscription(false);
    onClearFilters();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <ScrollArea className="flex-1 px-1">
        <div className="space-y-[10px] py-1">
          {/* Customer Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Loại khách hàng</label>
            <Select value={customerType} onValueChange={setCustomerType}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="individual">Cá nhân</SelectItem>
                <SelectItem value="business">Doanh nghiệp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Group */}
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
                <SelectItem value="wholesale">Sỉ</SelectItem>
                <SelectItem value="retail">Lẻ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Nguồn khách hàng</label>
            <Select value={customerSource} onValueChange={setCustomerSource}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="referral">Giới thiệu</SelectItem>
                <SelectItem value="direct">Trực tiếp</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location - Province */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Tỉnh/Thành phố</label>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="hanoi">Hà Nội</SelectItem>
                <SelectItem value="danang">Đà Nẵng</SelectItem>
                <SelectItem value="cantho">Cần Thơ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location - District */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Quận/Huyện</label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="q1">Quận 1</SelectItem>
                <SelectItem value="q3">Quận 3</SelectItem>
                <SelectItem value="q7">Quận 7</SelectItem>
                <SelectItem value="tanbinh">Tân Bình</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location - Ward */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Phường/Xã</label>
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="ward1">Phường 1</SelectItem>
                <SelectItem value="ward2">Phường 2</SelectItem>
                <SelectItem value="ward3">Phường 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
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
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Độ tuổi</label>
            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-45">36-45</SelectItem>
                <SelectItem value="46-55">46-55</SelectItem>
                <SelectItem value="56+">56+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Points Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Khoảng điểm</label>
            <Select value={pointsRange} onValueChange={setPointsRange}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="0-100">0-100</SelectItem>
                <SelectItem value="101-500">101-500</SelectItem>
                <SelectItem value="501-1000">501-1000</SelectItem>
                <SelectItem value="1000+">1000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Debt Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Tình trạng công nợ</label>
            <Select value={debtStatus} onValueChange={setDebtStatus}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="no-debt">Không công nợ</SelectItem>
                <SelectItem value="has-debt">Có công nợ</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Created Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Ngày tạo</label>
            <RadioGroup value={createdDateType} onValueChange={(value: 'preset' | 'custom') => setCreatedDateType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preset" id="created-preset" />
                <label htmlFor="created-preset" className="text-sm theme-text">Chọn nhanh</label>
              </div>
              {createdDateType === 'preset' && (
                <Select value={createdDatePreset} onValueChange={setCreatedDatePreset}>
                  <SelectTrigger className="voucher-input h-10 rounded-md ml-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="yesterday">Hôm qua</SelectItem>
                    <SelectItem value="this-week">Tuần này</SelectItem>
                    <SelectItem value="last-week">Tuần trước</SelectItem>
                    <SelectItem value="this-month">Tháng này</SelectItem>
                    <SelectItem value="last-month">Tháng trước</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="created-custom" />
                <label htmlFor="created-custom" className="text-sm theme-text">Tùy chỉnh</label>
              </div>
              {createdDateType === 'custom' && (
                <div className="ml-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-sm h-10">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {createdDateRange.from && createdDateRange.to
                          ? `${createdDateRange.from.toLocaleDateString('vi-VN')} - ${createdDateRange.to.toLocaleDateString('vi-VN')}`
                          : 'Chọn khoảng thời gian'
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{ from: createdDateRange.from, to: createdDateRange.to }}
                        onSelect={(range) => setCreatedDateRange({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Last Transaction */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Giao dịch cuối</label>
            <RadioGroup value={lastTransactionType} onValueChange={(value: 'preset' | 'custom') => setLastTransactionType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preset" id="transaction-preset" />
                <label htmlFor="transaction-preset" className="text-sm theme-text">Chọn nhanh</label>
              </div>
              {lastTransactionType === 'preset' && (
                <Select value={lastTransactionPreset} onValueChange={setLastTransactionPreset}>
                  <SelectTrigger className="voucher-input h-10 rounded-md ml-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                    <SelectItem value="last-7-days">7 ngày qua</SelectItem>
                    <SelectItem value="last-30-days">30 ngày qua</SelectItem>
                    <SelectItem value="last-3-months">3 tháng qua</SelectItem>
                    <SelectItem value="last-6-months">6 tháng qua</SelectItem>
                    <SelectItem value="last-year">1 năm qua</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="transaction-custom" />
                <label htmlFor="transaction-custom" className="text-sm theme-text">Tùy chỉnh</label>
              </div>
              {lastTransactionType === 'custom' && (
                <div className="ml-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-sm h-10">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lastTransactionRange.from && lastTransactionRange.to
                          ? `${lastTransactionRange.from.toLocaleDateString('vi-VN')} - ${lastTransactionRange.to.toLocaleDateString('vi-VN')}`
                          : 'Chọn khoảng thời gian'
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{ from: lastTransactionRange.from, to: lastTransactionRange.to }}
                        onSelect={(range) => setLastTransactionRange({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* VIP Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Cấp VIP</label>
            <Select value={vipLevel} onValueChange={setVipLevel}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="bronze">Đồng</SelectItem>
                <SelectItem value="silver">Bạc</SelectItem>
                <SelectItem value="gold">Vàng</SelectItem>
                <SelectItem value="diamond">Kim cương</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Birth Month */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Tháng sinh</label>
            <Select value={birthMonth} onValueChange={setBirthMonth}>
              <SelectTrigger className="voucher-input h-10 rounded-md">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="theme-card border theme-border-primary rounded-lg z-50">
                <SelectItem value="all">Tất cả</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    Tháng {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium theme-text">Đăng ký nhận tin</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email-subscription"
                  checked={emailSubscription}
                  onCheckedChange={setEmailSubscription}
                />
                <label htmlFor="email-subscription" className="text-sm theme-text">Email</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sms-subscription"
                  checked={smsSubscription}
                  onCheckedChange={setSmsSubscription}
                />
                <label htmlFor="sms-subscription" className="text-sm theme-text">SMS</label>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="flex-shrink-0 space-y-[5px] pt-[10px] border-t border-border">
        <Button onClick={onApplyFilters} className="w-full voucher-button-primary h-10 rounded-md">
          Áp dụng bộ lọc
        </Button>
        <Button onClick={handleClearAll} variant="outline" className="w-full theme-border-primary h-10 rounded-md">
          Đặt lại
        </Button>
      </div>
    </div>
  );
}
