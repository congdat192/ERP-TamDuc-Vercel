
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CustomerFiltersBarProps {
  onFilterChange: (filters: CustomerFilters) => void;
}

export interface CustomerFilters {
  search: string;
  group: string;
  source: string;
  status: string;
  voucherRange: { min: string; max: string };
  spentRange: { min: string; max: string };
  dateRange: { from: string; to: string };
}

export function CustomerFiltersBar({ onFilterChange }: CustomerFiltersBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    group: 'all',
    source: 'all',
    status: 'all',
    voucherRange: { min: '', max: '' },
    spentRange: { min: '', max: '' },
    dateRange: { from: '', to: '' }
  });

  const updateFilter = (key: keyof CustomerFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters: CustomerFilters = {
      search: '',
      group: 'all',
      source: 'all',
      status: 'all',
      voucherRange: { min: '', max: '' },
      spentRange: { min: '', max: '' },
      dateRange: { from: '', to: '' }
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return filters.search !== '' || 
           filters.group !== 'all' || 
           filters.source !== 'all' || 
           filters.status !== 'all' ||
           filters.voucherRange.min !== '' || 
           filters.voucherRange.max !== '' ||
           filters.spentRange.min !== '' || 
           filters.spentRange.max !== '' ||
           filters.dateRange.from !== '' || 
           filters.dateRange.to !== '';
  };

  return (
    <div className="space-y-4">
      {/* Search bar và toggle filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên, số điện thoại, email..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              {hasActiveFilters() && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {hasActiveFilters() && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Advanced filters */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Nhóm khách hàng */}
                <div className="space-y-2">
                  <label className="text-sm font-medium theme-text">Nhóm khách hàng</label>
                  <Select value={filters.group} onValueChange={(value) => updateFilter('group', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="Thường">Thường</SelectItem>
                      <SelectItem value="Tiềm năng">Tiềm năng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Nguồn khách hàng */}
                <div className="space-y-2">
                  <label className="text-sm font-medium theme-text">Nguồn khách hàng</label>
                  <Select value={filters.source} onValueChange={(value) => updateFilter('source', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="KiotViet">KiotViet</SelectItem>
                      <SelectItem value="Voucher Campaign">Voucher Campaign</SelectItem>
                      <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trạng thái */}
                <div className="space-y-2">
                  <label className="text-sm font-medium theme-text">Trạng thái</label>
                  <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Số voucher */}
                <div className="space-y-2">
                  <label className="text-sm font-medium theme-text">Số voucher</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={filters.voucherRange.min}
                      onChange={(e) => updateFilter('voucherRange', { ...filters.voucherRange, min: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={filters.voucherRange.max}
                      onChange={(e) => updateFilter('voucherRange', { ...filters.voucherRange, max: e.target.value })}
                    />
                  </div>
                </div>

                {/* Tổng chi tiêu */}
                <div className="space-y-2">
                  <label className="text-sm font-medium theme-text">Tổng chi tiêu (VNĐ)</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={filters.spentRange.min}
                      onChange={(e) => updateFilter('spentRange', { ...filters.spentRange, min: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={filters.spentRange.max}
                      onChange={(e) => updateFilter('spentRange', { ...filters.spentRange, max: e.target.value })}
                    />
                  </div>
                </div>

                {/* Ngày tạo */}
                <div className="space-y-2">
                  <label className="text-sm font-medium theme-text">Ngày tạo</label>
                  <div className="flex space-x-2">
                    <Input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, from: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, to: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
