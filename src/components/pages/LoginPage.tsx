
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { resendVerificationEmail } from '@/services/authService';

interface LoginPageProps {
  onLogin: (email: string, password: string, rememberMe?: boolean) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password, rememberMe);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email của bạn.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingResend(true);
    try {
      await resendVerificationEmail(resendEmail);
      toast({
        title: "Email xác thực đã được gửi",
        description: `Email xác thực đã được gửi đến ${resendEmail}`,
        duration: 6000,
      });
      setShowResendVerification(false);
      setResendEmail('');
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể gửi lại email xác thực",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResend(false);
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast({
      title: "Đã xóa cache",
      description: "Trang sẽ được tải lại.",
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">ERP System</h1>
            </div>
            <h2 className="text-xl text-gray-600 mb-4">
              Hệ Thống Quản Lý Doanh Nghiệp
            </h2>
            <p className="text-gray-500 mb-8">
              Giải pháp quản lý toàn diện với kiến trúc modular, 
              hỗ trợ đa vai trò và phân quyền chi tiết.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Quản lý voucher/khuyến mãi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Phân quyền theo vai trò</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Giao diện responsive</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Kiến trúc modular</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Đăng Nhập</CardTitle>
              <CardDescription className="text-center">
                Nhập thông tin đăng nhập của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mật Khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Duy trì đăng nhập
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Đăng Nhập
                </Button>
              </form>

              {/* Employee OTP Login Link */}
              <div className="text-center border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Nhân viên?</p>
                <Link 
                  to="/employee-login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline inline-flex items-center gap-1"
                >
                  Đăng nhập bằng OTP qua Email
                  <Mail className="w-4 h-4" />
                </Link>
              </div>

              {/* Action Links */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                  
                  <button
                    type="button"
                    onClick={() => setShowResendVerification(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline bg-transparent border-none cursor-pointer p-0"
                  >
                    Gửi lại email xác thực
                  </button>
                </div>
                
                {/* Clear Cache Button */}
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearCache}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Không đăng nhập được? Xóa cache
                </Button>
              </div>

              {/* Footer Links */}
              <div className="text-center text-xs text-gray-400 space-x-4">
                <Button variant="link" className="text-xs p-0 h-auto">
                  Điều khoản dịch vụ
                </Button>
                <span>•</span>
                <Button variant="link" className="text-xs p-0 h-auto">
                  Chính sách bảo mật
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resend Verification Dialog */}
      <Dialog open={showResendVerification} onOpenChange={setShowResendVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Gửi Lại Email Xác Thực</span>
            </DialogTitle>
            <DialogDescription>
              Nhập địa chỉ email để gửi lại email xác thực tài khoản.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resend-email">Địa chỉ Email</Label>
              <Input
                id="resend-email"
                type="email"
                placeholder="example@company.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowResendVerification(false)}
                disabled={isLoadingResend}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1"
                onClick={handleResendVerification}
                disabled={isLoadingResend}
              >
                {isLoadingResend ? 'Đang gửi...' : 'Gửi Email'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
