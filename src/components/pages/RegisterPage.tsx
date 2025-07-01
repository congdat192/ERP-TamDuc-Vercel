
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Building2, Eye, EyeOff, Phone, Mail, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { validatePassword, validatePhone, validateEmail, getPasswordStrength } from '@/services/registerService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface RegisterPageProps {
  onRegister: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterPage({ onRegister, isLoading = false }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+84',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Họ tên phải có ít nhất 2 ký tự';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Email không đúng định dạng';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Số điện thoại phải có định dạng +84xxxxxxxxx';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors[0];
      }
    }

    // Confirm password validation
    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Vui lòng nhập lại mật khẩu';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Mật khẩu không khớp';
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đồng ý với điều khoản dịch vụ",
        variant: "destructive",
      });
      return false;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onRegister(formData);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
              Đăng Ký Tài Khoản Mới
            </h2>
            <p className="text-gray-500 mb-8">
              Tạo tài khoản để bắt đầu sử dụng hệ thống quản lý doanh nghiệp 
              với đầy đủ tính năng và hỗ trợ đa vai trò.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Miễn phí dùng thử</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Dễ dàng sử dụng</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Hỗ trợ 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Bảo mật cao</span>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Đăng Ký</CardTitle>
              <CardDescription className="text-center">
                Điền thông tin để tạo tài khoản mới
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
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
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Số Điện Thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+84xxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{formErrors.phone}</span>
                    </p>
                  )}
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{passwordStrength.text}</span>
                      </div>
                    </div>
                  )}
                  
                  {formErrors.password && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{formErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Nhập Lại Mật Khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={formData.password_confirmation}
                      onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
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
                  
                  {/* Password Match Indicator */}
                  {formData.password_confirmation && (
                    <div className="flex items-center space-x-1">
                      {formData.password === formData.password_confirmation ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">Mật khẩu khớp</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">Mật khẩu không khớp</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {formErrors.password_confirmation && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{formErrors.password_confirmation}</span>
                    </p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    disabled={isLoading}
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="font-normal">
                      Tôi đồng ý với{' '}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-800"
                        onClick={() => setShowTermsDialog(true)}
                      >
                        Điều khoản dịch vụ
                      </Button>
                      {' '}và{' '}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-800"
                        onClick={() => setShowTermsDialog(true)}
                      >
                        Chính sách bảo mật
                      </Button>
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Terms Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Điều Khoản Dịch Vụ và Chính Sách Bảo Mật</DialogTitle>
            <DialogDescription>
              Vui lòng đọc kỹ các điều khoản sau đây
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Điều Khoản Sử Dụng</h3>
              <p className="text-gray-600">
                Bằng việc sử dụng hệ thống ERP của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Quyền và Trách Nhiệm</h3>
              <p className="text-gray-600">
                Người dùng có trách nhiệm bảo mật thông tin đăng nhập và sử dụng hệ thống một cách hợp lý.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Bảo Mật Thông Tin</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và không chia sẻ với bên thứ ba khi chưa có sự đồng ý.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Liên Hệ</h3>
              <p className="text-gray-600">
                Nếu có thắc mắc, vui lòng liên hệ với chúng tôi qua email: support@erpsystem.com
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowTermsDialog(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
