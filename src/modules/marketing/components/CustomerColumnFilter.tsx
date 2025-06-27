
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(true);

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

  const getFilterLabel = (key: string) => {
    const labels: Record<string, string> = {
      name: 'Tên KH',
      phone: 'SĐT',
      email: 'Email',
      group: 'Nhóm',
      source: 'Nguồn',
      status: 'Trạng thái',
      dateFrom: 'Từ ngày',
      dateTo: 'Đến ngày',
      spentFrom: 'Chi tiêu từ',
      spentTo: 'Chi tiêu đến',
      voucherFrom: 'Voucher từ',
      voucherTo: 'Voucher đến'
    };
    return labels[key] || key;
  };

  return (
    <Card className="w-full">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Bộ lọc cột</CardTitle>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {activeFiltersCount} bộ lọc
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={clearAllFilters}
                  variant="outline" 
                  size="sm"
                  disabled={activeFiltersCount === 0}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Xóa tất cả
                </Button>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Bộ lọc đang áp dụng:</span>
                  <span className="text-xs text-blue-600">{activeFiltersCount} bộ lọc</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getActiveFilters().map(({ key, value }) => (
                    <Badge key={key} variant="outline" className="flex items-center gap-1 bg-white">
                      <span className="text-xs">
                        <strong>{getFilterLabel(key)}:</strong> {value}
                      </span>
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-red-500" 
                        onClick={() => clearFilter(key)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Controls */}
            <div className="space-y-4">
              {/* Text Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tìm kiếm văn bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Tên khách hàng</Label>
                    <Input
                      placeholder="Nhập tên..."
                      value={filters.name}
                      onChange={(e) => updateFilter('name', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Số điện thoại</Label>
                    <Input
                      placeholder="Nhập SĐT..."
                      value={filters.phone}
                      onChange={(e) => updateFilter('phone', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Email</Label>
                    <Input
                      placeholder="Nhập email..."
                      value={filters.email}
                      onChange={(e) => updateFilter('email', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Select Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Bộ lọc phân loại</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Nhóm khách hàng</Label>
                    <Select value={filters.group} onValueChange={(value) => updateFilter('group', value)}>
                      <SelectTrigger className="h-9">
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
                    <Label className="text-xs font-medium text-gray-600">Nguồn khách hàng</Label>
                    <Select value={filters.source} onValueChange={(value) => updateFilter('source', value)}>
                      <SelectTrigger className="h-9">
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
                    <Label className="text-xs font-medium text-gray-600">Trạng thái</Label>
                    <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tất cả</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Date Range Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Bộ lọc thời gian</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Từ ngày</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter('dateFrom', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Đến ngày</Label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => updateFilter('dateTo', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Number Range Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Bộ lọc số lượng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Chi tiêu từ (đ)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.spentFrom}
                      onChange={(e) => updateFilter('spentFrom', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Chi tiêu đến (đ)</Label>
                    <Input
                      type="number"
                      placeholder="10,000,000"
                      value={filters.spentTo}
                      onChange={(e) => updateFilter('spentTo', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Voucher từ</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.voucherFrom}
                      onChange={(e) => updateFilter('voucherFrom', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Voucher đến</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={filters.voucherTo}
                      onChange={(e) => updateFilter('voucherTo', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
