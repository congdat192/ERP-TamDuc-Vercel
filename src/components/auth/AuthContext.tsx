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
  const features = new Set<string>();
  const voucherFeatures = new Set<VoucherFeature>();
  let canManageUsers = false;
  let canViewAllVouchers = false;
  
  (dbPermissions || []).forEach((p: any) => {
    // Extract feature code
    const featureCode = p.feature_code || p.features?.code;
    const moduleCode = p.module_code || p.features?.modules?.code;
    
    // Add feature code
    if (featureCode) {
      features.add(featureCode);
    }
    
    // Add module if user has any permission in it
    if (moduleCode) {
      modules.add(moduleCode as ERPModule);
    }
    
    // Check for voucher-specific features
    if (moduleCode === 'voucher') {
      if (featureCode === 'view_voucher') {
        voucherFeatures.add('voucher-list');
        canViewAllVouchers = true;
      }
      if (featureCode === 'create_voucher') {
        voucherFeatures.add('issue-voucher');
      }
      if (featureCode === 'approve_voucher') {
        voucherFeatures.add('campaign-management');
      }
      voucherFeatures.add('voucher-dashboard');
      voucherFeatures.add('voucher-analytics');
    }
    
    // Check for user management permissions
    if (featureCode === 'manage_members' || featureCode === 'manage_roles') {
      canManageUsers = true;
    }
  });
  
  // Special case: full_access grants all modules
  const hasFullAccess = features.has('full_access');
  
  return {
    modules: hasFullAccess ? [
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
    ] as ERPModule[] : Array.from(modules),
    features: Array.from(features),
    voucherFeatures: hasFullAccess ? [
      'voucher-dashboard',
      'campaign-management',
      'issue-voucher',
      'voucher-list',
      'voucher-analytics',
      'voucher-leaderboard',
      'voucher-settings'
    ] as VoucherFeature[] : Array.from(voucherFeatures),
    canManageUsers: hasFullAccess || canManageUsers,
    canViewAllVouchers: hasFullAccess || canViewAllVouchers
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
      features: ['full_access'], // Owner has full_access feature
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
    const featureSet = new Set<string>();
    const voucherFeatureSet = new Set<VoucherFeature>();
    let canManageUsers = false;
    let canViewAllVouchers = false;

    rolePermissions.forEach((rp: any) => {
      const feature = rp.features;
      if (!feature) return;
      
      const featureCode = feature.code;
      const moduleCode = feature.modules?.code; // ✅ Get module code from database
      
      // Add feature code
      if (featureCode) {
        featureSet.add(featureCode);
      }
      
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
      features: Array.from(featureSet),
      voucherFeatures: Array.from(voucherFeatureSet),
      canManageUsers,
      canViewAllVouchers,
    };
  }

  console.log('✅ [AuthContext] Final modules:', permissions.modules);
  console.log('✅ [AuthContext] Final voucher features:', permissions.voucherFeatures);
  console.log('✅ [AuthContext] User can access:', {
    modules: permissions.modules,
    voucherFeatures: permissions.voucherFeatures,
    canManageUsers: permissions.canManageUsers,
    canViewAllVouchers: permissions.canViewAllVouchers
  });
  
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

  /**
   * PHASE 1: Complete session cleanup - removes ALL auth-related data
   * Prevents stale tokens from causing login issues in preview environment
   */
  const clearAuthState = async () => {
    console.log('🧹 [clearAuthState] Cleaning up all auth state');
    
    try {
      // 1. Sign out from Supabase
      await supabase.auth.signOut();
      
      // 2. Clear React state
      setCurrentUser(null);
      setRequirePasswordChange(false);
      
      // 3. Clear ALL Supabase-related localStorage keys
      const supabaseKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || key.includes('supabase')
      );
      supabaseKeys.forEach(key => {
        console.log('  🗑️ Removing:', key);
        localStorage.removeItem(key);
      });
      
      // 4. Clear general storage
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('✅ [clearAuthState] Cleanup complete');
    } catch (error) {
      console.error('❌ [clearAuthState] Error during cleanup:', error);
      // Force clear even if signOut fails
      setCurrentUser(null);
      setRequirePasswordChange(false);
      localStorage.clear();
      sessionStorage.clear();
    }
  };

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
              setCurrentUser(null); // Clear stale state
              setIsInitialized(true);
            } else if (profile?.status === 'INACTIVE') {
              // Query succeeded and user is INACTIVE - block access
              console.log('⛔ [Phase 1] INACTIVE user detected - logging out');
              await supabase.auth.signOut();
              setCurrentUser(null); // Clear stale state
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
            } catch (error: any) {
              console.error('❌ [AuthContext] Error fetching user:', error);
              
              // PHASE 3: If RLS error or critical failure, clear everything
              const isCriticalError = 
                error?.code === '42501' || 
                error?.code === 'PGRST301' || 
                error?.message?.includes('JWT') ||
                error?.message?.includes('RLS') ||
                error?.message?.includes('permission denied');
              
              if (isCriticalError) {
                console.error('🚨 [AuthContext] Critical auth error - force logout');
                await clearAuthState();
                
                toast({
                  title: "Phiên đăng nhập hết hạn",
                  description: "Vui lòng đăng nhập lại.",
                  variant: "destructive",
                });
                
                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                  window.location.href = '/login';
                }
              } else {
                // Non-critical error - just clear state
                setCurrentUser(null);
                setRequirePasswordChange(false);
              }
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // PHASE 4: Validate session exists and is valid
        if (sessionError) {
          console.warn('⚠️ [checkSession] Session error:', sessionError.message);
          await clearAuthState();
          setIsInitialized(true);
          return;
        }
        
        if (!session) {
          console.log('ℹ️ [checkSession] No session found');
          setIsInitialized(true);
          return;
        }
        
        // PHASE 4: Validate session expiry with 5-minute buffer
        const expiresAt = session.expires_at;
        const EXPIRY_BUFFER = 300; // 5 minutes in seconds
        
        if (expiresAt && (expiresAt - EXPIRY_BUFFER) < Math.floor(Date.now() / 1000)) {
          console.warn('⚠️ [checkSession] Session expired or expiring soon - clearing');
          await clearAuthState();
          setIsInitialized(true);
          
          toast({
            title: "Phiên đăng nhập hết hạn",
            description: "Vui lòng đăng nhập lại.",
          });
          
          return;
        }
        
        console.log('🔍 [checkSession] Valid session found, checking user status');
        
        // Phase 1: Quick status check
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.warn('⚠️ [checkSession] Failed to check status - clearing session:', error.message);
          await clearAuthState(); // PHASE 2: Use helper
          setIsInitialized(true);
          
          // Force page reload to ensure clean state
          if (window.location.pathname !== '/login') {
            console.log('🔄 [checkSession] Redirecting to login...');
            window.location.href = '/login';
          }
          return;
        }
        
        if (profile?.status === 'INACTIVE') {
          console.log('⛔ [checkSession] INACTIVE user detected - logging out');
          await supabase.auth.signOut();
          setCurrentUser(null);
          toast({
            title: "Tài khoản bị vô hiệu hóa",
            description: "Tài khoản của bạn đã bị vô hiệu hóa.",
            variant: "destructive",
          });
          setIsInitialized(true);
          return;
        }
        
        console.log('✅ [checkSession] User status is ACTIVE - proceeding');
        setIsInitialized(true);
        
        // Phase 2: Load full profile (non-blocking)
        setTimeout(() => {
          fetchUserWithPermissions(session.user).then(({ user, passwordChangeRequired }) => {
            setCurrentUser(user);
            setRequirePasswordChange(passwordChangeRequired);
            console.log('✅ [checkSession] Profile loaded:', user.email);
          }).catch(async (err) => {
            console.error('❌ [checkSession] Failed to load profile - forcing logout:', err);
            
            // PHASE 2: Force logout + clear everything (stale session detected)
            await clearAuthState();
            
            toast({
              title: "Phiên đăng nhập hết hạn",
              description: "Vui lòng đăng nhập lại.",
              variant: "destructive",
            });
            
            // Force redirect to login
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          });
        }, 0);
      } catch (error) {
        console.error('❌ [checkSession] Unexpected error:', error);
        // PHASE 2: Force clean state on any error
        await clearAuthState();
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
      await clearAuthState(); // Use helper for consistency
      
      console.log('✅ [AuthContext] User logged out and storage cleared');
      
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

  // PHASE 5: Add debugging helper (development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as any).debugAuthState = async () => {
        console.log('🔍 ===== DEBUG AUTH STATE =====');
        console.log('- currentUser:', currentUser);
        console.log('- isInitialized:', isInitialized);
        console.log('- isLoading:', isLoading);
        console.log('- requirePasswordChange:', requirePasswordChange);
        console.log('- localStorage keys:', Object.keys(localStorage));
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('- Supabase session:', session);
        if (session?.expires_at) {
          const expiryDate = new Date(session.expires_at * 1000);
          const minutesUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / 1000 / 60);
          console.log('- Session expires:', expiryDate.toLocaleString());
          console.log('- Time until expiry:', minutesUntilExpiry, 'minutes');
        }
        console.log('==============================');
      };
      
      console.log('💡 Debug helper available: window.debugAuthState()');
    }
  }, [currentUser, isInitialized, isLoading, requirePasswordChange]);

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
