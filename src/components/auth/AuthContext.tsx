import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, UserStatus } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const { toast } = useToast();

  // Toggle this to true to bypass Supabase Auth
  const USE_MOCK_AUTH = true;

  const refreshUserProfile = async () => {
    if (USE_MOCK_AUTH) {
      const mockUser: User = {
        id: 'mock-user-id',
        email: 'admin@example.com',
        username: 'admin',
        fullName: 'Admin User',
        phone: '0909000000',
        avatarPath: 'https://github.com/shadcn.png',
        status: 'active',
        role: 'erp-admin',
        permissions: {
          modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'marketing', 'voucher', 'operations', 'affiliate', 'system-settings', 'user-management', 'crm'],
          features: ['full_access'],
          voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
          canManageUsers: true,
          canViewAllVouchers: true,
        },
        isActive: true,
        emailVerified: true,
        securitySettings: {
          twoFactorEnabled: false,
          loginAttemptLimit: 5,
          passwordChangeRequired: false,
        },
        activities: [],
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(mockUser);
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setCurrentUser(null);
        return;
      }

      // Call the RPC function to get profile + role + permissions
      const { data, error } = await supabase.rpc('get_user_profile_simple', {
        _user_id: user.id
      });

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (data) {
        const profileData = data as any;

        // Map RPC response to User type
        const mappedUser: User = {
          id: user.id,
          email: user.email || "",
          username: user.email || "",
          fullName: profileData.profile?.full_name || user.email?.split('@')[0] || "User",
          phone: profileData.profile?.phone || "",
          avatarPath: profileData.profile?.avatar_path,
          status: (profileData.profile?.status?.toLowerCase() as UserStatus) || "active",
          role: (profileData.role?.name?.toLowerCase() || "user") as any,
          permissions: {
            modules: profileData.modules || [],
            features: profileData.features || [],
            voucherFeatures: [], // TODO: Map specific voucher features if needed
            canManageUsers: profileData.features?.includes('manage_users') || false,
            canViewAllVouchers: profileData.features?.includes('view_all_vouchers') || false,
          },
          isActive: profileData.profile?.status === 'ACTIVE' || profileData.profile?.status === 'active',
          emailVerified: user.email_confirmed_at ? true : false,
          securitySettings: {
            twoFactorEnabled: false,
            loginAttemptLimit: 5,
            passwordChangeRequired: false,
          },
          activities: [],
          createdAt: user.created_at,
        };

        setCurrentUser(mappedUser);
      }
    } catch (error) {
      console.error("Error in refreshUserProfile:", error);
    }
  };

  const refreshPermissions = async () => {
    await refreshUserProfile();
  };

  useEffect(() => {
    if (USE_MOCK_AUTH) {
      refreshUserProfile();
      return;
    }

    // Check active session
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await refreshUserProfile();
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);

      if (event === 'SIGNED_IN' && session) {
        await refreshUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Đăng nhập thất bại",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
        requirePasswordChange,
        setRequirePasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
