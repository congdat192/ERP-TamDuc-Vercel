import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPermissions, ERPModule, VoucherFeature, UserRole } from '@/types/auth';
import { MODULE_PERMISSIONS, VOUCHER_FEATURES } from '@/constants/permissions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
  isLoading: boolean;
  requirePasswordChange: boolean;
  setRequirePasswordChange: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Transform database permissions to frontend format
const transformPermissions = (dbPermissions: any[]): UserPermissions => {
  const modules = new Set<ERPModule>();
  const voucherFeatures = new Set<VoucherFeature>();
  let canManageUsers = false;
  let canViewAllVouchers = false;
  
  (dbPermissions || []).forEach((p: any) => {
    // Add module if user has any permission in it
    if (p.module_code) {
      modules.add(p.module_code as ERPModule);
    }
    
    // Check for voucher-specific features
    if (p.module_code === 'voucher') {
      // Map feature codes to voucher features
      if (p.feature_code === 'view_voucher') {
        voucherFeatures.add('voucher-list');
        canViewAllVouchers = true;
      }
      if (p.feature_code === 'create_voucher') {
        voucherFeatures.add('issue-voucher');
      }
      if (p.feature_code === 'approve_voucher') {
        voucherFeatures.add('campaign-management');
      }
      // Add dashboard and analytics for anyone with voucher access
      voucherFeatures.add('voucher-dashboard');
      voucherFeatures.add('voucher-analytics');
    }
    
    // Check for user management permissions
    if (p.feature_code === 'manage_members' || p.feature_code === 'manage_roles') {
      canManageUsers = true;
    }
  });
  
  return {
    modules: Array.from(modules),
    voucherFeatures: Array.from(voucherFeatures),
    canManageUsers,
    canViewAllVouchers
  };
};

