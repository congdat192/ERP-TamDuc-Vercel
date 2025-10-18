import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { EmployeeService } from '../../services/employeeService';
import { BenefitsService } from '../../services/benefitsService';
import type { Benefit } from '../../types/benefits';
import type { Employee } from '../../types';

interface BulkAssignBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  benefit: Benefit;
  onSuccess: () => void;
}

export function BulkAssignBenefitsModal({ isOpen, onClose, benefit, onSuccess }: BulkAssignBenefitsModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({ department: '', position: '', status: 'active' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await EmployeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('❌ Error loading employees:', err);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    if (filters.department && emp.department !== filters.department) return false;
    if (filters.position && emp.position !== filters.position) return false;
    if (filters.status && emp.status !== filters.status) return false;
    return true;
  });

  const handleSelectAll = () => {
    if (selectedEmployeeIds.length === filteredEmployees.length) {
      setSelectedEmployeeIds([]);
    } else {
      setSelectedEmployeeIds(filteredEmployees.map(emp => emp.id));
    }
  };

  const handleToggleEmployee = (employeeId: string) => {
    setSelectedEmployeeIds(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEmployeeIds.length === 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn ít nhất một nhân viên',
        variant: 'destructive',
      });
      return;
    }

    if (!startDate) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập ngày bắt đầu',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await BenefitsService.bulkAssignBenefit(
        benefit.id,
        selectedEmployeeIds,
        startDate,
        endDate || undefined
      );
      toast({
        title: 'Thành công',
        description: `Đã gán phúc lợi cho ${selectedEmployeeIds.length} nhân viên`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = [...new Set(employees.map(e => e.department))];
  const positions = [...new Set(employees.map(e => e.position))];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gán Hàng Loạt: {benefit.benefit_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label>Phòng Ban</Label>
              <Select value={filters.department} onValueChange={(val) => setFilters({ ...filters, department: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chức Vụ</Label>
              <Select value={filters.position} onValueChange={(val) => setFilters({ ...filters, position: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  {positions.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trạng Thái</Label>
              <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  <SelectItem value="active">Đang làm</SelectItem>
                  <SelectItem value="probation">Thử việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Ngày Bắt Đầu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày Kết Thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Employee Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Chọn Nhân Viên ({selectedEmployeeIds.length}/{filteredEmployees.length})</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedEmployeeIds.length === filteredEmployees.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Button>
            </div>

            <div className="border rounded-lg max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Mã NV</TableHead>
                    <TableHead>Họ Tên</TableHead>
                    <TableHead>Chức Vụ</TableHead>
                    <TableHead>Phòng Ban</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployeeIds.includes(employee.id)}
                          onCheckedChange={() => handleToggleEmployee(employee.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{employee.employeeCode}</TableCell>
                      <TableCell className="font-medium">{employee.fullName}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gán...' : `Gán cho ${selectedEmployeeIds.length} nhân viên`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
