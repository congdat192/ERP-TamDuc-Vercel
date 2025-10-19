/**
 * Ultra-Simplified AuthContext
 * - No RLS in app logic, only role level check
 * - Single RPC call: get_user_profile_simple()
 * - Cache 2 hours in localStorage
 * - Owner/Admin bypass all checks (role level <= 2)
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserPermissions, ERPModule, VoucherFeature, UserStatus } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { PermissionCache, CachedAuth } from '@/services/permissionCache';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
  requirePasswordChange: boolean;
  setRequirePasswordChange: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Helper: Check if user is Owner or Admin (role level <= 2)
const isOwnerOrAdmin = (roleLevel?: number): boolean => {
  return roleLevel !== undefined && roleLevel <= 2;
};

// Transform CachedAuth to User object
const transformToUser = (data: CachedAuth): User => {
  const roleLevel = data.role.level;
  const isOwnerAdmin = isOwnerOrAdmin(roleLevel);

  // SAFETY: Handle INACTIVE status at frontend level
  if (data.profile.status !== 'ACTIVE') {
    console.warn('⚠️ [Auth] User account is not active:', data.profile.status);
  }

  return {
    id: data.profile.id,
    fullName: data.profile.full_name,
    username: data.profile.email,
    email: data.profile.email,
    phone: data.profile.phone,
    avatarPath: data.profile.avatar_path,
    status: data.profile.status as UserStatus,
    role: data.role.name as any, // Compatible with existing UserRole type
    permissions: {
      modules: (data.modules || ['dashboard']) as ERPModule[], // Use modules from RPC with fallback
      features: isOwnerAdmin ? ['full_access'] : [],
      voucherFeatures: [] as VoucherFeature[],
      canManageUsers: isOwnerAdmin,
      canViewAllVouchers: isOwnerAdmin
    },
    isActive: data.profile.status === 'ACTIVE',
    emailVerified: true,
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 5,
      passwordChangeRequired: false
    },
    activities: [],
    createdAt: new Date().toISOString()
  };
};

// Fetch user profile with single RPC call
const fetchUserSimple = async (userId: string): Promise<User> => {
  console.log('📡 [AuthContext] Fetching user profile for:', userId);

  // 1. Check cache first (fast path)
  const cached = PermissionCache.load();
  if (cached && cached.profile.id === userId) {
    console.log('✅ [AuthContext] Loaded from cache');
    return transformToUser(cached);
  }

  // 2. Fetch from DB via single RPC call
  console.log('🔄 [AuthContext] Cache miss, fetching from DB...');
  const { data, error } = await supabase.rpc('get_user_profile_simple' as any, {
    _user_id: userId
  });

  if (error) {
    console.error('❌ [AuthContext] RPC error:', error);
    throw error;
  }

  if (!data) {
    throw new Error('User profile not found');
  }

  // 3. Cache for 2 hours
  const cachedData = data as unknown as CachedAuth;
  PermissionCache.save(cachedData);
  console.log('✅ [AuthContext] Fetched and cached profile');

  return transformToUser(cachedData);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const clearAuthState = async () => {
    console.log('🧹 [AuthContext] Clearing auth state');
    setCurrentUser(null);
    setIsLoading(false);
    PermissionCache.clear();
  };

  // Simplified session check (trust Supabase auto-refresh)
  const checkSession = async (): Promise<Session | null> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('❌ [AuthContext] Session check error:', error);
      return null;
    }
  };

  // Initialize auth and handle state changes
  useEffect(() => {
    console.log('🔧 [AuthContext] Setting up auth state listener');
    let mounted = true;

    const initAuth = async () => {
      try {
        const session = await checkSession();

        if (session?.user && mounted) {
          console.log('✅ [AuthContext] Session found, fetching user');
          const user = await fetchUserSimple(session.user.id);
          if (mounted) {
            setCurrentUser(user);
          }
        } else {
          console.log('ℹ️ [AuthContext] No active session');
        }
      } catch (error) {
        console.error('❌ [AuthContext] Init error:', error);
        await clearAuthState();
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 [AuthContext] Auth state changed:', event);

        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const user = await fetchUserSimple(session.user.id);
            if (mounted) {
              setCurrentUser(user);
            }
          } catch (error) {
            console.error('❌ [AuthContext] Error fetching user after sign in:', error);
            await clearAuthState();
          }
        } else if (event === 'SIGNED_OUT') {
          await clearAuthState();
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 [AuthContext] Token refreshed');
        }
      }
    );

    return () => {
      console.log('🧹 [AuthContext] Cleaning up auth state listener');
      subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 [AuthContext] Login attempt for:', email);
    setIsLoading(true);

    try {
      // Step 1: Sign in with Supabase Auth
      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (!authUser) throw new Error('Login failed: No user returned');

      console.log('✅ [AuthContext] Supabase auth successful:', authUser.id);

      // Step 2: Check profile status
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', authUser.id)
        .single();

      if (profile?.status !== 'ACTIVE') {
        console.error('❌ [AuthContext] Account is not active:', profile?.status);
        await supabase.auth.signOut();
        toast({
          title: "Đăng nhập thất bại",
          description: "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
          variant: "destructive",
        });
        return false;
      }

      // Step 3: Fetch user profile (single RPC call)
      const user = await fetchUserSimple(authUser.id);

      console.log('✅ [AuthContext] Login successful:', user.fullName);
      setCurrentUser(user);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${user.fullName}!`,
      });

      return true;
    } catch (error: any) {
      console.error('❌ [AuthContext] Login error:', error);

      let errorMessage = 'Đã xảy ra lỗi khi đăng nhập';

      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email hoặc mật khẩu không chính xác';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Vui lòng xác thực email của bạn trước khi đăng nhập';
      }

      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log('👋 [AuthContext] Logging out');
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ [AuthContext] Logout error:', error);
      }

      await clearAuthState();

      toast({
        title: "Đã đăng xuất",
        description: "Bạn đã đăng xuất thành công",
      });

      // Redirect to login page
      window.location.href = '/login';
    } catch (error: any) {
      console.error('❌ [AuthContext] Logout error:', error);

      // Force clear state even if logout fails
      await clearAuthState();

      // Still redirect to login page
      window.location.href = '/login';
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    if (!currentUser) return;

    try {
      console.log('🔄 [AuthContext] Refreshing user profile');
      PermissionCache.clear(); // Force refresh from DB
      const updatedUser = await fetchUserSimple(currentUser.id);
      setCurrentUser(updatedUser);
      console.log('✅ [AuthContext] User profile refreshed');
    } catch (error) {
      console.error('❌ [AuthContext] Error refreshing user profile:', error);
      throw error;
    }
  };

  const refreshPermissions = async (): Promise<void> => {
    // Same as refreshUserProfile for simplicity
    await refreshUserProfile();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Đang tải...</p>
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
        refreshUserProfile,
        refreshPermissions,
        requirePasswordChange: false, // Simplified: no password change flow
        setRequirePasswordChange: () => {}, // No-op
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
