
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Eye, EyeOff, User, Mail, Lock, Phone, MailCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '@/services/registerService';
import { resendVerificationEmail } from '@/services/authService';
import { useEffect } from 'react';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResendVerification = async () => {
    if (resendCountdown > 0 || !formData.email) return;

    try {
      await resendVerificationEmail(formData.email);
      setResendCountdown(60);
      toast({
        title: "Email đã được gửi",
        description: "Vui lòng kiểm tra hộp thư của bạn.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể gửi lại email",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đồng ý với điều khoản dịch vụ",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      // Show success message without auto-navigation
      setShowSuccessMessage(true);
      setResendCountdown(60);

      toast({
        title: "Đăng ký thành công! 🎉",
        description: "Vui lòng kiểm tra email và nhấp vào liên kết xác thực.",
        duration: 8000,
      });

    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Đăng ký thất bại",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            Tạo Tài Khoản Mới
          </h2>
          <p className="text-gray-500 mb-8">
            Đăng ký để truy cập hệ thống quản lý doanh nghiệp toàn diện
            với các tính năng hiện đại và bảo mật cao.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Miễn phí dùng thử</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Bảo mật cao</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Hỗ trợ 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Dễ sử dụng</span>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {showSuccessMessage ? 'Kiểm tra email của bạn' : 'Đăng Ký'}
            </CardTitle>
            <CardDescription className="text-center">
              {showSuccessMessage 
                ? 'Chúng tôi đã gửi email xác thực đến địa chỉ của bạn'
                : 'Tạo tài khoản mới để bắt đầu'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {showSuccessMessage ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4 py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <MailCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Email xác thực đã được gửi đến
                    </p>
                    <p className="font-medium">{formData.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác thực để hoàn tất đăng ký.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResendVerification}
                    disabled={resendCountdown > 0}
                  >
                    {resendCountdown > 0 
                      ? `Gửi lại sau ${resendCountdown}s` 
                      : 'Gửi lại email xác thực'}
                  </Button>
                  
                  <Button
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    Đi đến trang đăng nhập
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ và Tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Số Điện Thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại (+84...)"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật Khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  Tôi đồng ý với{' '}
                  <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                    Điều khoản dịch vụ
                  </Button>
                  {' '}và{' '}
                  <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                    Chính sách bảo mật
                  </Button>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
              </Button>
            </form>
            )}

            {/* Login Link - Always visible */}
            {!showSuccessMessage && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
