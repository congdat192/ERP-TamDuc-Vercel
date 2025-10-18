import { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { EmployeeService, CreateEmployeeData } from '../services/employeeService';

interface CreateEmployeeModalProps {
  onSuccess: () => void;
}

export function CreateEmployeeModal({ onSuccess }: CreateEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateEmployeeData>({
    employee_code: '',
    full_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    join_date: new Date().toISOString().split('T')[0],
    contract_type: 'Thử Việc',
    status: 'probation',
    salary_p1: 0,
    salary_p2: 1.0,
    salary_p3: 0,
    kpi_score: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await EmployeeService.createEmployee(formData);
      toast({
        title: 'Thành công',
        description: 'Đã thêm nhân viên mới',
      });
      setOpen(false);
      setFormData({
        employee_code: '',
        full_name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        join_date: new Date().toISOString().split('T')[0],
        contract_type: 'Thử Việc',
        status: 'probation',
        salary_p1: 0,
        salary_p2: 1.0,
        salary_p3: 0,
        kpi_score: 0,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể thêm nhân viên',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm Nhân Viên
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Nhân Viên Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin nhân viên để thêm vào hệ thống
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_code">Mã Nhân Viên *</Label>
                <Input
                  id="employee_code"
                  value={formData.employee_code}
                  onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                  placeholder="VD: NV001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ Tên *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
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
                  placeholder="email@tamduc.vn"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số Điện Thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0901234567"
                />
              </div>
            </div>

            {/* Position & Department */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Chức Vụ *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Sales Manager"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Phòng Ban *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Sales"
                  required
                />
              </div>
            </div>

            {/* Contract Info */}
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Salary Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_p1">Lương Cơ Bản (P1)</Label>
                <Input
                  id="salary_p1"
                  type="number"
                  value={formData.salary_p1}
                  onChange={(e) => setFormData({ ...formData, salary_p1: parseFloat(e.target.value) })}
                  placeholder="10000000"
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
                  placeholder="1.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_p3">Phụ Cấp (P3)</Label>
                <Input
                  id="salary_p3"
                  type="number"
                  value={formData.salary_p3}
                  onChange={(e) => setFormData({ ...formData, salary_p3: parseFloat(e.target.value) })}
                  placeholder="2000000"
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
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
