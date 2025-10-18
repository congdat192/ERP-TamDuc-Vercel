import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AttendanceService } from '../services/attendanceService';
import { MonthlyAttendance } from '../types';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MonthlyAttendanceTabProps {
  employeeId: string;
}

export function MonthlyAttendanceTab({ employeeId }: MonthlyAttendanceTabProps) {
  const [attendances, setAttendances] = useState<MonthlyAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    month: '',
    standard_days: 26,
    actual_days: 0,
    paid_leave: 0,
    unpaid_leave: 0,
    ot_hours: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendances();
  }, [employeeId]);

  const fetchAttendances = async () => {
    try {
      setIsLoading(true);
      const data = await AttendanceService.getAttendanceByEmployee(employeeId);
      setAttendances(data);
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể tải dữ liệu chấm công',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await AttendanceService.createAttendance({
        employee_id: employeeId,
        month: formData.month + '-01', // Convert YYYY-MM to YYYY-MM-01
        standard_days: formData.standard_days,
        actual_days: formData.actual_days,
        paid_leave: formData.paid_leave,
        unpaid_leave: formData.unpaid_leave,
        ot_hours: formData.ot_hours,
      });

      toast({
        title: 'Thành công',
        description: 'Đã tạo bản ghi chấm công',
      });

      setIsCreateOpen(false);
      resetForm();
      fetchAttendances();
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể tạo bản ghi',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await AttendanceService.updateAttendance(editingId, {
        standard_days: formData.standard_days,
        actual_days: formData.actual_days,
        paid_leave: formData.paid_leave,
        unpaid_leave: formData.unpaid_leave,
        ot_hours: formData.ot_hours,
      });

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật bản ghi chấm công',
      });

      setEditingId(null);
      resetForm();
      fetchAttendances();
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể cập nhật',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bản ghi này?')) return;

    try {
      await AttendanceService.deleteAttendance(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa bản ghi chấm công',
      });
      fetchAttendances();
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể xóa',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (attendance: MonthlyAttendance) => {
    setEditingId(attendance.id);
    setFormData({
      month: attendance.month.substring(0, 7), // Extract YYYY-MM
      standard_days: attendance.standardDays,
      actual_days: attendance.actualDays,
      paid_leave: attendance.paidLeave,
      unpaid_leave: attendance.unpaidLeave,
      ot_hours: attendance.otHours,
    });
  };

  const resetForm = () => {
    setFormData({
      month: '',
      standard_days: 26,
      actual_days: 0,
      paid_leave: 0,
      unpaid_leave: 0,
      ot_hours: 0,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Chấm công theo tháng</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm bản ghi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm bản ghi chấm công</DialogTitle>
              <DialogDescription>
                Nhập thông tin chấm công cho tháng
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="month">Tháng *</Label>
                <Input
                  id="month"
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="standard_days">Ngày công chuẩn</Label>
                  <Input
                    id="standard_days"
                    type="number"
                    min="0"
                    value={formData.standard_days}
                    onChange={(e) => setFormData({ ...formData, standard_days: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="actual_days">Ngày công thực tế</Label>
                  <Input
                    id="actual_days"
                    type="number"
                    min="0"
                    value={formData.actual_days}
                    onChange={(e) => setFormData({ ...formData, actual_days: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paid_leave">Nghỉ có phép</Label>
                  <Input
                    id="paid_leave"
                    type="number"
                    min="0"
                    value={formData.paid_leave}
                    onChange={(e) => setFormData({ ...formData, paid_leave: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="unpaid_leave">Nghỉ không phép</Label>
                  <Input
                    id="unpaid_leave"
                    type="number"
                    min="0"
                    value={formData.unpaid_leave}
                    onChange={(e) => setFormData({ ...formData, unpaid_leave: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="ot_hours">Giờ OT</Label>
                <Input
                  id="ot_hours"
                  type="number"
                  min="0"
                  value={formData.ot_hours}
                  onChange={(e) => setFormData({ ...formData, ot_hours: Number(e.target.value) })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreate}>Tạo</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tháng</TableHead>
              <TableHead>Công chuẩn</TableHead>
              <TableHead>Công thực tế</TableHead>
              <TableHead>Nghỉ có phép</TableHead>
              <TableHead>Nghỉ không phép</TableHead>
              <TableHead>OT (giờ)</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : attendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có bản ghi chấm công</p>
                </TableCell>
              </TableRow>
            ) : (
              attendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell className="font-medium">
                    {format(new Date(attendance.month), 'MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell>{attendance.standardDays}</TableCell>
                  <TableCell>{attendance.actualDays}</TableCell>
                  <TableCell>{attendance.paidLeave}</TableCell>
                  <TableCell>{attendance.unpaidLeave}</TableCell>
                  <TableCell>{attendance.otHours}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={editingId === attendance.id} onOpenChange={(open) => !open && setEditingId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(attendance)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cập nhật chấm công</DialogTitle>
                            <DialogDescription>
                              Chỉnh sửa thông tin chấm công tháng {format(new Date(attendance.month), 'MM/yyyy', { locale: vi })}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Ngày công chuẩn</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={formData.standard_days}
                                  onChange={(e) => setFormData({ ...formData, standard_days: Number(e.target.value) })}
                                />
                              </div>
                              <div>
                                <Label>Ngày công thực tế</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={formData.actual_days}
                                  onChange={(e) => setFormData({ ...formData, actual_days: Number(e.target.value) })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Nghỉ có phép</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={formData.paid_leave}
                                  onChange={(e) => setFormData({ ...formData, paid_leave: Number(e.target.value) })}
                                />
                              </div>
                              <div>
                                <Label>Nghỉ không phép</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={formData.unpaid_leave}
                                  onChange={(e) => setFormData({ ...formData, unpaid_leave: Number(e.target.value) })}
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Giờ OT</Label>
                              <Input
                                type="number"
                                min="0"
                                value={formData.ot_hours}
                                onChange={(e) => setFormData({ ...formData, ot_hours: Number(e.target.value) })}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setEditingId(null)}>
                                Hủy
                              </Button>
                              <Button onClick={handleUpdate}>Cập nhật</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(attendance.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
