
import { useAuth } from '@/components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginPage as LoginComponent } from '@/components/pages/LoginPage';

export function LoginPage() {
  const { isAuthenticated, currentUser, login, loginAttempts } = useAuth();
  const navigate = useNavigate();

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
    const success = await login(email, password);
    if (success) {
      // Navigation will be handled by useEffect
    }
  };

  // Demo users for quick login (now using email)
  const mockUsers = [
    {
      id: '1',
      username: 'admin@company.com',
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
      username: 'voucher.admin@company.com',
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
      username: 'telesales@company.com',
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
  ];

  return (
    <LoginComponent 
      onLogin={handleLogin}
      mockUsers={mockUsers}
      loginAttempts={loginAttempts}
    />
  );
}
