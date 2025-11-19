/**
 * Mocked AuthContext for No-Auth Mode
 * - Always returns a logged-in user with Owner role
 * - Bypasses all Supabase Auth checks
 */

import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserStatus } from "@/types/auth";

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

// Mock User Object
const MOCK_USER: User = {
  id: "mock-user-id",
  fullName: "Admin User",
  username: "admin@example.com",
  email: "admin@example.com",
  phone: "0123456789",
  avatarPath: null,
  status: "ACTIVE" as UserStatus,
  role: "owner" as any,
  permissions: {
    modules: ["dashboard", "customers", "sales", "inventory", "marketing", "hr", "affiliate", "user-management", "system-settings", "profile"],
    features: ["full_access"],
    voucherFeatures: [],
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser] = useState<User | null>(MOCK_USER);
  const [isLoading] = useState(false);

  const login = async (): Promise<boolean> => {
    console.log("🔓 [AuthContext] Mock login successful");
    return true;
  };

  const logout = async (): Promise<void> => {
    console.log("👋 [AuthContext] Mock logout (no-op)");
  };

  const refreshUserProfile = async (): Promise<void> => {
    console.log("🔄 [AuthContext] Mock refresh profile");
  };

  const refreshPermissions = async (): Promise<void> => {
    console.log("🔄 [AuthContext] Mock refresh permissions");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: true,
        isLoading,
        login,
        logout,
        refreshUserProfile,
        refreshPermissions,
        requirePasswordChange: false,
        setRequirePasswordChange: () => { },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
