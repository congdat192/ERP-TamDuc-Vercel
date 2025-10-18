import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EmployeeService, UpdateEmployeeData } from '../services/employeeService';
import { Employee } from '../types';

interface EditEmployeeModalProps {
  employee: Employee;
  onSuccess: () => void;
}

export function EditEmployeeModal({ employee, onSuccess }: EditEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<UpdateEmployeeData>({
    employee_code: employee.employeeCode,
    full_name: employee.fullName,
    email: employee.email,
    phone: employee.phone,
    position: employee.position,
    department: employee.department,
    join_date: employee.joinDate,
    contract_type: employee.contractType,
    status: employee.status,
    salary_p1: employee.salary.p1,
    salary_p2: employee.salary.p2,
    salary_p3: employee.salary.p3,
    kpi_score: employee.performance.kpi,
    last_review_date: employee.performance.lastReview,
  });

  useEffect(() => {
    setFormData({
      employee_code: employee.employeeCode,
      full_name: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      join_date: employee.joinDate,
      contract_type: employee.contractType,
      status: employee.status,
      salary_p1: employee.salary.p1,
      salary_p2: employee.salary.p2,
      salary_p3: employee.salary.p3,
      kpi_score: employee.performance.kpi,
      last_review_date: employee.performance.lastReview,
    });
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await EmployeeService.updateEmployee(employee.id, formData);
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin nhân viên',
      });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật nhân viên',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Nhân Viên</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin nhân viên {employee.fullName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_code">Mã Nhân Viên *</Label>
                <Input
                  id="employee_code"
                  value={formData.employee_code}
                  onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ Tên *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số Điện Thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Chức Vụ *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Phòng Ban *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="join_date">Ngày Vào Làm *</Label>
                <Input
                  id="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract_type">Loại Hợp Đồng *</Label>
                <Select
                  value={formData.contract_type}
                  onValueChange={(value: any) => setFormData({ ...formData, contract_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thử Việc">Thử Việc</SelectItem>
                    <SelectItem value="Chính Thức">Chính Thức</SelectItem>
                    <SelectItem value="Hợp Đồng">Hợp Đồng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng Thái *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="probation">Thử Việc</SelectItem>
                    <SelectItem value="active">Đang Làm</SelectItem>
                    <SelectItem value="inactive">Nghỉ Việc</SelectItem>
                    <SelectItem value="terminated">Đã Sa Thải</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_p1">Lương Cơ Bản (P1)</Label>
                <Input
                  id="salary_p1"
                  type="number"
                  value={formData.salary_p1}
                  onChange={(e) => setFormData({ ...formData, salary_p1: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_p2">Hệ Số (P2)</Label>
                <Input
                  id="salary_p2"
                  type="number"
                  step="0.1"
                  value={formData.salary_p2}
                  onChange={(e) => setFormData({ ...formData, salary_p2: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_p3">Phụ Cấp (P3)</Label>
                <Input
                  id="salary_p3"
                  type="number"
                  value={formData.salary_p3}
                  onChange={(e) => setFormData({ ...formData, salary_p3: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kpi_score">KPI Score</Label>
              <Input
                id="kpi_score"
                type="number"
                step="0.01"
                value={formData.kpi_score}
                onChange={(e) => setFormData({ ...formData, kpi_score: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Cập Nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
