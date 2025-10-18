import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export interface EmployeeFiltersData {
  department?: string;
  status?: string;
  contractType?: string;
  joinDateFrom?: string;
  joinDateTo?: string;
}

interface EmployeeFiltersProps {
  filters: EmployeeFiltersData;
  onFiltersChange: (filters: EmployeeFiltersData) => void;
  departments: string[];
}

export function EmployeeFilters({ filters, onFiltersChange, departments }: EmployeeFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const handleFilterChange = (key: keyof EmployeeFiltersData, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Bộ Lọc
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Bộ Lọc</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 px-2"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa lọc
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Phòng Ban</Label>
              <Select
                value={filters.department || 'all'}
                onValueChange={(v) => handleFilterChange('department', v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trạng Thái</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(v) => handleFilterChange('status', v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang làm</SelectItem>
                  <SelectItem value="probation">Thử việc</SelectItem>
                  <SelectItem value="inactive">Nghỉ việc</SelectItem>
                  <SelectItem value="terminated">Đã sa thải</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loại Hợp Đồng</Label>
              <Select
                value={filters.contractType || 'all'}
                onValueChange={(v) => handleFilterChange('contractType', v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Chính Thức">Chính Thức</SelectItem>
                  <SelectItem value="Thử Việc">Thử Việc</SelectItem>
                  <SelectItem value="Hợp Đồng">Hợp Đồng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ngày Vào Làm</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Từ</Label>
                  <Input
                    type="date"
                    value={filters.joinDateFrom || ''}
                    onChange={(e) => handleFilterChange('joinDateFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Đến</Label>
                  <Input
                    type="date"
                    value={filters.joinDateTo || ''}
                    onChange={(e) => handleFilterChange('joinDateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
