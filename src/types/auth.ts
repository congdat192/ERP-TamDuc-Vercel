
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

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  permissions: {
    modules: ERPModule[];
    voucherFeatures?: VoucherFeature[];
    canManageUsers?: boolean;
    canViewAllVouchers?: boolean;
  };
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
