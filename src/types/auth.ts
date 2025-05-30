
export type UserRole = 
  | 'erp-admin' 
  | 'voucher-admin' 
  | 'telesales' 
  | 'custom';

export type ERPModule = 
  | 'dashboard' 
  | 'customers' 
  | 'sales' 
  | 'inventory' 
  | 'accounting' 
  | 'hr' 
  | 'voucher' 
  | 'system-settings' 
  | 'user-management';

export type VoucherFeature = 
  | 'voucher-dashboard' 
  | 'issue-voucher' 
  | 'voucher-list' 
  | 'voucher-analytics' 
  | 'voucher-leaderboard' 
  | 'voucher-settings';

export type UserStatus = 'active' | 'inactive' | 'locked' | 'pending_verification';

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  loginAttemptLimit: number;
  passwordChangeRequired: boolean;
  lastPasswordChange?: Date;
  sessionTimeoutMinutes: number;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  phone?: string;
  status: UserStatus;
  notes?: string;
  createdAt: Date;
  lastLogin?: Date;
  emailVerified: boolean;
  permissions: {
    modules: ERPModule[];
    voucherFeatures?: VoucherFeature[];
    canManageUsers?: boolean;
    canViewAllVouchers?: boolean;
  };
  securitySettings: UserSecuritySettings;
  activities: UserActivity[];
}

export interface ModulePermission {
  module: ERPModule;
  label: string;
  icon: string;
  allowedRoles: UserRole[];
  subFeatures?: {
    feature: string;
    label: string;
    allowedRoles: UserRole[];
  }[];
}

export interface CreateUserData {
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
  notes?: string;
  requirePasswordReset: boolean;
  sendVerificationEmail: boolean;
}

export interface UpdateUserData {
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  notes?: string;
  permissions?: {
    modules: ERPModule[];
    voucherFeatures?: VoucherFeature[];
    canManageUsers?: boolean;
    canViewAllVouchers?: boolean;
  };
}
