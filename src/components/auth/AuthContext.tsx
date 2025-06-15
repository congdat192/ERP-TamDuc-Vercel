
import React, { createContext, useContext, useState, useEffect } from 'react';
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

// Storage keys
const STORAGE_KEYS = {
  USER: 'erp_current_user',
  LOGIN_ATTEMPTS: 'erp_login_attempts',
  SESSION_TIMESTAMP: 'erp_session_timestamp'
};

// Session timeout (in milliseconds) - 8 hours
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

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

// Utility functions for localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
};

const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

// Check if session is valid
const isSessionValid = () => {
  const timestamp = loadFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);
  if (!timestamp) return false;
  
  const now = Date.now();
  const sessionAge = now - timestamp;
  return sessionAge < SESSION_TIMEOUT;
};

// Restore user data with validation
const restoreUserFromStorage = (): User | null => {
  if (!isSessionValid()) {
    // Session expired, clear storage
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);
    return null;
  }

  const userData = loadFromStorage(STORAGE_KEYS.USER);
  if (!userData || !userData.id || !userData.username) {
    return null;
  }

  // Convert date strings back to Date objects
  try {
    return {
      ...userData,
      createdAt: new Date(userData.createdAt),
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined
    };
  } catch (error) {
    console.warn('Failed to restore user data:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = restoreUserFromStorage();
    const storedAttempts = loadFromStorage(STORAGE_KEYS.LOGIN_ATTEMPTS) || 0;
    
    if (storedUser) {
      setCurrentUser(storedUser);
      console.log('Restored user session:', storedUser.username);
    }
    
    setLoginAttempts(storedAttempts);
    setIsInitialized(true);
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.USER) {
        if (e.newValue === null) {
          // User was logged out in another tab
          setCurrentUser(null);
          setLoginAttempts(0);
          console.log('User logged out in another tab');
        } else {
          // User was logged in in another tab
          try {
            const userData = JSON.parse(e.newValue);
            const restoredUser = {
              ...userData,
              createdAt: new Date(userData.createdAt),
              lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined
            };
            setCurrentUser(restoredUser);
            console.log('User logged in from another tab:', restoredUser.username);
          } catch (error) {
            console.warn('Failed to sync user from another tab:', error);
          }
        }
      }
      
      if (e.key === STORAGE_KEYS.LOGIN_ATTEMPTS && e.newValue) {
        try {
          setLoginAttempts(parseInt(e.newValue));
        } catch (error) {
          console.warn('Failed to sync login attempts:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    const user = mockUsers.find(u => u.username === username);
    
    if (user && user.status === 'active') {
      const userWithLastLogin = {
        ...user,
        lastLogin: new Date()
      };
      
      setCurrentUser(userWithLastLogin);
      setLoginAttempts(0);
      
      // Save to localStorage
      saveToStorage(STORAGE_KEYS.USER, userWithLastLogin);
      saveToStorage(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now());
      saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, 0);
      
      console.log('User logged in successfully:', username);
      return true;
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts);
      
      console.log('Login failed for:', username);
      return false;
    }
  };

  const logout = () => {
    console.log('User logged out:', currentUser?.username);
    setCurrentUser(null);
    setLoginAttempts(0);
    
    // Clear localStorage
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);
    removeFromStorage(STORAGE_KEYS.LOGIN_ATTEMPTS);
  };

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

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
