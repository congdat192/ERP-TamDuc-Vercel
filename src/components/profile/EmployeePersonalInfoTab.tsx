import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { z } from 'zod';

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

  return (
    <div className="space-y-6">
      {/* Card 1: Read-only fields */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Cơ Bản (Không Thể Thay Đổi)</CardTitle>
          <CardDescription>
            Các thông tin này chỉ có thể thay đổi bởi HR Admin
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Mã Nhân Viên</Label>
            <Input value={employee.employee_code} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Họ Tên</Label>
            <Input value={employee.full_name} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={employee.email} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Phòng Ban</Label>
            <Input value={employee.department} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Chức Vụ</Label>
            <Input value={employee.position} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Ngày Vào Làm</Label>
            <Input
              value={employee.join_date ? format(new Date(employee.join_date), 'dd/MM/yyyy') : ''}
              disabled
              className="bg-muted"
            />
          </div>
          <div>
            <Label>Loại Hợp Đồng</Label>
            <Input value={employee.employment_type || 'N/A'} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Trạng Thái</Label>
            <Input value={employee.status || 'N/A'} disabled className="bg-muted" />
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Editable fields */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Có Thể Yêu Cầu Thay Đổi</CardTitle>
          <CardDescription>
            Chỉnh sửa thông tin và gửi yêu cầu để HR phê duyệt
          </CardDescription>
          {hasPendingRequest && (
            <Alert variant="default" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Bạn có yêu cầu đang chờ duyệt. Không thể gửi yêu cầu mới cho đến khi yêu cầu hiện tại được xử lý.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Số Điện Thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
                disabled={hasPendingRequest}
              />
            </div>
            <div>
              <Label htmlFor="birth_date">Ngày Sinh</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                disabled={hasPendingRequest}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="current_address">Địa Chỉ Hiện Tại</Label>
            <Input
              id="current_address"
              value={formData.current_address}
              onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
              placeholder="123 Đường ABC, Quận XYZ..."
              disabled={hasPendingRequest}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-4">Thông Tin Liên Hệ Khẩn Cấp</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergency_contact_name">Họ Tên</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  disabled={hasPendingRequest}
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact_phone">Số Điện Thoại</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                  placeholder="0901234567"
                  disabled={hasPendingRequest}
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact_relationship">Quan Hệ</Label>
                <Input
                  id="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
                  placeholder="Cha, Mẹ, Vợ, Chồng..."
                  disabled={hasPendingRequest}
                />
              </div>
            </div>
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
