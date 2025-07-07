
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Mail, Building2, Loader2 } from 'lucide-react';
import { verifyEmail, resendVerificationEmail } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export function EmailVerificationPage() {
  const { id, hash } = useParams<{ id: string; hash: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const performVerification = async () => {
      console.log('🔍 [EmailVerification] Starting verification with params:', { id, hash });
      
      if (!id || !hash) {
        console.error('❌ [EmailVerification] Missing parameters:', { id, hash });
        setError('Link xác thực không hợp lệ - thiếu tham số');
        setIsVerifying(false);
        return;
      }

      try {
        console.log('📧 [EmailVerification] Calling verifyEmail API');
        await verifyEmail(id, hash);
        console.log('✅ [EmailVerification] Verification successful');
        setIsVerified(true);
        toast({
          title: "Xác thực thành công",
          description: "Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.",
        });
      } catch (error) {
        console.error('❌ [EmailVerification] Verification failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Xác thực email thất bại';
        setError(errorMessage);
        toast({
          title: "Xác thực thất bại",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    performVerification();
  }, [id, hash, toast]);

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email của bạn.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      console.log('📧 [EmailVerification] Resending verification email to:', resendEmail);
      await resendVerificationEmail(resendEmail);
      toast({
        title: "Email đã được gửi",
        description: `Email xác thực đã được gửi đến ${resendEmail}`,
      });
      setResendEmail('');
    } catch (error) {
      console.error('❌ [EmailVerification] Resend failed:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể gửi lại email xác thực",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ERP System</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              {isVerifying ? (
                <div className="bg-blue-100">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : isVerified ? (
                <div className="bg-green-100">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
            </div>
            
            <CardTitle className="text-xl">
              {isVerifying ? 'Đang xác thực email...' : 
               isVerified ? 'Xác thực thành công!' : 
               'Xác thực thất bại'}
            </CardTitle>
            
            <CardDescription>
              {isVerifying ? 'Vui lòng chờ trong giây lát' :
               isVerified ? 'Email của bạn đã được xác thực thành công. Bạn có thể đăng nhập ngay bây giờ.' :
               error || 'Có lỗi xảy ra khi xác thực email của bạn.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isVerified ? (
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/login">
                    Đăng nhập ngay
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">
                    Về trang chủ
                  </Link>
                </Button>
              </div>
            ) : !isVerifying && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resend-email">Gửi lại email xác thực</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      disabled={isResending}
                    />
                    <Button 
                      onClick={handleResendVerification}
                      disabled={isResending || !resendEmail}
                    >
                      {isResending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login">
                      Quay lại đăng nhập
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
