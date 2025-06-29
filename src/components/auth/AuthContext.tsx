import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { authService, LoginRequest } from '@/services/authService';
import { shouldUseRealAPI } from '@/config/app';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAttempts: number;
  apiMode: boolean;
  toggleApiMode: () => void;
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
    createdAt: new Date().toISOString(),
    emailVerified: true,
    isActive: true,
    permissions: {
      modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'marketing', 'system-settings', 'user-management'],
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
    createdAt: new Date().toISOString(),
    emailVerified: true,
    isActive: true,
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
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
    role: 'telesales',
    email: 'telesales@company.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    emailVerified: true,
    isActive: true,
    permissions: {
      modules: ['dashboard', 'customers', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-leaderboard'],
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
    role: 'custom',
    email: 'custom@company.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    emailVerified: true,
    isActive: true,
    permissions: {
      modules: ['dashboard', 'customers'],
      voucherFeatures: [],
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
    role: 'platform-admin',
    email: 'platform.admin@company.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    emailVerified: true,
    isActive: true,
    permissions: {
      modules: [],
      voucherFeatures: [],
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

  // Return user data as is since dates are already stored as strings
  try {
    return userData as User;
  } catch (error) {
    console.warn('Failed to restore user data:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMode, setApiMode] = useState(shouldUseRealAPI());

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
            setCurrentUser(userData as User);
            console.log('User logged in from another tab:', userData.username);
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

  const toggleApiMode = () => {
    const newMode = !apiMode;
    setApiMode(newMode);
    localStorage.setItem('use_real_api', newMode.toString());
    
    // Logout when switching modes
    if (currentUser) {
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (apiMode) {
        // Use real API
        const credentials: LoginRequest = { email, password };
        const response = await authService.login(credentials);
        
        if (response.success && response.data) {
          const apiUser = response.data.user;
          
          // Transform API user to our User interface
          const userWithLastLogin: User = {
            id: apiUser.id,
            username: apiUser.email.split('@')[0], // Use email prefix as username
            fullName: apiUser.name || 'API User',
            role: (apiUser.role as any) || 'custom',
            email: apiUser.email,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            emailVerified: true,
            isActive: true,
            permissions: {
              modules: ['dashboard', 'customers', 'marketing'],
              voucherFeatures: [],
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
          };
          
          setCurrentUser(userWithLastLogin);
          setLoginAttempts(0);
          
          // Save to localStorage
          saveToStorage(STORAGE_KEYS.USER, userWithLastLogin);
          saveToStorage(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now());
          saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, 0);
          
          // Save API token if provided
          if (response.data.token) {
            authService.saveToken(response.data.token);
          }
          
          console.log('API login successful:', email);
          return true;
        } else {
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);
          saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts);
          
          console.log('API login failed:', response.error);
          return false;
        }
      } else {
        // Use demo mode (existing logic)
        const user = mockUsers.find(u => u.username === email.split('@')[0] || u.email === email);
        
        if (user && user.status === 'active') {
          const userWithLastLogin = {
            ...user,
            lastLogin: new Date().toISOString()
          };
          
          setCurrentUser(userWithLastLogin);
          setLoginAttempts(0);
          
          // Save to localStorage
          saveToStorage(STORAGE_KEYS.USER, userWithLastLogin);
          saveToStorage(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now());
          saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, 0);
          
          console.log('Demo login successful:', email);
          return true;
        } else {
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);
          saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts);
          
          console.log('Demo login failed:', email);
          return false;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts);
      return false;
    } finally {
      setIsLoading(false);
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
    
    // Clear API token
    authService.removeToken();
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
        isLoading,
        login,
        logout,
        loginAttempts,
        apiMode,
        toggleApiMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
