import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, Loader2, Camera, Mail, Phone, Calendar, MapPin, User, Users, Briefcase, Clock, BadgeCheck, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { z } from 'zod';
import { AvatarService } from '@/modules/hr/services/avatarService';

const validationSchema = z.object({
  phone: z.string()
    .regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)')
    .optional()
    .or(z.literal('')),
  current_address: z.string()
    .max(500, 'Địa chỉ tối đa 500 ký tự')
    .optional()
    .or(z.literal('')),
  birth_date: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const now = new Date();
      const age = (now.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return age >= 16 && age <= 100;
    }, 'Tuổi phải từ 16-100'),
  emergency_contact_name: z.string()
    .max(200, 'Tên người liên hệ tối đa 200 ký tự')
    .optional()
    .or(z.literal('')),
  emergency_contact_phone: z.string()
    .regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),
  emergency_contact_relationship: z.string()
    .max(100, 'Quan hệ tối đa 100 ký tự')
    .optional()
    .or(z.literal(''))
});

interface Props {
  employee: any;
  onChangeTab: (tab: string) => void;
  onEmployeeUpdate: (employee: any) => void;
}

export function EmployeePersonalInfoTab({ employee, onChangeTab, onEmployeeUpdate }: Props) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phone: employee.phone || '',
    current_address: employee.current_address || '',
    birth_date: employee.birth_date || '',
    emergency_contact_name: employee.emergency_contact_name || '',
    emergency_contact_phone: employee.emergency_contact_phone || '',
    emergency_contact_relationship: employee.emergency_contact_relationship || '',
  });

  useEffect(() => {
    checkPendingRequest();
  }, [employee.id]);

  const checkPendingRequest = async () => {
    const { data } = await supabase
      .from('employee_change_requests')
      .select('id')
      .eq('employee_id', employee.id)
      .eq('status', 'pending')
      .limit(1);

    setHasPendingRequest(data && data.length > 0);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = AvatarService.validateFile(file);
    if (!validation.isValid) {
      toast({
        title: "Lỗi",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Create preview
      const previewUrl = AvatarService.createPreviewUrl(file);
      setAvatarPreview(previewUrl);

      // Upload avatar
      const avatarPath = await AvatarService.uploadAvatar(file, employee.id);

      // Update employee record
      const { error: updateError } = await supabase
        .from('employees')
        .update({ avatar_path: avatarPath })
        .eq('id', employee.id);

      if (updateError) throw updateError;

      // Update local state
      onEmployeeUpdate({ ...employee, avatar_path: avatarPath });

      toast({
        title: "Thành công",
        description: "Cập nhật avatar thành công",
      });

      // Clear preview after successful upload
      setAvatarPreview(null);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật avatar",
        variant: "destructive",
      });
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmitChangeRequest = async () => {
    // 1. Validate form
    try {
      validationSchema.parse(formData);
    } catch (err: any) {
      toast({
        title: "Lỗi Validation",
        description: err.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    // 2. Double-check for pending requests
    const { data: pendingCheck } = await supabase
      .from('employee_change_requests')
      .select('id')
      .eq('employee_id', employee.id)
      .eq('status', 'pending')
      .limit(1);

    if (pendingCheck && pendingCheck.length > 0) {
      toast({
        title: "Không thể gửi",
        description: "Bạn có yêu cầu đang chờ duyệt. Vui lòng đợi HR xử lý.",
        variant: "destructive",
      });
      return;
    }

    // 3. Build changes object (only include changed fields)
    const changes: Record<string, { old: any; new: any }> = {};

    const fieldsToCheck = [
      'phone',
      'current_address',
      'birth_date',
      'emergency_contact_name',
      'emergency_contact_phone',
      'emergency_contact_relationship'
    ];

    fieldsToCheck.forEach((field) => {
      const oldValue = employee[field as keyof typeof employee];
      const newValue = formData[field as keyof typeof formData];

      if (oldValue !== newValue) {
        changes[field] = { old: oldValue || null, new: newValue || null };
      }
    });

    // 4. Validate: Must have at least 1 change
    if (Object.keys(changes).length === 0) {
      toast({
        title: "Không có thay đổi",
        description: "Vui lòng chỉnh sửa ít nhất 1 trường trước khi gửi yêu cầu.",
        variant: "destructive",
      });
      return;
    }

    // 5. Insert change request
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('employee_change_requests')
        .insert({
          employee_id: employee.id,
          request_type: 'personal_info',
          changes: changes,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Gửi yêu cầu thành công",
        description: "HR sẽ xem xét yêu cầu của bạn trong thời gian sớm nhất.",
      });

      setHasPendingRequest(true);
      onChangeTab('requests');
    } catch (error: any) {
      console.error('Error submitting change request:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi yêu cầu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAvatarUrl = avatarPreview || AvatarService.getAvatarUrl(employee.avatar_path);
  const initials = employee.full_name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Summary Card - Thông Tin Tổng Quan */}
      <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Thông Tin Nhân Viên
          </CardTitle>
          <CardDescription>
            Thông tin tổng quan về nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={currentAvatarUrl} alt={employee.full_name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                {/* Desktop: Hover Overlay */}
                <button
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 bg-black/50 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </button>
                
                {/* Mobile: Icon ở góc */}
                <button
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 md:hidden w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background cursor-pointer disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-primary-foreground" />
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              
              {/* Tên + Mã NV - Mobile Only (dưới avatar) */}
              <div className="md:hidden text-center">
                <h2 className="text-xl font-bold text-foreground">
                  {employee.full_name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {employee.employee_code}
                </p>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
              {/* Tên + Mã NV - Desktop Only */}
              <div className="hidden md:block">
                <h2 className="text-2xl font-bold text-foreground">
                  {employee.full_name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Mã NV: {employee.employee_code}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Chức vụ:</span>
                  <span className="font-medium">{employee.position}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Phòng ban:</span>
                  <span className="font-medium">{employee.department}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{employee.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Điện thoại:</span>
                  <span className="font-medium">{employee.phone || 'Chưa cập nhật'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Ngày vào:</span>
                  <span className="font-medium">
                    {new Date(employee.join_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Thâm niên:</span>
                  <span className="font-medium">{employee.seniority_months || 0} tháng</span>
                </div>

                {employee.current_address && (
                  <div className="flex items-start gap-2 text-sm md:col-span-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                    <span className="text-muted-foreground">Địa chỉ:</span>
                    <span className="font-medium flex-1">{employee.current_address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Thông Tin Cơ Bản - Combined Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Thông Tin Cơ Bản
            </CardTitle>
            <CardDescription>
              Thông tin hợp đồng, trạng thái, lương và các thông tin cá nhân
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SECTION 1: Loại Hợp Đồng & Trạng Thái */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Loại Hợp Đồng:</span>
                <span className="font-medium">{employee.employment_type || 'Chưa cập nhật'}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Trạng Thái:</span>
                <span className="font-medium">{employee.status || 'Chưa cập nhật'}</span>
              </div>
            </div>

            {/* SECTION 2: Lương & Phụ Cấp */}
            {(employee.salary_p1 > 0 || 
              employee.allowance_meal > 0 || 
              employee.allowance_fuel > 0 || 
              employee.allowance_phone > 0 || 
              employee.allowance_other > 0) && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Lương & Phụ Cấp
                </h3>
                <div className="space-y-2">
                  {employee.salary_p1 > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Lương Cơ Bản:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.salary_p1)}
                      </span>
                    </div>
                  )}
                  
                  {employee.allowance_meal > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4z" />
                      </svg>
                      <span className="text-muted-foreground">Phụ Cấp Ăn Trưa:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.allowance_meal)}
                      </span>
                    </div>
                  )}
                  
                  {employee.allowance_fuel > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-muted-foreground">Phụ Cấp Xăng Xe:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.allowance_fuel)}
                      </span>
                    </div>
                  )}
                  
                  {employee.allowance_phone > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Phụ Cấp Điện Thoại:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.allowance_phone)}
                      </span>
                    </div>
                  )}
                  
                  {employee.allowance_other > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-muted-foreground">Phụ Cấp Khác:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.allowance_other)}
                      </span>
                    </div>
                  )}
                  
                  {employee.total_fixed_salary > 0 && (
                    <div className="flex items-center gap-2 text-sm pt-2 mt-2 border-t">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-muted-foreground font-semibold">Tổng Thu Nhập Cố Định:</span>
                      <span className="font-bold text-primary">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.total_fixed_salary)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 3: Thông Tin Cá Nhân (Editable) */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Thông Tin Cá Nhân
              </h3>
              
              {hasPendingRequest && (
                <Alert variant="default" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Bạn có yêu cầu đang chờ duyệt. Không thể chỉnh sửa cho đến khi yêu cầu được xử lý.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Số Điện Thoại
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0901234567"
                    disabled={hasPendingRequest}
                    className="focus-visible:ring-primary"
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ngày Sinh
                  </Label>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    disabled={hasPendingRequest}
                    className="focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Địa Chỉ Hiện Tại
                </Label>
                <Input
                  value={formData.current_address}
                  onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                  placeholder="123 Đường ABC, Quận XYZ..."
                  disabled={hasPendingRequest}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* SECTION 4: Thông Tin Liên Hệ Khẩn Cấp */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Thông Tin Liên Hệ Khẩn Cấp
              </h3>

              <div>
                <Label className="text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Họ Tên
                </Label>
                <Input
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  disabled={hasPendingRequest}
                  className="focus-visible:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Số Điện Thoại
                  </Label>
                  <Input
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                    placeholder="0901234567"
                    disabled={hasPendingRequest}
                    className="focus-visible:ring-primary"
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Mối Quan Hệ
                  </Label>
                  <Input
                    value={formData.emergency_contact_relationship}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
                    placeholder="VD: Bố/Mẹ/Anh/Chị"
                    disabled={hasPendingRequest}
                    className="focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitChangeRequest}
              disabled={hasPendingRequest || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi Yêu Cầu Thay Đổi'
              )}
            </Button>

            {/* Note nhỏ ở dưới */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                💡 Thông tin hợp đồng và lương do HR quản lý. Thông tin cá nhân có thể yêu cầu thay đổi.
              </p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
