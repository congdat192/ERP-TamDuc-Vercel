import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('🔍 [AuthCallback] Processing Supabase redirect...');
      
      try {
        // Parse hash fragments (Supabase default format)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        let tokenHash = hashParams.get('token_hash');
        let type = hashParams.get('type') || 'email';
        let accessToken = hashParams.get('access_token');
        
        // Fallback to query params if hash is empty
        if (!tokenHash && !accessToken) {
          const queryParams = new URLSearchParams(window.location.search);
          tokenHash = queryParams.get('token_hash');
          type = queryParams.get('type') || 'email';
          accessToken = queryParams.get('access_token');
        }

        console.log('📧 [AuthCallback] Parsed params:', { 
          hasTokenHash: !!tokenHash, 
          hasAccessToken: !!accessToken,
          type 
        });

        // If we have access_token, email is verified but force re-login
        if (accessToken) {
          console.log('✅ [AuthCallback] Email verified, logging out session for security...');
          
          // Sign out to force user to login again (more secure)
          await supabase.auth.signOut();
          
          setIsVerified(true);
          toast({
            title: "Xác thực thành công",
            description: "Email của bạn đã được xác thực. Vui lòng đăng nhập để tiếp tục.",
          });
          setTimeout(() => {
            navigate('/login?verified=true', { replace: true });
          }, 2000);
          return;
        }

        // If we have token_hash, verify it
        if (tokenHash) {
          console.log('🔐 [AuthCallback] Verifying OTP token...');
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          if (verifyError) {
            console.error('❌ [AuthCallback] Verification failed:', verifyError);
            throw new Error(verifyError.message || 'Xác thực thất bại');
          }

          if (!data.session) {
            console.error('❌ [AuthCallback] No session created after verification');
            throw new Error('Xác thực thất bại - không tạo được phiên làm việc');
          }

          console.log('✅ [AuthCallback] Verification successful');
          setIsVerified(true);
          
          toast({
            title: "Xác thực thành công",
            description: "Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.",
          });

          // Redirect to login for fresh login
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        // No valid params found
        console.error('❌ [AuthCallback] No valid auth params found');
        throw new Error('Link xác thực không hợp lệ hoặc đã hết hạn');

      } catch (err) {
        console.error('❌ [AuthCallback] Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xác thực';
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

    handleAuthCallback();
  }, [navigate, toast]);

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
                <div className="bg-blue-100 w-full h-full rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : isVerified ? (
                <div className="bg-green-100 w-full h-full rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 w-full h-full rounded-full flex items-center justify-center">
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
               isVerified ? 'Email của bạn đã được xác thực thành công.' :
               error || 'Có lỗi xảy ra khi xác thực email của bạn.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!isVerifying && !isVerified && (
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/login', { replace: true })}
                >
                  Quay lại đăng nhập
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/register', { replace: true })}
                >
                  Đăng ký lại
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
