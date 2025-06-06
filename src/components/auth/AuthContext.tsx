import React, { createContext, useContext, useState } from 'react';
import { User } from '@/types/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAttempts: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Quản Trị Viên',
    role: 'erp-admin',
    email: 'admin@company.com',
    status: 'active',
    createdAt: new Date(),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'system-settings', 'user-management'],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
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
    role: 'voucher-admin',
    email: 'voucher.admin@company.com',
    status: 'active',
    createdAt: new Date(),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
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
    role: 'telesales',
    email: 'telesales@company.com',
    status: 'active',
    createdAt: new Date(),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'customers', 'voucher'],
      voucherFeatures: ['issue-voucher', 'voucher-list'],
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
    role: 'custom',
    email: 'custom@company.com',
    status: 'active',
    createdAt: new Date(),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'customers'],
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
    role: 'platform-admin',
    email: 'platform.admin@company.com',
    status: 'active',
    createdAt: new Date(),
    emailVerified: true,
    permissions: {
      modules: [],
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    const user = mockUsers.find(u => u.username === username);
    
    if (user && user.status === 'active') {
      setCurrentUser(user);
      setLoginAttempts(0);
      return true;
    } else {
      setLoginAttempts(prev => prev + 1);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setLoginAttempts(0);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        loginAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
