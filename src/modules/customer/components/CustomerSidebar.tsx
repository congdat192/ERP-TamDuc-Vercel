
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CalendarIcon, ChevronDown, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CustomerFilters } from '../types';

interface CustomerSidebarProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  onReset: () => void;
}

export function CustomerSidebar({ filters, onFiltersChange, onReset }: CustomerSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    customerGroup: true,
    branch: true,
    dates: true,
    personal: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof CustomerFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const DatePicker = ({ value, onChange, placeholder }: { value?: Date, onChange: (date: Date | undefined) => void, placeholder: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="w-80 h-full overflow-y-auto border-r bg-background">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Bộ lọc
          </h3>
          <Button variant="outline" size="sm" onClick={onReset}>
            Xóa bộ lọc
          </Button>
        </div>

        {/* Nhóm khách hàng */}
        <Collapsible open={expandedSections.customerGroup} onOpenChange={() => toggleSection('customerGroup')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="text-sm font-medium">Nhóm khách hàng</Label>
              <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSections.customerGroup && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <Select value={filters.customerGroup || 'all'} onValueChange={(value) => updateFilter('customerGroup', value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả các nhóm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các nhóm</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">Thường</SelectItem>
                <SelectItem value="wholesale">Bán sỉ</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        {/* Chi nhánh tạo */}
        <Collapsible open={expandedSections.branch} onOpenChange={() => toggleSection('branch')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="text-sm font-medium">Chi nhánh tạo</Label>
              <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSections.branch && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <Input
              placeholder="Chọn chi nhánh"
              value={filters.branchCreator || ''}
              onChange={(e) => updateFilter('branchCreator', e.target.value)}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Ngày tạo */}
        <Collapsible open={expandedSections.dates} onOpenChange={() => toggleSection('dates')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="text-sm font-medium">Ngày tạo</Label>
              <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSections.dates && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <RadioGroup
              value={filters.createdDateFrom ? 'custom' : 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  updateFilter('createdDateFrom', undefined);
                  updateFilter('createdDateTo', undefined);
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-time" />
                <Label htmlFor="all-time">Toàn thời gian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom-date" />
                <Label htmlFor="custom-date">Tùy chỉnh</Label>
              </div>
            </RadioGroup>
            
            {filters.createdDateFrom !== undefined && (
              <div className="space-y-2">
                <DatePicker
                  value={filters.createdDateFrom}
                  onChange={(date) => updateFilter('createdDateFrom', date)}
                  placeholder="Từ ngày"
                />
                <DatePicker
                  value={filters.createdDateTo}
                  onChange={(date) => updateFilter('createdDateTo', date)}
                  placeholder="Đến ngày"
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Người tạo */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Người tạo</Label>
          <Input
            placeholder="Chọn người tạo"
            value={filters.creator || ''}
            onChange={(e) => updateFilter('creator', e.target.value)}
          />
        </div>

        {/* Loại khách hàng */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Loại khách hàng</Label>
          <RadioGroup
            value={filters.customerType || 'all'}
            onValueChange={(value) => updateFilter('customerType', value === 'all' ? undefined : value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-types" />
              <Label htmlFor="all-types">Tất cả</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Cá nhân</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="company" id="company" />
              <Label htmlFor="company">Công ty</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Thông tin cá nhân */}
        <Collapsible open={expandedSections.personal} onOpenChange={() => toggleSection('personal')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="text-sm font-medium">Thông tin cá nhân</Label>
              <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSections.personal && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-2">
            {/* Giới tính */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Giới tính</Label>
              <RadioGroup
                value={filters.gender || 'all'}
                onValueChange={(value) => updateFilter('gender', value === 'all' ? undefined : value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-genders" />
                  <Label htmlFor="all-genders">Tất cả</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Nam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Nữ</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Sinh nhật */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sinh nhật</Label>
              <RadioGroup
                value={filters.birthdayFrom ? 'custom' : 'all'}
                onValueChange={(value) => {
                  if (value === 'all') {
                    updateFilter('birthdayFrom', undefined);
                    updateFilter('birthdayTo', undefined);
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-birthdays" />
                  <Label htmlFor="all-birthdays">Toàn thời gian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom-birthday" />
                  <Label htmlFor="custom-birthday">Tùy chỉnh</Label>
                </div>
              </RadioGroup>
              
              {filters.birthdayFrom !== undefined && (
                <div className="space-y-2">
                  <DatePicker
                    value={filters.birthdayFrom}
                    onChange={(date) => updateFilter('birthdayFrom', date)}
                    placeholder="Từ ngày"
                  />
                  <DatePicker
                    value={filters.birthdayTo}
                    onChange={(date) => updateFilter('birthdayTo', date)}
                    placeholder="Đến ngày"
                  />
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Ngày giao dịch cuối */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ngày giao dịch cuối</Label>
          <RadioGroup
            value={filters.lastTransactionFrom ? 'custom' : 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                updateFilter('lastTransactionFrom', undefined);
                updateFilter('lastTransactionTo', undefined);
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-transactions" />
              <Label htmlFor="all-transactions">Toàn thời gian</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom-transaction" />
              <Label htmlFor="custom-transaction">Tùy chỉnh</Label>
            </div>
          </RadioGroup>
          
          {filters.lastTransactionFrom !== undefined && (
            <div className="space-y-2">
              <DatePicker
                value={filters.lastTransactionFrom}
                onChange={(date) => updateFilter('lastTransactionFrom', date)}
                placeholder="Từ ngày"
              />
              <DatePicker
                value={filters.lastTransactionTo}
                onChange={(date) => updateFilter('lastTransactionTo', date)}
                placeholder="Đến ngày"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
