// AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Giữ nguyên đường dẫn type theo dự án của bạn
import { User, UserPermissions, ERPModule, VoucherFeature, UserRole } from "@/types/auth";

/* ============================================================================
 *  Context Types
 * ==========================================================================*/
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
  isLoading: boolean;
  requirePasswordChange: boolean;
  setRequirePasswordChange: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

/* ============================================================================
 *  Small utilities
 * ==========================================================================*/

// Chỉ xoá key liên quan Supabase để tránh xóa nhầm dữ liệu app khác
const clearSupabaseStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) {
      if (k.startsWith("sb-") || k.toLowerCase().includes("supabase")) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    /* no-op */
  }
};

// Chống spam toast trong 30s cho cùng 1 "key"
const notifyOnce = (() => {
  const cache = new Map<string, number>();
  const TTL = 30_000;
  return (key: string, fn: () => void) => {
    const now = Date.now();
    const last = cache.get(key) ?? 0;
    if (now - last > TTL) {
      cache.set(key, now);
      fn();
    }
  };
})();

/* ============================================================================
 *  Permission mapping (Single source of truth)
 * ==========================================================================*/

const ALL_MODULES: ERPModule[] = [
  "dashboard",
  "customers",
  "sales",
  "inventory",
  "accounting",
  "hr",
  "voucher",
  "marketing",
  "affiliate",
  "system-settings",
  "user-management",
];

type DbPermissionLike = {
  feature_code?: string | null;
  module_code?: ERPModule | null;
  // dự phòng nếu payload join sâu (giữ lại để tương thích)
  features?: {
    code?: string | null;
    modules?: { code?: ERPModule | null } | null;
  } | null;
};

/**
 * Gộp toàn bộ logic chuyển quyền về một nơi.
 * - Nếu role là owner/admin => full_access + ALL_MODULES + toàn bộ voucherFeatures phổ biến.
 * - Các role khác: map từ feature_code / module_code.
 */
const transformPermissions = (
  dbPermissions: DbPermissionLike[] | null | undefined,
  roleName?: string,
): UserPermissions => {
  const modules = new Set<ERPModule>();
  const features = new Set<string>();
  const voucher = new Set<VoucherFeature>();
  let canManageUsers = false;
  let canViewAllVouchers = false;

  const rn = (roleName || "").toLowerCase();
  const isOwner = rn === "owner" || rn === "admin";

  if (isOwner) {
    return {
      modules: [...ALL_MODULES],
      features: ["full_access"], // guard sẽ hiểu full_access là siêu quyền
      voucherFeatures: [
        "voucher-dashboard",
        "campaign-management",
        "issue-voucher",
        "voucher-list",
        "voucher-analytics",
        "voucher-leaderboard",
        "voucher-settings",
      ],
      canManageUsers: true,
      canViewAllVouchers: true,
    };
  }

  (dbPermissions || []).forEach((p) => {
    const featureCode = p.feature_code ?? p.features?.code ?? undefined;
    const moduleCode = (p.module_code ?? p.features?.modules?.code) as ERPModule | null | undefined;

    if (featureCode) features.add(featureCode);
    if (moduleCode) modules.add(moduleCode);

    // Map các tính năng voucher
    if (moduleCode === "voucher") {
      if (featureCode === "view_voucher" || featureCode === "read_voucher") {
        voucher.add("voucher-list");
        voucher.add("voucher-dashboard");
        canViewAllVouchers = true;
      }
      if (featureCode === "create_voucher") voucher.add("issue-voucher");
      if (featureCode === "approve_voucher" || featureCode === "manage_campaign") voucher.add("campaign-management");
      if (featureCode === "view_voucher_analytics") voucher.add("voucher-analytics");
      if (featureCode === "view_voucher_leaderboard") voucher.add("voucher-leaderboard");
      if (featureCode === "manage_voucher_settings") voucher.add("voucher-settings");
    }

    if (featureCode && ["manage_members", "manage_roles", "create_member"].includes(featureCode)) {
      canManageUsers = true;
    }
  });

  return {
    modules: Array.from(modules),
    features: Array.from(features),
    voucherFeatures: Array.from(voucher),
    canManageUsers,
    canViewAllVouchers,
  };
};

/* ============================================================================
 *  Guards: dùng thống nhất trong UI
 * ==========================================================================*/

/** Siêu quyền */
export const hasFullAccess = (user: User | null) => !!user?.permissions?.features?.includes("full_access");

/** Kiểm tra feature */
export const hasFeature = (user: User | null, feature: string) => {
  if (!user) return false;
  if (hasFullAccess(user)) return true;
  return !!user.permissions?.features?.includes(feature);
};

