import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, KeyRound, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreatePasswordDialog } from '@/components/auth/CreatePasswordDialog';

type Step = 'email' | 'otp';

interface EmployeeData {
  id: string;
  fullName: string;
  employeeCode: string;
  department: string;
  position: string;
}

export function EmployeeOTPLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'otp' | 'password'>('otp');
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showCreatePasswordDialog, setShowCreatePasswordDialog] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);

  // ============================================
  // STEP 1: SEND OTP VIA CUSTOM EDGE FUNCTION
  // ============================================
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('📧 Sending OTP via custom Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('send-employee-otp', {
        body: { email: email.toLowerCase() }
      });

      if (error) throw error;

      if (!data.success) {
        toast({
          title: 'Lỗi',
          description: data.message || 'Không thể gửi mã OTP',
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ OTP sent successfully');
      
      // Optimistic UI: Chuyển màn hình ngay lập tức
      setStep('otp');
      startResendCountdown();
      
      toast({
        title: 'Mã OTP đã được gửi',
        description: `Vui lòng kiểm tra email ${email}. Email có thể mất vài giây để đến hộp thư của bạn.`,
      });

    } catch (error: any) {
      console.error('❌ Error:', error);
      
      // Handle rate limit errors
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        toast({
          title: 'Quá nhiều yêu cầu',
          description: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Lỗi',
          description: error.message || 'Không thể gửi mã OTP. Vui lòng thử lại.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // STEP 2: VERIFY OTP VIA CUSTOM EDGE FUNCTION
  // ============================================
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: 'Mã OTP không hợp lệ',
        description: 'Vui lòng nhập đầy đủ 6 số',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Step 1: Verifying OTP with backend...');
      
      // Step 1: Verify OTP and get hashed_token from backend
      const { data, error } = await supabase.functions.invoke('verify-employee-otp', {
        body: {
          email: email.toLowerCase(),
          otpCode: otp
        }
      });

      if (error) throw error;

      if (!data.success || !data.hashed_token) {
        throw new Error(data.message || 'Không thể xác thực OTP');
      }

      console.log('✅ Step 1 complete: OTP verified by backend');
      
      // Cache profile data BEFORE creating session (OPTIMIZATION 3)
      if (data.profile) {
        sessionStorage.setItem('cached_employee_profile', JSON.stringify(data.profile));
        console.log('✅ Profile data cached for instant load');
      }
      
      console.log('🔐 Step 2: Creating session with hashed_token...');

      // Step 2: Use hashed_token to verify OTP and create session
      const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: data.hashed_token,
        type: 'email'
      });

      if (verifyError) {
        console.error('❌ Step 2 failed:', verifyError);
        throw new Error('Không thể tạo phiên đăng nhập. Vui lòng thử lại.');
      }

      if (!sessionData.session) {
        throw new Error('Không nhận được session token');
      }

      console.log('✅ Step 2 complete: Session created');
      console.log('📦 Session:', {
        access_token: sessionData.session.access_token ? '✅ Present' : '❌ Missing',
        user_id: sessionData.user?.id
      });

      // Check if user already has a password
      const { data: profile } = await supabase
        .from('profiles')
        .select('password_change_required')
        .eq('id', sessionData.user.id)
        .single();

      const hasPassword = !profile?.password_change_required;

      // Check if user has ERP access
      const { data: employee } = await supabase
        .from('employees')
        .select('is_employee_only, full_name')
        .eq('user_id', sessionData.user.id)
        .maybeSingle();

      const hasERPAccess = employee?.is_employee_only === false;

      toast({
        title: 'Đăng nhập thành công!',
        description: `Chào mừng ${employee?.full_name || 'bạn'} quay trở lại`,
      });

      // Navigate to /my-profile - Password prompt will be handled there
      navigate('/my-profile');

    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      if (error.message?.includes('expired') || error.message?.includes('hết hạn')) {
        toast({
          title: 'Mã OTP đã hết hạn',
          description: 'Vui lòng yêu cầu gửi lại mã mới.',
          variant: 'destructive',
        });
      } else if (error.message?.includes('invalid') || error.message?.includes('không chính xác')) {
        toast({
          title: 'Mã OTP không chính xác',
          description: 'Vui lòng kiểm tra lại mã trong email.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Lỗi xác thực',
          description: error.message || 'Mã OTP không chính xác hoặc đã hết hạn',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RESEND OTP
  // ============================================
  const startResendCountdown = () => {
    setResendCountdown(60); // 60 seconds cooldown
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0) return;
    
    setOtp(''); // Clear current OTP
    await handleSendOTP(new Event('submit') as any);
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setEmployeeData(null);
  };

  // ============================================
  // PASSWORD LOGIN
  // ============================================
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password
      });

      if (error) throw error;

      // Check if user is an employee
      const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('is_employee_only, full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (empError || !employee) {
        throw new Error('Tài khoản không phải nhân viên. Vui lòng sử dụng /login để đăng nhập hệ thống ERP.');
      }

      toast({
        title: 'Đăng nhập thành công!',
        description: `Chào mừng ${employee.full_name}`,
      });

      navigate('/my-profile');

    } catch (error: any) {
      toast({
        title: 'Đăng nhập thất bại',
        description: error.message || 'Email hoặc mật khẩu không chính xác',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Đăng Nhập Nhân Viên</CardTitle>
          <CardDescription>Chọn phương thức đăng nhập bên dưới</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'otp' | 'password')} defaultValue="otp">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="otp">
                <Mail className="w-4 h-4 mr-2" />
                OTP qua Email
              </TabsTrigger>
              <TabsTrigger value="password">
                <Lock className="w-4 h-4 mr-2" />
                Mật khẩu
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OTP LOGIN */}
            <TabsContent value="otp">
              {step === 'email' ? (
                // ============================================
                // FORM: EMAIL INPUT
                // ============================================
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nhanvien@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="text-base"
                      autoFocus
                    />
                  </div>

                  <Alert>
                    <AlertDescription className="text-sm">
                      💡 Chỉ nhân viên có email trong hệ thống HR mới có thể đăng nhập. 
                      Mã OTP sẽ có hiệu lực trong <strong>5 phút</strong>.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !email}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi Mã OTP'
                    )}
                  </Button>
                </form>
              ) : (
                // ============================================
                // FORM: OTP INPUT
                // ============================================
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  {employeeData && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription className="text-sm">
                        <strong>{employeeData.fullName}</strong><br />
                        {employeeData.employeeCode} • {employeeData.position}<br />
                        {employeeData.department}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="otp">Mã OTP (6 số)</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={loading}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription className="text-sm">
                      ⏱️ Mã OTP có hiệu lực trong <strong>5 phút</strong>. 
                      Vui lòng kiểm tra hộp thư đến hoặc thư spam.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xác thực...
                      </>
                    ) : (
                      'Xác Thực'
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToEmail}
                      disabled={loading}
                      className="gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Đổi email
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOTP}
                      disabled={loading || resendCountdown > 0}
                    >
                      {resendCountdown > 0 
                        ? `Gửi lại (${resendCountdown}s)` 
                        : 'Gửi lại mã'
                      }
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>

            {/* TAB 2: PASSWORD LOGIN */}
            <TabsContent value="password">
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-password">Email</Label>
                  <Input
                    id="email-password"
                    type="email"
                    placeholder="nhanvien@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Alert>
                  <AlertDescription className="text-sm">
                    💡 Chưa có mật khẩu? Đăng nhập bằng OTP và tạo mật khẩu sau đó.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Link to admin login */}
          <div className="text-center mt-4 border-t pt-4">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/login')}
              className="text-sm"
            >
              Đăng nhập hệ thống ERP (Admin/Manager) →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog tạo mật khẩu */}
      <CreatePasswordDialog
        isOpen={showCreatePasswordDialog}
        onClose={() => setShowCreatePasswordDialog(false)}
        isRequired={passwordRequired}
      />
    </div>
  );
}
