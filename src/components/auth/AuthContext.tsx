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
  refreshPermissions: () => Promise<void>;
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
      roles!user_roles_role_id_fkey (
        id,
        name,
        description,
      role_permissions (
        features (
          code,
          module_id,
          feature_type,
          modules (
            code,
            name
          )
        )
      )
      )
    `)
    .eq('user_id', supabaseUser.id)
    .single();

  // Check user_roles record exists
  if (!userRoleData) {
    console.error('❌ [AuthContext] No user_roles record found for user:', supabaseUser.id);
    throw new Error('User has no assigned role. Please contact administrator.');
  }

  console.log('📋 [AuthContext] User role data:', userRoleData);

  // Check if role exists in roles table
  const roleData = userRoleData.roles as any;
  if (!roleData) {
    console.error('❌ [AuthContext] Role ID not found in roles table:', userRoleData.role_id);
    throw new Error(`Role ID ${userRoleData.role_id} does not exist. Please contact administrator.`);
  }

  console.log('🔐 [AuthContext] User role loaded:', roleData.name, 'ID:', roleData.id);
  
  // Extract permissions from role with module info
  const rolePermissions = roleData.role_permissions || [];
  
  console.log('📋 [AuthContext] Role permissions count:', rolePermissions.length);
  
  // Log detailed feature-module mapping
  rolePermissions.forEach((rp: any, index: number) => {
    const feature = rp.features;
    if (!feature) {
      console.warn(`⚠️ [${index + 1}] No feature data in role_permission`);
      return;
    }
    
    const featureCode = feature.code;
    const moduleCode = feature?.modules?.code;
    
    console.log(`🔍 [${index + 1}] Feature:`, {
      featureCode: featureCode,
      moduleName: feature?.modules?.name,
      moduleCode: moduleCode,
      moduleId: feature.module_id
    });
  });

  // Map role name to legacy UserRole type
  let userRole: UserRole = 'custom';
  const roleName = roleData.name.toLowerCase();
  
  if (roleName === 'owner') {
    userRole = 'erp-admin';
  } else if (roleName === 'admin') {
    userRole = 'erp-admin';
  } else if (roleName === 'user') {
    userRole = 'custom';
  }
  
  // Get permissions based on role
  let permissions: UserPermissions;
  
  // Owner role gets full access to everything
  if (roleName === 'owner') {
    console.log('👑 [AuthContext] Owner role detected - granting full access');
    permissions = {
      modules: [
        'dashboard',
        'customers',
        'sales',
        'inventory',
        'accounting',
        'hr',
        'voucher',
        'marketing',
        'affiliate',
        'system-settings',
        'user-management'
      ] as ERPModule[],
      voucherFeatures: [
        'voucher-dashboard',
        'campaign-management',
        'issue-voucher',
        'voucher-list',
        'voucher-analytics',
        'voucher-leaderboard',
        'voucher-settings'
      ] as VoucherFeature[],
      canManageUsers: true,
      canViewAllVouchers: true
    };
  } else {
    // For custom roles, map features to permissions using module_code from database
    const moduleSet = new Set<ERPModule>();
    const voucherFeatureSet = new Set<VoucherFeature>();
    let canManageUsers = false;
    let canViewAllVouchers = false;

    rolePermissions.forEach((rp: any) => {
      const feature = rp.features;
      if (!feature) return;
      
      const featureCode = feature.code;
      const moduleCode = feature.modules?.code; // ✅ Get module code from database
      
      // Add module based on module_code from database
      if (moduleCode) {
        moduleSet.add(moduleCode as ERPModule);
        console.log(`✅ Added module: ${moduleCode} from feature: ${featureCode}`);
      } else {
        console.warn(`⚠️ Module code not found for feature: ${featureCode}`);
      }
      
      // Map voucher-specific features
      if (moduleCode === 'voucher') {
        if (featureCode === 'view_voucher' || featureCode === 'read_voucher') {
          voucherFeatureSet.add('voucher-list');
          voucherFeatureSet.add('voucher-dashboard');
          canViewAllVouchers = true;
        }
        if (featureCode === 'create_voucher') {
          voucherFeatureSet.add('issue-voucher');
        }
        if (featureCode === 'approve_voucher' || featureCode === 'manage_campaign') {
          voucherFeatureSet.add('campaign-management');
        }
        if (featureCode === 'view_voucher_analytics') {
          voucherFeatureSet.add('voucher-analytics');
        }
        if (featureCode === 'view_voucher_leaderboard') {
          voucherFeatureSet.add('voucher-leaderboard');
        }
        if (featureCode === 'manage_voucher_settings') {
          voucherFeatureSet.add('voucher-settings');
        }
      }
      
      // Check for user management permissions
      if (featureCode === 'manage_members' || featureCode === 'manage_roles' || featureCode === 'create_member') {
        canManageUsers = true;
      }
    });

    permissions = {
      modules: Array.from(moduleSet),
      voucherFeatures: Array.from(voucherFeatureSet),
      canManageUsers,
      canViewAllVouchers,
    };

    console.log('✅ [AuthContext] Final modules:', Array.from(moduleSet));
    console.log('✅ [AuthContext] Final voucher features:', Array.from(voucherFeatureSet));
    console.log('✅ [AuthContext] User can access:', {
      modules: permissions.modules,
      voucherFeatures: permissions.voucherFeatures,
      canManageUsers: permissions.canManageUsers,
      canViewAllVouchers: permissions.canViewAllVouchers
    });
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
          // ✅ PHASE 1: CHECK STATUS ON SESSION RESTORE (Relaxed)
          // This prevents INACTIVE users from accessing the app even with valid sessions
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('🔍 [Phase 1] Checking user status for event:', event);
            
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('status')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              // Query failed - log warning but proceed (let RLS handle access control)
              console.warn('⚠️ [Phase 1] Failed to check status (proceeding with login):', error.message);
              setIsInitialized(true);
            } else if (profile?.status === 'INACTIVE') {
              // Query succeeded and user is INACTIVE - block access
              console.log('⛔ [Phase 1] INACTIVE user detected - logging out');
              await supabase.auth.signOut();
              toast({
                title: "Tài khoản bị vô hiệu hóa",
                description: "Tài khoản của bạn đã bị vô hiệu hóa.",
                variant: "destructive",
              });
              setIsInitialized(true);
              return; // Don't load user data
            } else {
              // Query succeeded and user is ACTIVE
              console.log('✅ [Phase 1] User status is ACTIVE - proceeding');
              setIsInitialized(true);
            }
          }
          
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
        console.log('🔍 [checkSession] Checking for existing session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('🔍 [checkSession] Session found, checking user status');
          
          // Phase 1: Quick status check (same as onAuthStateChange)
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('status')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.warn('⚠️ [checkSession] Failed to check status (proceeding with login):', error.message);
            setIsInitialized(true);
          } else if (profile?.status === 'INACTIVE') {
            console.log('⛔ [checkSession] INACTIVE user detected - logging out');
            await supabase.auth.signOut();
            toast({
              title: "Tài khoản bị vô hiệu hóa",
              description: "Tài khoản của bạn đã bị vô hiệu hóa.",
              variant: "destructive",
            });
            setIsInitialized(true);
            return;
          } else {
            console.log('✅ [checkSession] User status is ACTIVE - proceeding');
            setIsInitialized(true);
            
            // Phase 2: Load full profile (non-blocking)
            setTimeout(() => {
              fetchUserWithPermissions(session.user).then(({ user, passwordChangeRequired }) => {
                setCurrentUser(user);
                setRequirePasswordChange(passwordChangeRequired);
                console.log('✅ [checkSession] Profile loaded:', user.email);
              }).catch((err) => {
                console.error('❌ [checkSession] Error loading profile:', err);
              });
            }, 0);
          }
        } else {
          console.log('ℹ️ [checkSession] No session found');
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('❌ [checkSession] Error:', error);
        setIsInitialized(true);
      }
    };
    
    checkSession();
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Safety timeout: Force initialization after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('⚠️ [AuthContext] Force initialization after timeout');
        setIsInitialized(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isInitialized]);

  // Setup realtime listener for profile status changes
  useEffect(() => {
    if (!currentUser) return;

    console.log('🔔 [AuthContext] Setting up realtime status listener for user:', currentUser.id);

    const channel = supabase
      .channel('profile-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('🔔 [Realtime] Profile updated:', payload);
          console.log('   - Old status:', payload.old?.status);
          console.log('   - New status:', payload.new?.status);
          console.log('   - User ID:', currentUser.id);
          
          const newStatus = payload.new?.status;
          const oldStatus = payload.old?.status;
          
          if (newStatus === 'INACTIVE' && oldStatus !== 'INACTIVE') {
            console.log('⛔ [Realtime] User status changed to INACTIVE - logging out');
            toast({
              title: "Tài khoản bị vô hiệu hóa",
              description: "Tài khoản của bạn đã bị vô hiệu hóa. Bạn sẽ bị đăng xuất.",
              variant: "destructive",
              duration: 5000,
            });
            logout();
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 [Realtime] Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ [Realtime] Successfully subscribed to profile changes for user:', currentUser.id);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ [Realtime] Channel error - profile changes may not be detected');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

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

  const refreshPermissions = async () => {
    console.log('🔄 [AuthContext] Force refreshing permissions...');
    
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (!supabaseUser) {
        console.warn('⚠️ [AuthContext] No user found for refresh');
        return;
      }
      
      const { user: updatedUser, passwordChangeRequired } = await fetchUserWithPermissions(supabaseUser);
      
      setCurrentUser(updatedUser);
      setRequirePasswordChange(passwordChangeRequired);
      
      console.log('✅ [AuthContext] Permissions refreshed:', updatedUser.permissions);
    } catch (error) {
      console.error('❌ [AuthContext] Failed to refresh permissions:', error);
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
        refreshPermissions,
        isLoading,
        requirePasswordChange,
        setRequirePasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
