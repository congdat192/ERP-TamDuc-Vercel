import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Building2, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { User as UserType } from '@/types/auth';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock users for demo display
const mockUsers: UserType[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Quản Trị Viên',
    role: 'erp-admin',
    email: 'admin@company.com',
    phone: '0901234567',
    status: 'active',
    notes: 'System Administrator',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-05-29T14:30:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'voucher', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'system-settings', 'user-management', 'audit-log', 'role-permissions'],
      features: ['create', 'read', 'update', 'delete', 'export', 'import', 'approve', 'manage_users', 'manage_roles', 'view_audit_logs']
    },
    securitySettings: {
      twoFactorEnabled: true,
      loginAttemptLimit: 5,
      passwordChangeRequired: false,
      lastPasswordChange: new Date('2024-01-15'),
      sessionTimeoutMinutes: 480
    },
    activities: []
  },
  {
    id: '2',
    username: 'voucher_admin',
    fullName: 'Quản Lý Voucher',
    role: 'voucher-admin',
    email: 'voucher.admin@company.com',
    phone: '0901234568',
    status: 'active',
    notes: 'Voucher Module Manager',
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date('2024-05-29T16:45:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'voucher'],
      features: ['create', 'read', 'update', 'delete', 'export']
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: false,
      sessionTimeoutMinutes: 240
    },
    activities: []
  },
  {
    id: '3',
    username: 'telesales',
    fullName: 'Nhân Viên Telesales',
    role: 'telesales',
    email: 'telesales@company.com',
    phone: '0901234569',
    status: 'locked',
    notes: 'Telesales Staff - Temporary Lock',
    createdAt: new Date('2024-03-05'),
    lastLogin: new Date('2024-05-25T09:15:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'customers', 'sales'],
      features: ['create', 'read', 'update']
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: true,
      sessionTimeoutMinutes: 120
    },
    activities: []
  },
  {
    id: '4',
    username: 'custom',
    fullName: 'Người Dùng Tùy Chỉnh',
    role: 'custom',
    email: 'custom@company.com',
    phone: '0901234570',
    status: 'pending_verification',
    notes: 'New employee - pending email verification',
    createdAt: new Date('2024-05-28'),
    lastLogin: undefined,
    emailVerified: false,
    permissions: {
      modules: ['dashboard'],
      features: ['read']
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: true,
      sessionTimeoutMinutes: 120
    },
    activities: []
  },
  {
    id: '5',
    username: 'platform_admin',
    fullName: 'Quản Trị Nền Tảng',
    role: 'platform-admin',
    email: 'platform.admin@company.com',
    phone: '0901234571',
    status: 'active',
    notes: 'Platform Super Administrator',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-05-30T10:00:00'),
    emailVerified: true,
    permissions: {
      modules: ['platform-admin'],
      features: ['all']
    },
    securitySettings: {
      twoFactorEnabled: true,
      loginAttemptLimit: 5,
      passwordChangeRequired: false,
      lastPasswordChange: new Date('2024-01-01'),
      sessionTimeoutMinutes: 480
    },
    activities: []
  }
];

export function LoginPage() {
  const { isLoggedIn, isLoading, loginAttempts, login } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const from = location.state?.from?.pathname || '/erp';

  // Redirect if already logged in
  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  const isAccountLocked = loginAttempts >= 3;
  const remainingAttempts = Math.max(0, 3 - loginAttempts);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAccountLocked) {
      toast({
        title: "Tài khoản bị khóa",
        description: "Tài khoản đã bị khóa do quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.",
        variant: "destructive",
      });
      return;
    }
    
    if (username && password) {
      await login(username, password, rememberMe);
    }
  };

  const handleQuickLogin = async (userType: string) => {
    if (isAccountLocked) return;
    
    const user = mockUsers.find(u => u.username === userType);
    if (user) {
      setUsername(user.username);
      setPassword('demo');
      await login(user.username, 'demo', rememberMe);
    }
  };

  const handleForgotPassword = () => {
    if (!forgotPasswordEmail) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email của bạn.",
        variant: "destructive",
      });
      return;
    }

    // Simulate password reset
    toast({
      title: "Email đã được gửi",
      description: `Hướng dẫn đặt lại mật khẩu đã được gửi đến ${forgotPasswordEmail}`,
    });
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'erp-admin': return 'Quản Trị ERP';
      case 'voucher-admin': return 'Quản Lý Voucher';
      case 'telesales': return 'Nhân Viên Telesales';
      case 'custom': return 'Vai Trò Tùy Chỉnh';
      case 'platform-admin': return 'Quản Trị Nền Tảng';
      default: return 'Người Dùng';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'erp-admin': return 'bg-red-100 text-red-800';
      case 'voucher-admin': return 'bg-blue-100 text-blue-800';
      case 'telesales': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      case 'platform-admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                Chọn tài khoản demo hoặc đăng nhập thủ công
              </CardDescription>
              
              {/* Account Lockout Warning */}
              {isAccountLocked && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    Tài khoản đã bị khóa tạm thời
                  </span>
                </div>
              )}
              
              {/* Failed Attempts Warning */}
              {loginAttempts > 0 && !isAccountLocked && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-700">
                    Còn lại {remainingAttempts} lần thử đăng nhập
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Login Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Đăng Nhập Nhanh (Demo)</h3>
                <div className="grid grid-cols-1 gap-2">
                  {mockUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant="outline"
                      onClick={() => handleQuickLogin(user.username)}
                      className="justify-between h-auto p-3"
                      disabled={isAccountLocked || isLoading}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4" />
                        <div className="text-left">
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-xs text-gray-500">{user.username}</div>
                        </div>
                      </div>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Hoặc</span>
                </div>
              </div>

              {/* Manual Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên Đăng Nhập</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isAccountLocked || isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mật Khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isAccountLocked || isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isAccountLocked || isLoading}
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
                    disabled={isAccountLocked || isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Duy trì đăng nhập
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isAccountLocked || isLoading}
                >
                  Đăng Nhập
                </Button>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setShowForgotPassword(true)}
                  disabled={isLoading}
                >
                  Quên mật khẩu?
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>Demo: Sử dụng bất kỳ mật khẩu nào</p>
                <p>Usernames: admin, voucher_admin, telesales, custom</p>
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

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Quên Mật Khẩu</span>
            </DialogTitle>
            <DialogDescription>
              Nhập địa chỉ email của bạn để nhận hướng dẫn đặt lại mật khẩu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Địa chỉ Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="example@company.com"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowForgotPassword(false)}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1"
                onClick={handleForgotPassword}
              >
                Gửi Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
