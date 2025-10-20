import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmployeeService } from '../services/employeeService';
import { Employee } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, type EmployeeFormData } from '../types/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { AvatarService } from '../services/avatarService';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface EditEmployeeModalProps {
  employee: Employee;
  onSuccess: () => void;
}

export function EditEmployeeModal({ employee, onSuccess }: EditEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employee_code: employee.employeeCode,
      full_name: employee.fullName,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position,
      department: employee.department,
      team: employee.team || '',
      join_date: employee.joinDate,
      employment_type: employee.employmentType,
      status: employee.status,
      salary_p1: employee.salary.basic,
      allowance_meal: employee.salary.allowanceMeal,
      allowance_fuel: employee.salary.allowanceFuel,
      allowance_phone: employee.salary.allowancePhone,
      allowance_other: employee.salary.allowanceOther,
      kpi_score: employee.performance.kpi,
      last_review_date: employee.performance.lastReview || '',
      current_address: employee.currentAddress || '',
      emergency_contact_relationship: employee.emergencyContact?.relationship,
      emergency_contact_name: employee.emergencyContact?.name || '',
      emergency_contact_phone: employee.emergencyContact?.phone || '',
      notes: employee.notes || '',
      gender: employee.gender,
      birth_date: employee.birthDate || '',
      salary_fulltime_probation: employee.salary.fulltimeProbation || 0,
      salary_fulltime_official: employee.salary.fulltimeOfficial || 0,
      salary_parttime_probation: employee.salary.parttimeProbation || 0,
      salary_parttime_official: employee.salary.parttimeOfficial || 0,
      is_employee_only: employee.isEmployeeOnly || false
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        employee_code: employee.employeeCode,
        full_name: employee.fullName,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position,
        department: employee.department,
        team: employee.team || '',
        join_date: employee.joinDate,
        employment_type: employee.employmentType,
        status: employee.status,
        salary_p1: employee.salary.basic,
        allowance_meal: employee.salary.allowanceMeal,
        allowance_fuel: employee.salary.allowanceFuel,
        allowance_phone: employee.salary.allowancePhone,
        allowance_other: employee.salary.allowanceOther,
        kpi_score: employee.performance.kpi,
        last_review_date: employee.performance.lastReview || '',
        current_address: employee.currentAddress || '',
        emergency_contact_relationship: employee.emergencyContact?.relationship,
        emergency_contact_name: employee.emergencyContact?.name || '',
        emergency_contact_phone: employee.emergencyContact?.phone || '',
        notes: employee.notes || '',
        gender: employee.gender,
        birth_date: employee.birthDate || '',
        salary_fulltime_probation: employee.salary.fulltimeProbation || 0,
        salary_fulltime_official: employee.salary.fulltimeOfficial || 0,
        salary_parttime_probation: employee.salary.parttimeProbation || 0,
        salary_parttime_official: employee.salary.parttimeOfficial || 0,
        is_employee_only: employee.isEmployeeOnly || false
      });
      
      // Set avatar preview if exists
      if (employee.avatar) {
        setAvatarPreview(AvatarService.getAvatarUrl(employee.avatar));
      } else {
        setAvatarPreview('');
      }
      setAvatarFile(null);
    }
  }, [open, employee, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = AvatarService.validateFile(file);
      if (!validation.isValid) {
        toast({
          title: 'Lỗi',
          description: validation.error,
          variant: 'destructive',
        });
        e.target.value = '';
        return;
      }
      
      setAvatarFile(file);
      const previewUrl = AvatarService.createPreviewUrl(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (data: EmployeeFormData) => {
    setLoading(true);
    try {
      // Check email uniqueness (exclude current employee)
      const emailExists = await EmployeeService.checkEmailExists(data.email, employee.id);
      if (emailExists) {
        form.setError('email', { message: 'Email đã tồn tại trong hệ thống' });
        setLoading(false);
        return;
      }

      // Check employee code uniqueness (exclude current employee)
      const codeExists = await EmployeeService.checkEmployeeCodeExists(data.employee_code, employee.id);
      if (codeExists) {
        form.setError('employee_code', { message: 'Mã nhân viên đã tồn tại' });
        setLoading(false);
        return;
      }

      // Upload new avatar if selected
      let avatarPath = employee.avatar;
      if (avatarFile) {
        // Delete old avatar if exists
        if (employee.avatar) {
          try {
            await AvatarService.deleteAvatar(employee.avatar);
          } catch (err) {
            console.error('Failed to delete old avatar:', err);
          }
        }
        
        avatarPath = await AvatarService.uploadAvatar(avatarFile, employee.id);
      }

      await EmployeeService.updateEmployee(employee.id, {
        ...data,
        avatar_path: avatarPath
      });
      
      toast({
        title: 'Thành công',
        description: 'Cập nhật thông tin nhân viên thành công'
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật nhân viên',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await EmployeeService.softDeleteEmployee(employee.id);
      
      toast({
        title: 'Thành công',
        description: `Đã xóa nhân viên ${employee.fullName}. Có thể khôi phục từ tab "Nhân Viên Đã Xóa".`,
      });
      
      setDeleteDialogOpen(false);
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa nhân viên',
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
          <DialogTitle>Chỉnh Sửa Thông Tin Nhân Viên</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>
                  {employee.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label>Avatar (Tùy chọn)</Label>
                <Input 
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleAvatarChange}
                />
                <p className="text-xs text-muted-foreground">
                  JPG hoặc PNG, tối đa 2MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employee_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã Nhân Viên *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ Tên *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số Điện Thoại</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới Tính</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Nam</SelectItem>
                        <SelectItem value="Female">Nữ</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày Sinh</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chức Vụ *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng Ban *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="join_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày Vào Làm *</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại Hợp Đồng *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Thử Việc">Thử Việc</SelectItem>
                        <SelectItem value="Chính Thức">Chính Thức</SelectItem>
                        <SelectItem value="Hợp Đồng">Hợp Đồng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng Thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="probation">Thử việc</SelectItem>
                        <SelectItem value="active">Đang làm việc</SelectItem>
                        <SelectItem value="inactive">Nghỉ việc</SelectItem>
                        <SelectItem value="terminated">Đã sa thải</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Địa Chỉ & Liên Hệ Khẩn Cấp Section */}
            <div className="col-span-2 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Địa Chỉ & Liên Hệ Khẩn Cấp</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Current Address - Full Width */}
                <FormField
                  control={form.control}
                  name="current_address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nơi Ở Hiện Tại</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Emergency Contact Relationship */}
                <FormField
                  control={form.control}
                  name="emergency_contact_relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mối Quan Hệ</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mối quan hệ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cha">Cha</SelectItem>
                          <SelectItem value="Mẹ">Mẹ</SelectItem>
                          <SelectItem value="Vợ">Vợ</SelectItem>
                          <SelectItem value="Chồng">Chồng</SelectItem>
                          <SelectItem value="Anh">Anh</SelectItem>
                          <SelectItem value="Chị">Chị</SelectItem>
                          <SelectItem value="Em">Em</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Emergency Contact Name */}
                <FormField
                  control={form.control}
                  name="emergency_contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên Người Liên Hệ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nguyễn Văn B" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Emergency Contact Phone */}
                <FormField
                  control={form.control}
                  name="emergency_contact_phone"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Số Điện Thoại Người Liên Hệ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0901234567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Lương Section */}
            <div className="col-span-2 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Thông Tin Lương</h3>
              <div className="grid grid-cols-2 gap-4">

              <FormField
                control={form.control}
                name="salary_p1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lương Cơ Bản (VNĐ)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowance_meal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hệ Số Lương</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.1"
                        onChange={e => field.onChange(parseFloat(e.target.value) || 1.0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowance_fuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phụ Cấp (VNĐ)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kpi_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm KPI</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_review_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày Đánh Giá Gần Nhất</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            </div>

            {/* Lương Theo Loại Hợp Đồng Section */}
            <div className="col-span-2 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Lương Theo Loại Hợp Đồng</h3>
              <div className="grid grid-cols-2 gap-4">
                
                <FormField
                  control={form.control}
                  name="salary_fulltime_probation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lương Full-time Thử Việc (VNĐ)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_fulltime_official"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lương Full-time Chính Thức (VNĐ)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_parttime_probation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lương Part-time Thử Việc (VNĐ)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_parttime_official"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lương Part-time Chính Thức (VNĐ)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                💡 <strong>Ghi chú:</strong> Các mức lương này áp dụng khi nhân viên ở loại hợp đồng tương ứng. 
                "Lương Cơ Bản" ở trên là mức lương hiện tại đang áp dụng.
              </p>
            </div>

            {/* Access Control Section */}
            <div className="col-span-2 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Phân Quyền Truy Cập</h3>
              
              <FormField
                control={form.control}
                name="is_employee_only"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={!field.value}
                        onCheckedChange={(checked) => field.onChange(!checked)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium">
                        ✅ Có Quyền Truy Cập ERP
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Nếu được chọn, nhân viên này có thể đăng nhập vào khu vực quản trị ERP (ngoài ESS).
                        Bỏ chọn nếu nhân viên chỉ cần truy cập Hồ Sơ Cá Nhân (ESS).
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="sm:justify-between">
              {/* Left side: Delete button */}
              <Button 
                type="button"
                variant="destructive"
                className="gap-2"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                Xóa Nhân Viên
              </Button>
              
              {/* Right side: Cancel + Update */}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang cập nhật...' : 'Cập Nhật'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên <strong>{employee.fullName}</strong>?
              <br /><br />
              Đây là xóa mềm (soft delete). Nhân viên sẽ chuyển sang tab "Nhân Viên Đã Xóa" và có thể khôi phục bất cứ lúc nào.
              <br /><br />
              <span className="text-sm text-muted-foreground">
                Lưu ý: Khác với trạng thái "Nghỉ việc" trong hồ sơ - đây là xóa khỏi danh sách hoạt động.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? 'Đang xóa...' : 'Xóa Nhân Viên'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
