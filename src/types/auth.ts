
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: UserPermissions;
  businessId: string | null;
  departmentId: string | null;
  groupId: string | null;
  status: UserStatus;
  email_verified_at: string | null;
  emailVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  avatarPath?: string;
  notes?: string;
  securitySettings: UserSecuritySettings;
  activities: UserActivity[];
}

export interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  loginAttemptLimit: number;
  passwordChangeRequired: boolean;
  lastPasswordChange?: string;
}

export interface UserActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Business {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  website: string | null;
  socialLinks: {
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    instagram: string | null;
  };
  timezone: string;
  currency: string;
  language: string;
  industry: string;
  numberOfEmployees: number;
  annualRevenue: number;
  country: string;
  city: string;
  postalCode: string;
  ownerId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type ERPModule = 
  | 'dashboard'
  | 'customers'
  | 'sales'
  | 'inventory'
  | 'voucher'
  | 'affiliate'
  | 'marketing'
  | 'user-management'
  | 'system-settings'
  | 'profile';

export type VoucherFeature = 
  | 'voucher-dashboard'
  | 'campaign-management'
  | 'issue-voucher'
  | 'voucher-list'
  | 'voucher-analytics'
  | 'voucher-leaderboard'
  | 'voucher-settings';

export type UserRole = 'erp-admin' | 'voucher-admin' | 'telesales' | 'custom';

export type UserStatus = 'active' | 'inactive' | 'pending_verification' | 'locked';

export interface UserPermissions {
  modules: string[];
  actions: string[];
  voucherFeatures: VoucherFeature[];
  canManageUsers: boolean;
  canViewAllVouchers: boolean;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  notes?: string;
  permissions: UserPermissions;
}

export interface UpdateUserData {
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  notes?: string;
  permissions?: UserPermissions;
}

export interface Invitation {
  id: number;
  email: string;
  businessId: number;
  role: string;
  modules: string[];
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to get avatar URL
export const getAvatarUrl = (avatarPath?: string): string => {
  if (!avatarPath) return '';
  
  // If it's already a full URL, return as is
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  // If it's a relative path, construct the full URL
  return `https://api.matkinhtamduc.xyz/storage/${avatarPath}`;
};
