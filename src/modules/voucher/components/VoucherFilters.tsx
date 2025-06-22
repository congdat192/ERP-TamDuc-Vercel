
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { X, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MultiSelectFilter } from './MultiSelectFilter';

export interface VoucherFilters {
  search: string;
  status: string[];
  issuedBy: string[];
  denomination: string[];
  invoiceReconciliation: string;
  customerGeneratedInvoice: string;
  voucherReconciliationResult: string;
  issueDateFrom: Date | null;
  issueDateTo: Date | null;
  expiryDateFrom: Date | null;
  expiryDateTo: Date | null;
  usedDateFrom: Date | null;
  usedDateTo: Date | null;
  valueFrom: string;
  valueTo: string;
}

interface VoucherFiltersProps {
  filters: VoucherFilters;
  onFiltersChange: (filters: VoucherFilters) => void;
  availableIssuers: string[];
}

export function VoucherFilters({ filters, onFiltersChange, availableIssuers }: VoucherFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Đang Hoạt Động' },
    { value: 'used', label: 'Đã Sử Dụng' },
    { value: 'expired', label: 'Hết Hạn' },
    { value: 'cancelled', label: 'Đã Hủy' }
  ];

  const denominationOptions = [
    { value: '50000', label: '50.000đ' },
    { value: '100000', label: '100.000đ' },
    { value: '200000', label: '200.000đ' },
    { value: '300000', label: '300.000đ' },
    { value: '500000', label: '500.000đ' }
  ];

  const issuerOptions = availableIssuers.map(issuer => ({
    value: issuer,
    label: issuer
  }));

  const reconciliationResultOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'correct_voucher', label: 'Dùng Đúng Voucher' },
    { value: 'wrong_phone', label: 'Dùng Sai SĐT' },
    { value: 'wrong_voucher', label: 'Dùng Voucher Khác' },
    { value: 'not_used', label: 'Không Sử Dụng' },
    { value: 'no_invoice', label: 'Chưa Phát Sinh Đơn' }
  ];

  const updateFilters = (key: keyof VoucherFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: [],
      issuedBy: [],
      denomination: [],
      invoiceReconciliation: 'all',
      customerGeneratedInvoice: 'all',
      voucherReconciliationResult: 'all',
      issueDateFrom: null,
      issueDateTo: null,
      expiryDateFrom: null,
      expiryDateTo: null,
      usedDateFrom: null,
      usedDateTo: null,
      valueFrom: '',
      valueTo: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.issuedBy.length > 0) count++;
    if (filters.denomination.length > 0) count++;
    if (filters.invoiceReconciliation !== 'all') count++;
    if (filters.customerGeneratedInvoice !== 'all') count++;
    if (filters.voucherReconciliationResult !== 'all') count++;
    if (filters.issueDateFrom || filters.issueDateTo) count++;
    if (filters.expiryDateFrom || filters.expiryDateTo) count++;
    if (filters.usedDateFrom || filters.usedDateTo) count++;
    if (filters.valueFrom || filters.valueTo) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Search and Filter Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo mã voucher, tên khách hàng, số điện thoại..."
            value={filters.search}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="theme-border-primary/20"
          />
        </div>
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap theme-border-primary/20 relative">
              <Filter className="w-4 h-4 mr-2" />
              Bộ Lọc
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs voucher-bg-primary voucher-text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[800px] max-h-[80vh] overflow-y-auto p-6" align="end">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium theme-text">Bộ Lọc Nâng Cao</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Xóa Tất Cả
                  </Button>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Status Filter */}
                  <MultiSelectFilter
                    label="Trạng Thái"
                    placeholder="Chọn trạng thái"
                    options={statusOptions}
                    selectedValues={filters.status}
                    onSelectionChange={(values) => updateFilters('status', values)}
                  />

                  {/* Denomination Filter */}
                  <MultiSelectFilter
                    label="Mệnh Giá"
                    placeholder="Chọn mệnh giá"
                    options={denominationOptions}
                    selectedValues={filters.denomination}
                    onSelectionChange={(values) => updateFilters('denomination', values)}
                  />

                  {/* Issued By Filter */}
                  <MultiSelectFilter
                    label="Người Phát Hành"
                    placeholder="Chọn người phát hành"
                    options={issuerOptions}
                    selectedValues={filters.issuedBy}
                    onSelectionChange={(values) => updateFilters('issuedBy', values)}
                  />

                  {/* Issue Date Range */}
                  <div>
                    <Label className="text-sm font-medium theme-text">Ngày Phát Hành</Label>
                    <div className="mt-2 flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1 h-9 text-sm justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.issueDateFrom ? format(filters.issueDateFrom, 'dd/MM/yyyy', { locale: vi }) : 'Từ ngày'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.issueDateFrom || undefined}
                            onSelect={(date) => updateFilters('issueDateFrom', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1 h-9 text-sm justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.issueDateTo ? format(filters.issueDateTo, 'dd/MM/yyyy', { locale: vi }) : 'Đến ngày'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.issueDateTo || undefined}
                            onSelect={(date) => updateFilters('issueDateTo', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Reconciliation Filters */}
                  <div>
                    <Label className="text-sm font-medium theme-text">Đối Soát Hóa Đơn</Label>
                    <Select value={filters.invoiceReconciliation} onValueChange={(value) => updateFilters('invoiceReconciliation', value)}>
                      <SelectTrigger className="mt-2 h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="reconciled">Đã Đối Soát</SelectItem>
                        <SelectItem value="not_reconciled">Chưa Đối Soát</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium theme-text">KH Phát Sinh Hóa Đơn</Label>
                    <Select value={filters.customerGeneratedInvoice} onValueChange={(value) => updateFilters('customerGeneratedInvoice', value)}>
                      <SelectTrigger className="mt-2 h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="yes">Có</SelectItem>
                        <SelectItem value="no">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium theme-text">Kết Quả Đối Soát</Label>
                    <Select value={filters.voucherReconciliationResult} onValueChange={(value) => updateFilters('voucherReconciliationResult', value)}>
                      <SelectTrigger className="mt-2 h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {reconciliationResultOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Value Range Filter */}
                  <div>
                    <Label className="text-sm font-medium theme-text">Khoảng Giá Trị</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        placeholder="Từ (VNĐ)"
                        value={filters.valueFrom}
                        onChange={(e) => updateFilters('valueFrom', e.target.value)}
                        type="number"
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="Đến (VNĐ)"
                        value={filters.valueTo}
                        onChange={(e) => updateFilters('valueTo', e.target.value)}
                        type="number"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display - Compact */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1 text-xs h-6">
              {statusOptions.find(opt => opt.value === status)?.label}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilters('status', filters.status.filter(s => s !== status))}
              />
            </Badge>
          ))}
          {filters.denomination.map((denom) => (
            <Badge key={denom} variant="secondary" className="flex items-center gap-1 text-xs h-6">
              {denominationOptions.find(opt => opt.value === denom)?.label}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilters('denomination', filters.denomination.filter(d => d !== denom))}
              />
            </Badge>
          ))}
          {filters.issuedBy.map((issuer) => (
            <Badge key={issuer} variant="secondary" className="flex items-center gap-1 text-xs h-6">
              {issuer}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilters('issuedBy', filters.issuedBy.filter(i => i !== issuer))}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
