import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { DocumentFilters, DocType, DocStatus } from '../../types/administration';
import { getDocTypeLabel, getStatusLabel } from '../../types/administration';
import { EmployeeService } from '@/modules/hr/services/employeeService';

interface DocumentFiltersProps {
  filters: DocumentFilters;
  onFilterChange: (filters: DocumentFilters) => void;
}

export function DocumentFiltersComponent({ filters, onFilterChange }: DocumentFiltersProps) {
  const [employees, setEmployees] = useState<Array<{ id: string; fullName: string; employeeCode: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await EmployeeService.getEmployees();
        setEmployees(data.map(e => ({ 
          id: e.id, 
          fullName: e.fullName,
          employeeCode: e.employeeCode 
        })));
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:flex-wrap">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm theo số văn bản hoặc tiêu đề..."
          value={filters.search || ''}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-9"
        />
      </div>

      {/* Doc Type Filter */}
      <Select
        value={filters.doc_type || 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            doc_type: value === 'all' ? undefined : (value as DocType),
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Loại văn bản" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="decision">{getDocTypeLabel('decision')}</SelectItem>
          <SelectItem value="notice">{getDocTypeLabel('notice')}</SelectItem>
          <SelectItem value="contract">{getDocTypeLabel('contract')}</SelectItem>
          <SelectItem value="form">{getDocTypeLabel('form')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status || 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            status: value === 'all' ? undefined : (value as DocStatus),
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="draft">{getStatusLabel('draft')}</SelectItem>
          <SelectItem value="pending">{getStatusLabel('pending')}</SelectItem>
          <SelectItem value="approved">{getStatusLabel('approved')}</SelectItem>
          <SelectItem value="published">{getStatusLabel('published')}</SelectItem>
          <SelectItem value="archived">{getStatusLabel('archived')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Employee Filter */}
      <Select
        value={filters.employee_id || 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            employee_id: value === 'all' ? undefined : value === 'no-employee' ? 'no-employee' : value,
          })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Nhân viên" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả nhân viên</SelectItem>
          <SelectItem value="no-employee">Văn bản công ty</SelectItem>
          {loading ? (
            <SelectItem value="_loading" disabled>Đang tải...</SelectItem>
          ) : (
            employees.map(e => (
              <SelectItem key={e.id} value={e.id}>
                {e.fullName} ({e.employeeCode})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
