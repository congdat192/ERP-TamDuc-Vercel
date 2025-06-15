
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiSelectFilter } from '../../inventory/components/filters/MultiSelectFilter';
import { TimePresetSelector } from '../../inventory/components/filters/TimePresetSelector';
import { ThreeStateButtonGroup } from '../../inventory/components/filters/ThreeStateButtonGroup';

export function CustomerFilters() {
  // Multi-select states
  const [selectedCustomerGroups, setSelectedCustomerGroups] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [selectedDeliveryAreas, setSelectedDeliveryAreas] = useState<string[]>([]);

  // Time filter states
  const [createDatePreset, setCreateDatePreset] = useState('');
  const [createDateRange, setCreateDateRange] = useState<[Date?, Date?]>([undefined, undefined]);
  const [birthdayPreset, setBirthdayPreset] = useState('');
  const [birthdayRange, setBirthdayRange] = useState<[Date?, Date?]>([undefined, undefined]);
  const [lastTransactionPreset, setLastTransactionPreset] = useState('');
  const [lastTransactionRange, setLastTransactionRange] = useState<[Date?, Date?]>([undefined, undefined]);

  // Button group states
  const [customerType, setCustomerType] = useState<'all' | 'yes' | 'no'>('all');
  const [gender, setGender] = useState<'all' | 'yes' | 'no'>('all');
  const [status, setStatus] = useState<'all' | 'yes' | 'no'>('all');

  // Number range states
  const [totalSalesFrom, setTotalSalesFrom] = useState('');
  const [totalSalesTo, setTotalSalesTo] = useState('');
  const [debtFrom, setDebtFrom] = useState('');
  const [debtTo, setDebtTo] = useState('');
  const [debtDaysFrom, setDebtDaysFrom] = useState('');
  const [debtDaysTo, setDebtDaysTo] = useState('');
  const [pointsFrom, setPointsFrom] = useState('');
  const [pointsTo, setPointsTo] = useState('');

  // Options for multi-select filters
  const customerGroupOptions = [
    { value: 'vip', label: 'VIP' },
    { value: 'regular', label: 'Thường' },
    { value: 'wholesale', label: 'Bán sỉ' },
    { value: 'retail', label: 'Khách lẻ' }
  ];

  const branchOptions = [
    { value: 'hcm', label: 'Chi nhánh HCM' },
    { value: 'hanoi', label: 'Chi nhánh Hà Nội' },
    { value: 'danang', label: 'Chi nhánh Đà Nẵng' },
    { value: 'cantho', label: 'Chi nhánh Cần Thơ' }
  ];

  const creatorOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'staff-a', label: 'Nhân viên A' },
    { value: 'staff-b', label: 'Nhân viên B' },
    { value: 'staff-c', label: 'Nhân viên C' },
    { value: 'manager', label: 'Manager' }
  ];

  const deliveryAreaOptions = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' },
    { value: 'vungtau', label: 'Vũng Tàu' },
    { value: 'nhatrang', label: 'Nha Trang' },
    { value: 'hue', label: 'Huế' }
  ];

  const clearAllFilters = () => {
    setSelectedCustomerGroups([]);
    setSelectedBranches([]);
    setSelectedCreators([]);
    setSelectedDeliveryAreas([]);
    setCreateDatePreset('');
    setCreateDateRange([undefined, undefined]);
    setBirthdayPreset('');
    setBirthdayRange([undefined, undefined]);
    setLastTransactionPreset('');
    setLastTransactionRange([undefined, undefined]);
    setCustomerType('all');
    setGender('all');
    setStatus('all');
    setTotalSalesFrom('');
    setTotalSalesTo('');
    setDebtFrom('');
    setDebtTo('');
    setDebtDaysFrom('');
    setDebtDaysTo('');
    setPointsFrom('');
    setPointsTo('');
  };

  return (
    <div className="space-y-[10px]">
      {/* 1. Nhóm khách hàng */}
      <MultiSelectFilter
        label="Nhóm khách hàng"
        placeholder="Chọn nhóm khách hàng"
        options={customerGroupOptions}
        selectedValues={selectedCustomerGroups}
        onSelectionChange={setSelectedCustomerGroups}
      />

      {/* 2. Chi nhánh tạo */}
      <MultiSelectFilter
        label="Chi nhánh tạo"
        placeholder="Chọn chi nhánh"
        options={branchOptions}
        selectedValues={selectedBranches}
        onSelectionChange={setSelectedBranches}
      />

      {/* 3. Ngày tạo */}
      <TimePresetSelector
        label="Ngày tạo"
        type="created"
        value={createDatePreset}
        onChange={setCreateDatePreset}
        customRange={createDateRange}
        onCustomRangeChange={setCreateDateRange}
      />

      {/* 4. Người tạo */}
      <MultiSelectFilter
        label="Người tạo"
        placeholder="Chọn người tạo"
        options={creatorOptions}
        selectedValues={selectedCreators}
        onSelectionChange={setSelectedCreators}
      />

      {/* 5. Loại khách hàng */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Loại khách hàng</label>
        <div className="grid grid-cols-3 gap-1">
          <Button
            variant={customerType === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType('all')}
            className={`text-xs h-8 rounded-md ${
              customerType === 'all'
                ? "voucher-button-primary" 
                : "theme-border-primary hover:theme-bg-primary/10"
            }`}
          >
            Tất cả
          </Button>
          <Button
            variant={customerType === 'yes' ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType('yes')}
            className={`text-xs h-8 rounded-md ${
              customerType === 'yes'
                ? "voucher-button-primary" 
                : "theme-border-primary hover:theme-bg-primary/10"
            }`}
          >
            Cá nhân
          </Button>
          <Button
            variant={customerType === 'no' ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType('no')}
            className={`text-xs h-8 rounded-md ${
              customerType === 'no'
                ? "voucher-button-primary" 
                : "theme-border-primary hover:theme-bg-primary/10"
            }`}
          >
            Công ty
          </Button>
        </div>
      </div>

      {/* 6. Giới tính */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Giới tính</label>
        <div className="grid grid-cols-3 gap-1">
          <Button
            variant={gender === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setGender('all')}
            className={`text-xs h-8 rounded-md ${
              gender === 'all'
                ? "voucher-button-primary" 
                : "theme-border-primary hover:theme-bg-primary/10"
            }`}
          >
            Tất cả
          </Button>
          <Button
            variant={gender === 'yes' ? "default" : "outline"}
            size="sm"
            onClick={() => setGender('yes')}
            className={`text-xs h-8 rounded-md ${
              gender === 'yes'
                ? "voucher-button-primary" 
                : "theme-border-primary hover:theme-bg-primary/10"
            }`}
          >
            Nam
          </Button>
          <Button
            variant={gender === 'no' ? "default" : "outline"}
            size="sm"
            onClick={() => setGender('no')}
            className={`text-xs h-8 rounded-md ${
              gender === 'no'
                ? "voucher-button-primary" 
                : "theme-border-primary hover:theme-bg-primary/10"
            }`}
          >
            Nữ
          </Button>
        </div>
      </div>

      {/* 7. Sinh nhật */}
      <TimePresetSelector
        label="Sinh nhật"
        type="created"
        value={birthdayPreset}
        onChange={setBirthdayPreset}
        customRange={birthdayRange}
        onCustomRangeChange={setBirthdayRange}
      />

      {/* 8. Ngày giao dịch cuối */}
      <TimePresetSelector
        label="Ngày giao dịch cuối"
        type="created"
        value={lastTransactionPreset}
        onChange={setLastTransactionPreset}
        customRange={lastTransactionRange}
        onCustomRangeChange={setLastTransactionRange}
      />

      {/* 9. Tổng bán */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Tổng bán</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={totalSalesFrom}
            onChange={(e) => setTotalSalesFrom(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={totalSalesTo}
            onChange={(e) => setTotalSalesTo(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
        </div>
      </div>

      {/* 10. Nợ hiện tại */}
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

      {/* 11. Số ngày nợ */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Số ngày nợ</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={debtDaysFrom}
            onChange={(e) => setDebtDaysFrom(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={debtDaysTo}
            onChange={(e) => setDebtDaysTo(e.target.value)}
            className="voucher-input h-10 rounded-md text-sm"
          />
        </div>
      </div>

      {/* 12. Điểm hiện tại */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Điểm hiện tại</label>
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

      {/* 13. Khu vực giao hàng */}
      <MultiSelectFilter
        label="Khu vực giao hàng"
        placeholder="Chọn khu vực"
        options={deliveryAreaOptions}
        selectedValues={selectedDeliveryAreas}
        onSelectionChange={setSelectedDeliveryAreas}
      />

      {/* 14. Trạng thái */}
      <div className="space-y-2">
        <label className="text-sm font-medium theme-text">Trạng thái</label>
        <div className="space-y-1">
          {/* Hàng 1: Tất cả và Đang hoạt động */}
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant={status === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus('all')}
              className={`text-xs h-8 rounded-md ${
                status === 'all'
                  ? "voucher-button-primary" 
                  : "theme-border-primary hover:theme-bg-primary/10"
              }`}
            >
              Tất cả
            </Button>
            <Button
              variant={status === 'yes' ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus('yes')}
              className={`text-xs h-8 rounded-md ${
                status === 'yes'
                  ? "voucher-button-primary" 
                  : "theme-border-primary hover:theme-bg-primary/10"
              }`}
            >
              Đang hoạt động
            </Button>
          </div>
          {/* Hàng 2: Ngừng hoạt động */}
          <div className="grid grid-cols-1">
            <Button
              variant={status === 'no' ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus('no')}
              className={`text-xs h-8 rounded-md ${
                status === 'no'
                  ? "voucher-button-primary" 
                  : "theme-border-primary hover:theme-bg-primary/10"
              }`}
            >
              Ngừng hoạt động
            </Button>
          </div>
        </div>
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
