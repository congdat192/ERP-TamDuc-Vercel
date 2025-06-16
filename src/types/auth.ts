
export type UserRole = 'erp-admin' | 'voucher-admin' | 'telesales' | 'custom' | 'platform-admin';

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

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
