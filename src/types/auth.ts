
export type UserRole = 'erp-admin' | 'voucher-admin' | 'telesales' | 'custom';

export type UserStatus = 'active' | 'inactive' | 'locked' | 'pending' | 'pending_verification';

export type ERPModule = 
  | 'dashboard'
  | 'customers'
  | 'sales'
  | 'inventory'
  | 'accounting'
  | 'hr'
  | 'voucher'
  | 'marketing'
  | 'affiliate'
  | 'system-settings'
  | 'user-management';

export type VoucherFeature = 
  | 'voucher-dashboard'
  | 'campaign-management'
  | 'issue-voucher'
  | 'voucher-list'
  | 'voucher-analytics'
  | 'voucher-leaderboard'
  | 'voucher-settings';

export interface ModulePermission {
  module: ERPModule;
  label: string;
  icon: string;
  allowedRoles: UserRole[];
}

export interface UserPermissions {
  modules: ERPModule[];
  features: string[]; // Array of feature codes from database (e.g., ["view_customers", "create_customers"])
  voucherFeatures: VoucherFeature[];
  canManageUsers: boolean;
  canViewAllVouchers: boolean;
}

export interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  loginAttemptLimit: number;
  passwordChangeRequired: boolean;
  lastPasswordChange?: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: UserPermissions;
  isActive: boolean;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  avatarPath?: string; // Changed from avatar to avatarPath to match API
  emailVerified: boolean;
  securitySettings: UserSecuritySettings;
  activities: any[];
  notes?: string;
}

// Helper function to construct full avatar URL
export const getAvatarUrl = (avatarPath?: string): string | undefined => {
  if (!avatarPath) return undefined;
  return `https://matkinhtamducxyz.sgp1.digitaloceanspaces.com/${avatarPath}`;
};

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: UserPermissions;
  notes?: string;
  password: string;
  sendVerificationEmail: boolean;
  requirePasswordReset: boolean;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  permissions?: UserPermissions;
  notes?: string;
  isActive?: boolean;
  status?: UserStatus;
}
