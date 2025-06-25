
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface MarketingCustomer {
  id: string;
  name: string;
  phone: string;
  group: string;
  source: string;
  email: string;
  createdDate: string;
  status: 'active' | 'inactive';
  totalSpent: number;
  voucherCount: number;
}

interface CustomerColumnFilterProps {
  customers: MarketingCustomer[];
  onFilterChange: (filteredCustomers: MarketingCustomer[]) => void;
}

interface FilterState {
  name: string;
  phone: string;
  email: string;
  group: string;
  source: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  spentFrom: string;
  spentTo: string;
  voucherFrom: string;
  voucherTo: string;
}

const initialFilterState: FilterState = {
  name: '',
  phone: '',
  email: '',
  group: '',
  source: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  spentFrom: '',
  spentTo: '',
  voucherFrom: '',
  voucherTo: ''
};

export function CustomerColumnFilter({ customers, onFilterChange }: CustomerColumnFilterProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Get unique values for dropdown filters
  const uniqueGroups = [...new Set(customers.map(c => c.group))];
  const uniqueSources = [...new Set(customers.map(c => c.source))];

  useEffect(() => {
    applyFilters();
  }, [filters, customers]);

  const applyFilters = () => {
    let filtered = customers.filter(customer => {
      // Text filters
      if (filters.name && !customer.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.phone && !customer.phone.includes(filters.phone)) return false;
      if (filters.email && !customer.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
      
      // Select filters
      if (filters.group && customer.group !== filters.group) return false;
      if (filters.source && customer.source !== filters.source) return false;
      if (filters.status && customer.status !== filters.status) return false;
      
      // Date filters
      if (filters.dateFrom) {
        const customerDate = new Date(customer.createdDate);
        const fromDate = new Date(filters.dateFrom);
        if (customerDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const customerDate = new Date(customer.createdDate);
        const toDate = new Date(filters.dateTo);
        if (customerDate > toDate) return false;
      }
      
      // Number filters
      if (filters.spentFrom && customer.totalSpent < parseFloat(filters.spentFrom)) return false;
      if (filters.spentTo && customer.totalSpent > parseFloat(filters.spentTo)) return false;
      if (filters.voucherFrom && customer.voucherCount < parseInt(filters.voucherFrom)) return false;
      if (filters.voucherTo && customer.voucherCount > parseInt(filters.voucherTo)) return false;
      
      return true;
    });

    onFilterChange(filtered);
    
    // Count active filters
    const activeCount = Object.values(filters).filter(value => value !== '').length;
    setActiveFiltersCount(activeCount);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilterState);
  };

  const getActiveFilters = () => {
    return Object.entries(filters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => ({ key: key as keyof FilterState, value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">Bộ lọc cột</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} bộ lọc đang áp dụng</Badge>
          )}
        </div>
        <Button 
          onClick={clearAllFilters}
          variant="outline" 
          size="sm"
          disabled={activeFiltersCount === 0}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Xóa tất cả
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {getActiveFilters().map(({ key, value }) => (
            <Badge key={key} variant="outline" className="flex items-center gap-1">
              <span className="text-xs">{key}: {value}</span>
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => clearFilter(key)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Text Filters */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Tên khách hàng</Label>
          <Input
            placeholder="Tìm theo tên..."
            value={filters.name}
            onChange={(e) => updateFilter('name', e.target.value)}
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Số điện thoại</Label>
          <Input
            placeholder="Tìm theo SĐT..."
            value={filters.phone}
            onChange={(e) => updateFilter('phone', e.target.value)}
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Email</Label>
          <Input
            placeholder="Tìm theo email..."
            value={filters.email}
            onChange={(e) => updateFilter('email', e.target.value)}
            className="h-8"
          />
        </div>

        {/* Select Filters */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Nhóm khách hàng</Label>
          <Select value={filters.group} onValueChange={(value) => updateFilter('group', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Chọn nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả</SelectItem>
              {uniqueGroups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Nguồn khách hàng</Label>
          <Select value={filters.source} onValueChange={(value) => updateFilter('source', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Chọn nguồn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả</SelectItem>
              {uniqueSources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Trạng thái</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filters */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Từ ngày</Label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Đến ngày</Label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
            className="h-8"
          />
        </div>

        {/* Number Range Filters */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Chi tiêu từ</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.spentFrom}
            onChange={(e) => updateFilter('spentFrom', e.target.value)}
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Chi tiêu đến</Label>
          <Input
            type="number"
            placeholder="10000000"
            value={filters.spentTo}
            onChange={(e) => updateFilter('spentTo', e.target.value)}
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Voucher từ</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.voucherFrom}
            onChange={(e) => updateFilter('voucherFrom', e.target.value)}
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Voucher đến</Label>
          <Input
            type="number"
            placeholder="100"
            value={filters.voucherTo}
            onChange={(e) => updateFilter('voucherTo', e.target.value)}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
}
