
import { useAuth } from '@/components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginPage as LoginComponent } from '@/components/pages/LoginPage';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const { 
    isAuthenticated, 
    currentUser, 
    login, 
    loginAttempts, 
    isLoading, 
    apiMode, 
    toggleApiMode 
  } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Redirect based on user role
      if (currentUser.role === 'platform-admin') {
        navigate('/platformadmin');
      } else {
        navigate('/ERP/Dashboard');
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Đăng nhập thành công",
          description: `Chào mừng ${apiMode ? 'bạn' : 'đã quay trở lại'}!`,
        });
        // Navigation will be handled by useEffect
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: apiMode 
            ? "Email hoặc mật khẩu không chính xác. Vui lòng thử lại."
            : "Thông tin đăng nhập không chính xác. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi đăng nhập",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleToggleApiMode = () => {
    toggleApiMode();
    toast({
      title: "Chế độ đã thay đổi",
      description: apiMode ? "Chuyển sang chế độ Demo" : "Chuyển sang chế độ API",
    });
  };

  // Mock users for the login component
  const mockUsers = [
    {
      id: '1',
      username: 'admin',
      fullName: 'Quản Trị Viên',
      role: 'erp-admin' as const,
      email: 'admin@company.com',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: true,
      isActive: true,
      permissions: {
        modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'marketing', 'system-settings', 'user-management'] as any[],
        voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'] as any[],
        canManageUsers: true,
        canViewAllVouchers: true,
      },
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: false,
        sessionTimeoutMinutes: 60,
      },
      activities: [],
    },
    {
      id: '2',
      username: 'voucher_admin',
      fullName: 'Quản Lý Voucher',
      role: 'voucher-admin' as const,
      email: 'voucher.admin@company.com',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: true,
      isActive: true,
      permissions: {
        modules: ['dashboard', 'voucher'] as any[],
        voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'] as any[],
        canManageUsers: false,
        canViewAllVouchers: true,
      },
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: false,
        sessionTimeoutMinutes: 60,
      },
      activities: [],
    },
    {
      id: '3',
      username: 'telesales',
      fullName: 'Nhân Viên Telesales',
      role: 'telesales' as const,
      email: 'telesales@company.com',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: true,
      isActive: true,
      permissions: {
        modules: ['dashboard', 'customers', 'voucher'] as any[],
        voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-leaderboard'] as any[],
        canManageUsers: false,
        canViewAllVouchers: false,
      },
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: false,
        sessionTimeoutMinutes: 60,
      },
      activities: [],
    },
    {
      id: '4',
      username: 'custom',
      fullName: 'Người Dùng Tùy Chỉnh',
      role: 'custom' as const,
      email: 'custom@company.com',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: true,
      isActive: true,
      permissions: {
        modules: ['dashboard', 'customers'] as any[],
        voucherFeatures: [] as any[],
        canManageUsers: false,
        canViewAllVouchers: false,
      },
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: false,
        sessionTimeoutMinutes: 60,
      },
      activities: [],
    },
    {
      id: '5',
      username: 'platform_admin',
      fullName: 'Quản Trị Nền Tảng',
      role: 'platform-admin' as const,
      email: 'platform.admin@company.com',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: true,
      isActive: true,
      permissions: {
        modules: [] as any[],
        voucherFeatures: [] as any[],
        canManageUsers: true,
        canViewAllVouchers: true,
      },
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: false,
        sessionTimeoutMinutes: 60,
      },
      activities: [],
    },
  ];

  return (
    <LoginComponent 
      onLogin={handleLogin}
      mockUsers={mockUsers}
      loginAttempts={loginAttempts}
      isLoading={isLoading}
      apiMode={apiMode}
      onToggleApiMode={handleToggleApiMode}
    />
  );
}
