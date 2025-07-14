
export type UserRole = 'erp-admin' | 'voucher-admin' | 'telesales' | 'custom' | 'platform-admin';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'locked' | 'pending' | 'pending_verification';

export type ERPModule = 
  | 'dashboard'
  | 'customers'
  | 'sales'
  | 'inventory'
  | 'accounting'
  | 'hr'
  | 'voucher'
  | 'marketing'
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

export interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  description: string;
  timestamp: string;
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
  avatarPath?: string;
  emailVerified: boolean;
  securitySettings: UserSecuritySettings;
  activities: UserActivity[];
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
  email: string;
  password: string;
}

export interface CreateUserData {
  name?: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  username?: string;
  fullName?: string;
  phone?: string;
  role?: UserRole;
  permissions?: UserPermissions;
  notes?: string;
  sendVerificationEmail?: boolean;
  requirePasswordReset?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  fullName?: string;
  phone?: string;
  role?: UserRole;
  permissions?: UserPermissions;
  notes?: string;
  isActive?: boolean;
  status?: UserStatus;
}