/** Kiểm tra module */
export const hasModule = (user: User | null, moduleCode: ERPModule) => {
  if (!user) return false;
  if (hasFullAccess(user)) return true;
  return !!user.permissions?.modules?.includes(moduleCode);
};

/* ============================================================================
 *  DB fetch layer
 * ==========================================================================*/

const fetchUserWithPermissions = async (
  supaUser: SupabaseUser,
): Promise<{ user: User; passwordChangeRequired: boolean }> => {
  // 1) Lấy hồ sơ (chỉ cột cần)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, phone, avatar_path, password_change_required, status")
    .eq("id", supaUser.id)
    .single();
  if (profileError) throw profileError;

  // 2) Lấy role + permissions (join như code cũ của bạn)
  const { data: userRoleData, error: roleErr } = await supabase
    .from("user_roles")
    .select(
      `
      role_id,
      roles!user_roles_role_id_fkey (
        id,
        name,
        description,
        role_permissions (
          features (
            code,
            module_id,
            modules ( code )
          )
        )
      )
    `,
    )
    .eq("user_id", supaUser.id)
    .single();

  if (roleErr) throw roleErr;
  if (!userRoleData || !(userRoleData as any).roles) {
    throw new Error("User has no assigned role. Please contact administrator.");
  }

  const roleData = (userRoleData as any).roles as {
    id: string;
    name: string;
    role_permissions?: Array<{
      features?: { code?: string | null; modules?: { code?: ERPModule | null } | null };
    }>;
  };

  const roleName = (roleData.name || "custom").toLowerCase();
  const rolePermissions = roleData.role_permissions || [];

  // 3) Flatten để đưa vào transformPermissions
  const flattened: DbPermissionLike[] = rolePermissions.map((rp) => {
    const f = rp.features || {};
    return {
      feature_code: f.code || undefined,
      module_code: (f.modules?.code as ERPModule | null) ?? undefined,
      features: f as any,
    };
  });

  // 4) Map role name -> legacy UserRole
  let userRole: UserRole = "custom";
  if (roleName === "owner" || roleName === "admin") userRole = "erp-admin";

  // 5) Build final permissions
  const permissions = transformPermissions(flattened, roleName);

  const user: User = {
    id: supaUser.id,
    fullName: profile?.full_name || "User",
    username: supaUser.email?.split("@")[0] || "",
    email: supaUser.email || "",
    phone: profile?.phone ?? null,
    role: userRole,
    permissions,
    isActive: true,
    status: supaUser.email_confirmed_at ? "active" : "pending_verification",
    createdAt: supaUser.created_at,
    lastLogin: new Date().toISOString(),
    emailVerified: !!supaUser.email_confirmed_at,
    avatarPath: profile?.avatar_path ?? null,
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 5,
      passwordChangeRequired: !!profile?.password_change_required,
    },
    activities: [],
  };

  return {
    user,
    passwordChangeRequired: !!profile?.password_change_required,
  };
};

