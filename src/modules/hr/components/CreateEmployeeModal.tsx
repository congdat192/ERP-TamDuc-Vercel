import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmployeeService } from '../services/employeeService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, type EmployeeFormData } from '../types/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { AvatarService } from '../services/avatarService';

interface CreateEmployeeModalProps {
  onSuccess: () => void;
}

export function CreateEmployeeModal({ onSuccess }: CreateEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
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
      last_review_date: ''
    }
  });

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
      // Check email uniqueness
      const emailExists = await EmployeeService.checkEmailExists(data.email);
      if (emailExists) {
        form.setError('email', { message: 'Email đã tồn tại trong hệ thống' });
        setLoading(false);
        return;
      }

      // Check employee code uniqueness
      const codeExists = await EmployeeService.checkEmployeeCodeExists(data.employee_code);
      if (codeExists) {
        form.setError('employee_code', { message: 'Mã nhân viên đã tồn tại' });
        setLoading(false);
        return;
      }

      // Upload avatar first if selected
      let avatarPath = '';
      if (avatarFile) {
        const tempId = `temp-${Date.now()}`;
        avatarPath = await AvatarService.uploadAvatar(avatarFile, tempId);
      }

      await EmployeeService.createEmployee({
        ...data,
        avatar_path: avatarPath
      });
      
      toast({
        title: 'Thành công',
        description: 'Thêm nhân viên mới thành công'
      });
      
      setOpen(false);
      form.reset();
      setAvatarFile(null);
      setAvatarPreview('');
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể thêm nhân viên',
        variant: 'destructive'
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
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>
                  <Plus className="h-8 w-8" />
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
                      <Input {...field} placeholder="NV001" />
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
                      <Input {...field} placeholder="Nguyễn Văn A" />
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
                      <Input {...field} type="email" placeholder="nhanvien@example.com" />
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
                      <Input {...field} placeholder="0901234567" />
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
                      <Input {...field} placeholder="Nhân viên kinh doanh" />
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
                      <Input {...field} placeholder="Kinh doanh" />
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
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại Hợp Đồng *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="salary_p2"
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
                name="salary_p3"
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Thêm Nhân Viên'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