// Fetch user with all permissions from database (single-tenant)
const fetchUserWithPermissions = async (supabaseUser: SupabaseUser): Promise<{ user: User; passwordChangeRequired: boolean }> => {
  console.log('🔄 [AuthContext] Fetching user with permissions');
  
  // Get profile with password_change_required flag
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();
  
  if (profileError) {
    console.error('❌ [AuthContext] Error fetching profile:', profileError);
    throw profileError;
  }
  
  // Fetch user role with permissions via role_id
  const { data: userRoleData } = await supabase
    .from('user_roles')
    .select(`
      role_id,
      roles (
        id,
        name,
        description,
        role_permissions (
          features (
            code,
            module_id,
            feature_type
          )
        )
      )
    `)
    .eq('user_id', supabaseUser.id)
    .single();

  if (!userRoleData?.roles) {
    throw new Error('User role not found');
  }

  const roleData = userRoleData.roles as any;
  console.log('🔐 [AuthContext] User role loaded:', roleData.name, 'ID:', roleData.id);
  
  // Extract permissions from role
  const featureCodes = (roleData.role_permissions || [])
    .map((rp: any) => rp.features?.code)
    .filter(Boolean);

  console.log('🔑 [AuthContext] Feature codes:', featureCodes);

  // Map role name to legacy UserRole type
  let userRole: UserRole = 'custom';
  const roleName = roleData.name.toLowerCase();
  if (roleName === 'admin') {
    userRole = 'erp-admin';
  } else if (roleName === 'user') {
    userRole = 'custom';
  }
  
  // Get permissions based on role
  let permissions: UserPermissions;
  
  if (roleName === 'admin') {
    // Admin has full access
    permissions = {
      modules: MODULE_PERMISSIONS.map(m => m.module),
      voucherFeatures: VOUCHER_FEATURES.map(f => f.id as VoucherFeature),
      canManageUsers: true,
      canViewAllVouchers: true,
    };
  } else {
    // Regular users have limited access
    permissions = {
      modules: [],
      voucherFeatures: [],
      canManageUsers: false,
      canViewAllVouchers: false,
    };
  }
  
  const user: User = {
    id: supabaseUser.id,
    fullName: profile.full_name || 'User',
    username: supabaseUser.email?.split('@')[0] || '',
    email: supabaseUser.email!,
    phone: profile.phone,
    role: userRole,
    permissions,
    isActive: true,
    status: supabaseUser.email_confirmed_at ? 'active' : 'pending_verification',
    createdAt: supabaseUser.created_at,
    lastLogin: new Date().toISOString(),
    emailVerified: !!supabaseUser.email_confirmed_at,
    avatarPath: profile.avatar_path,
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 5,
      passwordChangeRequired: profile.password_change_required || false
    },
    activities: []
  };

  console.log('🔐 [AuthContext] Password change required:', profile.password_change_required);

  return {
    user,
    passwordChangeRequired: profile.password_change_required || false
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const { toast } = useToast();

  // Setup Supabase auth state listener (CRITICAL!)
  useEffect(() => {
    console.log('🚀 [AuthContext] Setting up auth state listener');
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 [AuthContext] Auth state changed:', event);
        
        if (session?.user) {
          // User logged in - fetch profile and permissions
          // Use setTimeout to avoid blocking the auth callback
          setTimeout(async () => {
            try {
              const { user, passwordChangeRequired } = await fetchUserWithPermissions(session.user);
              setCurrentUser(user);
              setRequirePasswordChange(passwordChangeRequired);
              console.log('✅ [AuthContext] User state updated:', user.email);
            } catch (error) {
              console.error('❌ [AuthContext] Error fetching user:', error);
              setCurrentUser(null);
              setRequirePasswordChange(false);
            }
          }, 0);
        } else {
          // User logged out
          console.log('👋 [AuthContext] User logged out');
          setCurrentUser(null);
          setRequirePasswordChange(false);
        }
      }
    );
    
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        console.log('🔍 [AuthContext] Checking for existing session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { user, passwordChangeRequired } = await fetchUserWithPermissions(session.user);
          setCurrentUser(user);
          setRequirePasswordChange(passwordChangeRequired);
          console.log('✅ [AuthContext] Session restored:', user.email);
        }
      } catch (error) {
        console.error('❌ [AuthContext] Error checking session:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    checkSession();
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // No business context changes in single-tenant (removed)

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 [AuthContext] Starting login process for:', email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log('📨 [AuthContext] Login successful');
      
      // Fetch user with permissions
      const { user, passwordChangeRequired } = await fetchUserWithPermissions(data.user);
      
      // Check if email is verified
      if (!user.emailVerified) {
        await supabase.auth.signOut();
        
        toast({
          title: "Email chưa xác thực",
          description: "Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập.",
          variant: "destructive",
          duration: 6000,
        });
        
        return false;
      }
      
      setCurrentUser(user);
      setRequirePasswordChange(passwordChangeRequired);
      
      console.log('✅ [AuthContext] User logged in successfully:', email);
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${user.fullName}!`,
        duration: 4000,
      });
      
      return true;
    } catch (error: any) {
      console.log('❌ [AuthContext] Login failed for:', email, error);
      
      let errorMessage = "Thông tin đăng nhập không chính xác";
      if (error?.message) {
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
      await supabase.auth.signOut();
      console.log('✅ [AuthContext] User logged out:', currentUser?.username);
      
      // State will be cleared by onAuthStateChange listener
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống",
        duration: 4000,
      });
    } catch (error) {
      console.warn('⚠️ [AuthContext] Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    console.log('🔄 [AuthContext] Refreshing user profile');
    
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (!supabaseUser) {
        console.log('⚠️ [AuthContext] No user to refresh');
        return;
      }
      
      const { user: updatedUser, passwordChangeRequired } = await fetchUserWithPermissions(supabaseUser);
      
      setCurrentUser(updatedUser);
      setRequirePasswordChange(passwordChangeRequired);
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
        isAuthenticated: !!currentUser && currentUser.emailVerified,
        login,
        logout,
        refreshUserProfile,
        isLoading,
        requirePasswordChange,
        setRequirePasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
