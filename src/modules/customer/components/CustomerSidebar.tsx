
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CustomerFilters } from '../types';

interface CustomerSidebarProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
}

export function CustomerSidebar({ filters, onFiltersChange }: CustomerSidebarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const handleFilterChange = (key: keyof CustomerFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      customerGroup: 'all',
      branch: 'all',
      creator: 'all',
      customerType: 'all',
      gender: 'all'
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <Card className="border-0 rounded-none">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between text-base">
                Bộ Lọc
                {isFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Nhóm khách hàng</Label>
                <Select value={filters.customerGroup} onValueChange={(value) => handleFilterChange('customerGroup', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tất cả các nhóm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả các nhóm</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Thường">Thường</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Chi nhánh tạo</Label>
                <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                    <SelectItem value="Chi nhánh 1">Chi nhánh 1</SelectItem>
                    <SelectItem value="Chi nhánh 2">Chi nhánh 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Ngày tạo</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="createdDate" value="all" defaultChecked className="text-blue-600" />
                    <span className="text-sm">Toàn thời gian</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="createdDate" value="custom" className="text-blue-600" />
                    <span className="text-sm">Tùy chỉnh</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Người tạo</Label>
                <Input 
                  placeholder="Chọn người tạo" 
                  className="mt-1"
                  value={filters.creator === 'all' ? '' : filters.creator}
                  onChange={(e) => handleFilterChange('creator', e.target.value || 'all')}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Loại khách hàng</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={filters.customerType === 'all' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('customerType', 'all')}
                      className="text-xs"
                    >
                      Tất cả
                    </Button>
                    <Button 
                      variant={filters.customerType === 'individual' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('customerType', 'individual')}
                      className="text-xs"
                    >
                      Cá nhân
                    </Button>
                  </div>
                  <Button 
                    variant={filters.customerType === 'company' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('customerType', 'company')}
                    className="text-xs"
                  >
                    Công ty
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Giới tính</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={filters.gender === 'all' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('gender', 'all')}
                      className="text-xs"
                    >
                      Tất cả
                    </Button>
                    <Button 
                      variant={filters.gender === 'male' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('gender', 'male')}
                      className="text-xs"
                    >
                      Nam
                    </Button>
                    <Button 
                      variant={filters.gender === 'female' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('gender', 'female')}
                      className="text-xs"
                    >
                      Nữ
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Sinh nhật</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="birthday" value="all" defaultChecked className="text-blue-600" />
                    <span className="text-sm">Toàn thời gian</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="birthday" value="custom" className="text-blue-600" />
                    <span className="text-sm">Tùy chỉnh</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Ngày giao dịch cuối</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="lastTransaction" value="all" defaultChecked className="text-blue-600" />
                    <span className="text-sm">Toàn thời gian</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="lastTransaction" value="custom" className="text-blue-600" />
                    <span className="text-sm">Tùy chỉnh</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="w-full text-sm"
              >
                Đặt lại bộ lọc
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