/* ============================================================================
 *  Auth Provider
 * ==========================================================================*/

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const { toast } = useToast();

  const fetchAbortRef = useRef<AbortController | null>(null);

  const clearAuthState = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      /* no-op */
    }
    setCurrentUser(null);
    setRequirePasswordChange(false);
    clearSupabaseStorage();
    try {
      sessionStorage.clear(); // session không chứa bí mật → optional
    } catch {
      /* no-op */
    }
  };

  // Single source of truth: auth listener (tránh double-fetch)
  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        // Quick status check INACTIVE - use maybeSingle to avoid errors
        const { data: st, error: stErr } = await supabase
          .from("profiles")
          .select("status")
          .eq("id", session.user.id)
          .maybeSingle();

        if (stErr) {
          console.error('⚠️ Profile status check failed:', stErr);
          // Don't logout immediately - just warn user
          notifyOnce("status-check-failed", () =>
            toast({
              title: "Cảnh báo",
              description: "Không thể kiểm tra trạng thái tài khoản. Nếu lỗi tiếp tục, vui lòng đăng nhập lại.",
              variant: "default",
            }),
          );
          // Continue with user fetch - don't block on profile check
        }

        if (st?.status === "INACTIVE") {
          await clearAuthState();
          setIsInitialized(true);
          notifyOnce("inactive", () =>
            toast({
              title: "Tài khoản bị vô hiệu hóa",
              description: "Vui lòng liên hệ quản trị viên.",
              variant: "destructive",
            }),
          );
          return;
        }

        // Huỷ các fetch cũ đang chạy
        fetchAbortRef.current?.abort();
        fetchAbortRef.current = new AbortController();

        try {
          const { user, passwordChangeRequired } = await fetchUserWithPermissions(session.user);
          if (!mounted) return;
          setCurrentUser(user);
          setRequirePasswordChange(passwordChangeRequired);
          setIsInitialized(true);
        } catch {
          await clearAuthState();
          setIsInitialized(true);
          notifyOnce("fetch-user-error", () =>
            toast({
              title: "Phiên đăng nhập hết hạn",
              description: "Vui lòng đăng nhập lại.",
              variant: "destructive",
            }),
          );
          if (window.location.pathname !== "/login") window.location.href = "/login";
        }
      } else {
        // logged out
        setCurrentUser(null);
        setRequirePasswordChange(false);
        setIsInitialized(true);
      }
    });

    // Kích hoạt trạng thái hiện tại (không fetch thêm)
    supabase.auth.getSession().then(() => {});

    return () => {
      mounted = false;
      subscription?.unsubscribe();
      fetchAbortRef.current?.abort();
    };
  }, [toast]);

  // Safety timeout: đề phòng khởi tạo treo
  useEffect(() => {
    const t = setTimeout(() => {
      if (!isInitialized) setIsInitialized(true);
    }, 5000);
    return () => clearTimeout(t);
  }, [isInitialized]);

  // Auto-refresh session every 45 minutes to prevent expiry
  useEffect(() => {
    if (!currentUser) return;

    const refreshInterval = setInterval(async () => {
      console.log('🔄 Auto-refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Session refresh failed:', error);
        notifyOnce("session-refresh-failed", () =>
          toast({
            title: "Cảnh báo",
            description: "Phiên đăng nhập sắp hết hạn. Vui lòng lưu công việc.",
            variant: "default",
          }),
        );
      } else {
        console.log('✅ Session refreshed successfully');
      }
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(refreshInterval);
  }, [currentUser, toast]);

  // Realtime: lắng nghe thay đổi status của chính user
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel(`profile-status-${currentUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${currentUser.id}`,
        },
        async (payload) => {
          const newStatus = (payload.new as any)?.status;
          const oldStatus = (payload.old as any)?.status;
          if (newStatus === "INACTIVE" && oldStatus !== "INACTIVE") {
            notifyOnce("inactive-realtime", () =>
              toast({
                title: "Tài khoản bị vô hiệu hóa",
                description: "Bạn sẽ bị đăng xuất.",
                variant: "destructive",
              }),
            );
            await clearAuthState();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, toast]);

  /* ------------------------------------------------------------------------ *
   *  Public API
   * ------------------------------------------------------------------------ */

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Nếu provider là email và chưa verify thì chặn
      const provider = data.session?.user?.app_metadata?.provider;
      const emailConfirmed = !!data.user?.email_confirmed_at;
      if (!emailConfirmed && (!provider || provider === "email")) {
        await supabase.auth.signOut();
        toast({
          title: "Email chưa xác thực",
          description: "Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập.",
          variant: "destructive",
          duration: 6000,
        });
        return false;
      }

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${data.user?.email?.split("@")[0] || "bạn"}!`,
        duration: 4000,
      });

      // Phần lấy profile/permission do onAuthStateChange xử lý
      return true;
    } catch (e: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: e?.message || "Thông tin đăng nhập không chính xác",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await clearAuthState();
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống",
        duration: 4000,
      });
      if (window.location.pathname !== "/login") window.location.href = "/login";
    } catch {
      /* no-op */
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    const {
      data: { user: sbUser },
    } = await supabase.auth.getUser();
    if (!sbUser) return;

    try {
      const { user, passwordChangeRequired } = await fetchUserWithPermissions(sbUser);
      setCurrentUser(user);
      setRequirePasswordChange(passwordChangeRequired);
    } catch {
      notifyOnce("refresh-user-fail", () =>
        toast({
          title: "Không thể tải lại hồ sơ",
          description: "Vui lòng thử lại.",
          variant: "destructive",
        }),
      );
    }
  };

  const refreshPermissions = async () => {
    const {
      data: { user: sbUser },
    } = await supabase.auth.getUser();
    if (!sbUser) return;
    try {
      const { user, passwordChangeRequired } = await fetchUserWithPermissions(sbUser);
      setCurrentUser(user);
      setRequirePasswordChange(passwordChangeRequired);
    } catch {
      notifyOnce("refresh-perm-fail", () =>
        toast({
          title: "Không thể tải lại quyền truy cập",
          description: "Vui lòng thử lại.",
          variant: "destructive",
        }),
      );
    }
  };

  /* ------------------------------------------------------------------------ *
   *  Render
   * ------------------------------------------------------------------------ */

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser?.emailVerified,
      login,
      logout,
      refreshUserProfile,
      refreshPermissions,
      isLoading,
      requirePasswordChange,
      setRequirePasswordChange,
    }),
    [currentUser, isLoading, requirePasswordChange],
  );

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
