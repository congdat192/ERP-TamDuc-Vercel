
import { ModulePermission, UserPermissions, UserRole, VoucherFeature, AffiliateFeature } from '@/types/auth';

export const MODULE_PERMISSIONS: ModulePermission[] = [
  {
    module: 'dashboard',
    label: 'Tổng Quan',
    icon: 'LayoutDashboard',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom', 'affiliate-admin']
  },
  {
    module: 'customers',
    label: 'Khách Hàng',
    icon: 'Users',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    module: 'sales',
    label: 'Bán Hàng',
    icon: 'ShoppingCart',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    module: 'inventory',
    label: 'Kho Hàng',
    icon: 'Package',
    allowedRoles: ['erp-admin', 'custom']
  },
  {
    module: 'accounting',
    label: 'Kế Toán',
    icon: 'Calculator',
    allowedRoles: ['erp-admin', 'custom']
  },
  {
    module: 'hr',
    label: 'Nhân Sự',
    icon: 'UserCheck',
    allowedRoles: ['erp-admin', 'custom']
  },
  {
    module: 'voucher',
    label: 'Voucher',
    icon: 'Gift',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    module: 'marketing',
    label: 'Marketing',
    icon: 'Megaphone',
    allowedRoles: ['erp-admin', 'custom']
  },
  {
    module: 'affiliate',
    label: 'Affiliate',
    icon: 'Network',
    allowedRoles: ['erp-admin', 'affiliate-admin', 'custom']
  },
  {
    module: 'system-settings',
    label: 'Cài Đặt',
    icon: 'Settings',
    allowedRoles: ['erp-admin', 'custom']
  },
  {
    module: 'user-management',
    label: 'Quản Lý User',
    icon: 'Users',
    allowedRoles: ['erp-admin', 'custom']
  }
];

export const VOUCHER_FEATURES: { id: VoucherFeature; label: string; allowedRoles: readonly UserRole[] }[] = [
  {
    id: 'voucher-dashboard',
    label: 'Dashboard Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    id: 'campaign-management',
    label: 'Quản Lý Campaign',
    allowedRoles: ['erp-admin', 'voucher-admin', 'custom']
  },
  {
    id: 'issue-voucher',
    label: 'Phát Hành Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    id: 'voucher-list',
    label: 'Danh Sách Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    id: 'voucher-analytics',
    label: 'Thống Kê Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin', 'custom']
  },
  {
    id: 'voucher-leaderboard',
    label: 'Bảng Xếp Hạng',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    id: 'voucher-settings',
    label: 'Cài Đặt Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin', 'custom']
  }
];

export const AFFILIATE_FEATURES: { id: AffiliateFeature; label: string; allowedRoles: readonly UserRole[] }[] = [
  {
    id: 'affiliate-dashboard',
    label: 'Dashboard Affiliate',
    allowedRoles: ['erp-admin', 'affiliate-admin', 'custom']
  },
  {
    id: 'referrer-management',
    label: 'Quản Lý F0',
    allowedRoles: ['erp-admin', 'affiliate-admin', 'custom']
  },
  {
    id: 'voucher-monitoring',
    label: 'Theo Dõi Voucher',
    allowedRoles: ['erp-admin', 'affiliate-admin', 'custom']
  },
  {
    id: 'commission-tracking',
    label: 'Theo Dõi Hoa Hồng',
    allowedRoles: ['erp-admin', 'affiliate-admin', 'custom']
  },
  {
    id: 'affiliate-analytics',
    label: 'Thống Kê Affiliate',
    allowedRoles: ['erp-admin', 'affiliate-admin', 'custom']
  },
  {
    id: 'affiliate-reports',
    label: 'Báo Cáo Affiliate',
    allowedRoles: ['erp-admin', 'affiliate-admin', 'custom']
  }
];

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  'erp-admin': {
    modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'marketing', 'affiliate', 'system-settings', 'user-management'],
    voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
    affiliateFeatures: ['affiliate-dashboard', 'referrer-management', 'voucher-monitoring', 'commission-tracking', 'affiliate-analytics', 'affiliate-reports'],
    canManageUsers: true,
    canViewAllVouchers: true
  },
  'voucher-admin': {
    modules: ['dashboard', 'voucher'],
    voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
    affiliateFeatures: [],
    canManageUsers: false,
    canViewAllVouchers: true
  },
  'affiliate-admin': {
    modules: ['dashboard', 'affiliate'],
    voucherFeatures: [],
    affiliateFeatures: ['affiliate-dashboard', 'referrer-management', 'voucher-monitoring', 'commission-tracking', 'affiliate-analytics', 'affiliate-reports'],
    canManageUsers: false,
    canViewAllVouchers: false
  },
  'affiliate-referrer': {
    modules: ['dashboard'],
    voucherFeatures: [],
    affiliateFeatures: ['affiliate-dashboard'],
    canManageUsers: false,
    canViewAllVouchers: false
  },
  'telesales': {
    modules: ['dashboard', 'customers', 'voucher'],
    voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list'],
    affiliateFeatures: [],
    canManageUsers: false,
    canViewAllVouchers: false
  },
  'custom': {
    modules: [],
    voucherFeatures: [],
    affiliateFeatures: [],
    canManageUsers: false,
    canViewAllVouchers: false
  },
  'platform-admin': {
    modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'marketing', 'affiliate', 'system-settings', 'user-management'],
    voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
    affiliateFeatures: ['affiliate-dashboard', 'referrer-management', 'voucher-monitoring', 'commission-tracking', 'affiliate-analytics', 'affiliate-reports'],
    canManageUsers: true,
    canViewAllVouchers: true
  }
};
