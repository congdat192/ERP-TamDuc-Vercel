
import { LoginCredentials } from '@/types/auth';

// Function to simulate user login
export const login = async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
  if (!email || !password) {
    return { success: false, error: 'Vui lòng nhập email và mật khẩu.' };
  }

  // Mock authentication - in real app, this would call your API
  if (email === 'admin@example.com' && password === 'password') {
    const user = {
      id: '1',
      fullName: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      role: 'erp-admin' as const,
      permissions: {
        modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'marketing', 'affiliate', 'system-settings', 'user-management'],
        voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
        affiliateFeatures: ['affiliate-dashboard', 'referrer-management', 'voucher-monitoring', 'commission-tracking', 'affiliate-analytics', 'affiliate-reports'],
        canManageUsers: true,
        canViewAllVouchers: true
      },
      isActive: true,
      status: 'active' as const,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      emailVerified: true,
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 5,
        passwordChangeRequired: false
      },
      activities: []
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    return { success: true, user };
  } else {
    return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
  }
};

export const logout = async (): Promise<boolean> => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAuthenticated');
  return true;
};

export const checkAuthentication = (): boolean => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated;
};

export const getCurrentUser = (): any => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// New exported functions for API compatibility
export const loginUser = async (credentials: { email: string; password: string }) => {
  const result = await login(credentials.email, credentials.password);
  if (result.success) {
    // Store token for API compatibility
    localStorage.setItem('auth_token', 'mock-token');
    return { user: result.user };
  } else {
    throw new Error(result.error || 'Login failed');
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('auth_token');
  return await logout();
};

export const getUserProfile = async () => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
};

export const updateUserProfile = async (profileData: any) => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Mock update
  const updatedUser = { ...user, ...profileData };
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  return updatedUser;
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
  // Mock password update
  if (currentPassword === 'password') {
    return { success: true };
  } else {
    throw new Error('Current password is incorrect');
  }
};

export const verifyEmail = async (email: string, hash: string) => {
  // Mock email verification
  return { success: true };
};

export const resendVerificationEmail = async (email: string) => {
  // Mock resend verification
  return { success: true };
};

export const forgotPassword = async (email: string) => {
  // Mock forgot password
  return { success: true };
};

export const resetPassword = async (token: string) => {
  // Mock reset password
  return { success: true };
};
