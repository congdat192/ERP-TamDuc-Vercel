
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { loginUser, logoutUser, getUserProfile, isAuthenticated } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAttempts: number;
  refreshUserProfile: () => Promise<void>;
  isLoading: boolean;
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

// Convert API user to internal User type
const convertApiUserToUser = (apiUser: any): User => {
  return {
    id: apiUser.id,
    username: apiUser.email, // Use email as username
    fullName: apiUser.name,
    role: 'erp-admin', // Default role, can be enhanced later
    email: apiUser.email,
    status: 'active',
    createdAt: apiUser.created_at,
    lastLogin: new Date().toISOString(),
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
  };
};

// Restore user data with validation
const restoreUserFromStorage = async (): Promise<User | null> => {
  if (!isSessionValid() || !isAuthenticated()) {
    // Session expired or no token, clear storage
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);
    return null;
  }

  try {
    // Try to get fresh user data from API
    const apiUser = await getUserProfile();
    const user = convertApiUserToUser(apiUser);
    
    // Update stored user data
    saveToStorage(STORAGE_KEYS.USER, user);
    saveToStorage(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now());
    
    return user;
  } catch (error) {
    console.warn('Failed to restore user from API:', error);
    
    // Fall back to stored user data
    const userData = loadFromStorage(STORAGE_KEYS.USER);
    if (userData && userData.id && userData.username) {
      return userData as User;
    }
    
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const storedUser = await restoreUserFromStorage();
        const storedAttempts = loadFromStorage(STORAGE_KEYS.LOGIN_ATTEMPTS) || 0;
        
        if (storedUser) {
          setCurrentUser(storedUser);
          console.log('Restored user session:', storedUser.username);
        }
        
        setLoginAttempts(storedAttempts);
      } catch (error) {
        console.warn('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.USER) {
        if (e.newValue === null) {
          setCurrentUser(null);
          setLoginAttempts(0);
          console.log('User logged out in another tab');
        } else {
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await loginUser({ email, password });
      const user = convertApiUserToUser(response.user);
      
      setCurrentUser(user);
      setLoginAttempts(0);
      
      // Save to localStorage
      saveToStorage(STORAGE_KEYS.USER, user);
      saveToStorage(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now());
      saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, 0);
      
      console.log('User logged in successfully:', email);
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${user.fullName}!`,
      });
      
      return true;
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts);
      
      console.log('Login failed for:', email, error);
      
      toast({
        title: "Đăng nhập thất bại",
        description: error instanceof Error ? error.message : "Thông tin đăng nhập không chính xác",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await logoutUser();
      console.log('User logged out:', currentUser?.username);
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setLoginAttempts(0);
      
      // Clear localStorage
      removeFromStorage(STORAGE_KEYS.USER);
      removeFromStorage(STORAGE_KEYS.SESSION_TIMESTAMP);
      removeFromStorage(STORAGE_KEYS.LOGIN_ATTEMPTS);
      
      setIsLoading(false);
      
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống",
      });
    }
  };

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      const apiUser = await getUserProfile();
      const updatedUser = convertApiUserToUser(apiUser);
      
      setCurrentUser(updatedUser);
      saveToStorage(STORAGE_KEYS.USER, updatedUser);
      saveToStorage(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now());
      
      console.log('User profile refreshed:', updatedUser.username);
    } catch (error) {
      console.warn('Failed to refresh user profile:', error);
      
      if (error instanceof Error && error.message.includes('Token hết hạn')) {
        // Token expired, force logout
        await logout();
      }
    }
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
        refreshUserProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
