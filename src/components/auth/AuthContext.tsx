
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { loginUser, logoutUser, getUserProfile } from '@/services/authService';
import { clearSelectedBusinessId } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  TOKEN: 'auth_token',
  USER: 'erp_current_user',
};

// Utility functions for localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log('💾 [AuthContext] Saved to storage:', key);
  } catch (error) {
    console.warn('❌ [AuthContext] Failed to save to localStorage:', error);
    throw new Error('Không thể lưu dữ liệu vào trình duyệt');
  }
};

const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    const result = item ? JSON.parse(item) : null;
    console.log('📁 [AuthContext] Loaded from storage:', key, result ? 'Data found' : 'No data');
    return result;
  } catch (error) {
    console.warn('❌ [AuthContext] Failed to load from localStorage:', error);
    return null;
  }
};

const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
    console.log('🗑️ [AuthContext] Removed from storage:', key);
  } catch (error) {
    console.warn('❌ [AuthContext] Failed to remove from localStorage:', error);
  }
};

// Simple auth check - just check if token exists
const checkAuthentication = () => {
  const hasToken = !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  console.log('🔐 [AuthContext] Auth check - Token:', hasToken ? 'exists' : 'missing');
  return hasToken;
};

// Convert API user to internal User type
const convertApiUserToUser = (apiUser: any): User => {
  console.log('🔄 [AuthContext] Converting API user to internal User type');
  return {
    id: apiUser.id,
    username: apiUser.email,
    fullName: apiUser.name,
    role: 'erp-admin',
    email: apiUser.email,
    phone: apiUser.phone,
    status: 'active',
    createdAt: apiUser.created_at,
    lastLogin: new Date().toISOString(),
    emailVerified: !!apiUser.email_verified_at,
    email_verified_at: apiUser.email_verified_at,
    isActive: true,
    avatarPath: apiUser.avatar_path,
    businessId: null,
    departmentId: null,
    groupId: null,
    permissions: {
      modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'affiliate', 'marketing', 'system-settings', 'user-management'],
      actions: [],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      canManageUsers: true,
      canViewAllVouchers: true,
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: false,
    },
    activities: [],
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 [AuthContext] Initializing auth state');
      setIsLoading(true);
      
      try {
        const storedUser = loadFromStorage(STORAGE_KEYS.USER);
        
        // Only restore user if token exists and user email is verified
        if (checkAuthentication() && storedUser && storedUser.emailVerified) {
          setCurrentUser(storedUser);
          console.log('✅ [AuthContext] Restored user session:', storedUser.username);
        } else if (storedUser && !storedUser.emailVerified) {
          console.log('⚠️ [AuthContext] User session found but email not verified, clearing session');
          removeFromStorage(STORAGE_KEYS.USER);
          removeFromStorage(STORAGE_KEYS.TOKEN);
        }
      } catch (error) {
        console.warn('❌ [AuthContext] Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('✅ [AuthContext] Auth initialization completed');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 [AuthContext] Starting login process for:', email);
    setIsLoading(true);
    
    try {
      const response = await loginUser({ email, password });
      console.log('📨 [AuthContext] Login API response received');
      
      const user = convertApiUserToUser(response.user);
      
      // Check if email is verified
      if (!user.emailVerified) {
        toast({
          title: "Email chưa xác thực",
          description: "Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập.",
          variant: "destructive",
          duration: 6000,
        });
        
        return false;
      }
      
      setCurrentUser(user);
      
      // Save to localStorage
      saveToStorage(STORAGE_KEYS.USER, user);
      
      console.log('✅ [AuthContext] User logged in successfully:', email);
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${user.fullName}!`,
        duration: 4000,
      });
      
      return true;
    } catch (error) {
      console.log('❌ [AuthContext] Login failed for:', email, error);
      
      let errorMessage = "Thông tin đăng nhập không chính xác";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 [AuthContext] Starting logout process');
    setIsLoading(true);
    
    try {
      await logoutUser();
      console.log('✅ [AuthContext] User logged out:', currentUser?.username);
    } catch (error) {
      console.warn('⚠️ [AuthContext] Logout error:', error);
    } finally {
      setCurrentUser(null);
      
      // Clear localStorage
      removeFromStorage(STORAGE_KEYS.USER);
      
      // Clear business context including cbi
      clearSelectedBusinessId();
      if (window.clearBusinessContext) {
        window.clearBusinessContext();
      }
      
      setIsLoading(false);
      
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống",
        duration: 4000,
      });
    }
  };

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    
    console.log('🔄 [AuthContext] Refreshing user profile');
    try {
      const apiUser = await getUserProfile();
      const updatedUser = convertApiUserToUser(apiUser);
      
      setCurrentUser(updatedUser);
      saveToStorage(STORAGE_KEYS.USER, updatedUser);
      
      console.log('✅ [AuthContext] User profile refreshed:', updatedUser.username);
    } catch (error) {
      console.warn('❌ [AuthContext] Failed to refresh user profile:', error);
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
        isAuthenticated: checkAuthentication() && !!currentUser && currentUser.emailVerified,
        login,
        logout,
        refreshUserProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
