import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Shield } from 'lucide-react';
import { CreatePasswordDialog } from '@/components/auth/CreatePasswordDialog';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export function EmployeeSecurityTab() {
  const [hasPassword, setHasPassword] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkPasswordStatus = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('password_change_required')
        .eq('id', user.id)
        .single();
      
      setHasPassword(!profile?.password_change_required);
    } catch (error) {
      console.error('Error checking password status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPasswordStatus();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!hasPassword) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Tạo Mật Khẩu
            </CardTitle>
            <CardDescription>
              Bạn chưa có mật khẩu. Tạo mật khẩu để đăng nhập nhanh hơn và có thể truy cập ERP (nếu được cấp quyền).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Lock className="w-4 h-4 mr-2" />
              Tạo Mật Khẩu Ngay
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lợi Ích Khi Có Mật Khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Đăng nhập nhanh hơn, không cần chờ mã OTP</li>
              <li>• Truy cập được cả ESS và ERP (nếu có quyền)</li>
              <li>• Không phụ thuộc vào email để đăng nhập</li>
              <li>• Bảo mật tài khoản tốt hơn</li>
            </ul>
          </CardContent>
        </Card>

        <CreatePasswordDialog
          isOpen={showCreateDialog}
          onClose={() => {
            setShowCreateDialog(false);
            checkPasswordStatus(); // Refresh password status
          }}
          isRequired={false}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Bảo Mật Tài Khoản
          </CardTitle>
          <CardDescription>
            Bạn đã có mật khẩu. Có thể đổi mật khẩu bên dưới.
          </CardDescription>
        </CardHeader>
      </Card>

      <ChangePasswordForm />
    </div>
  );
}
