import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { resetPassword } from '@/services/authService';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["password_confirmation"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  // Read token from hash fragment (#access_token=xxx&type=recovery)
  useEffect(() => {
    const checkAuth = async () => {
      // Parse hash fragment from Supabase Auth redirect
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      console.log('🔍 Hash params:', { accessToken: !!accessToken, type });
      
      if (type === 'recovery' && accessToken) {
        // User is authenticated by Supabase Auth automatically
        setIsAuthenticated(true);
        console.log('✅ User authenticated for password recovery');
      } else {
        setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.');
        console.error('❌ Invalid recovery link');
      }
    };
    
    checkAuth();
  }, []);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!isAuthenticated) {
      setError('Phiên làm việc không hợp lệ. Vui lòng yêu cầu link reset mới.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(data.password);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.' 
          } 
        });
      }, 3000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Thành Công!</CardTitle>
            <CardDescription>
              Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển đến trang đăng nhập trong giây lát.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Đặt Lại Mật Khẩu</CardTitle>
          <CardDescription className="text-center">
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {(!isAuthenticated) ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu mới"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập lại mật khẩu mới"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đặt Lại Mật Khẩu
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="text-sm"
            >
              Quay lại đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};