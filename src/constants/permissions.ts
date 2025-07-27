
import { ModulePermission, UserRole, ERPModule, VoucherFeature, AffiliateFeature } from '@/types/auth';
import { BarChart3, Users, ShoppingCart, Package, Calculator, UserCheck, Ticket, Megaphone, Settings, UserCog, Share2 } from 'lucide-react';

export const MODULE_PERMISSIONS: ModulePermission[] = [
  {
    module: 'dashboard',
    label: 'Tổng Quan',
    icon: 'BarChart3',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    module: 'customers',
    label: 'Khách Hàng',
    icon: 'Users',
    allowedRoles: ['erp-admin', 'telesales', 'custom']
  },
  {
    module: 'sales',
    label: 'Hóa Đơn',
    icon: 'ShoppingCart',
    allowedRoles: ['erp-admin', 'telesales', 'custom']
  },
  {
    module: 'inventory',
    label: 'Sản Phẩm',
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
    icon: 'Ticket',
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
    icon: 'Share2',
    allowedRoles: ['erp-admin', 'affiliate-admin', 'custom']
  },
  {
    module: 'system-settings',
    label: 'Cài Đặt Hệ Thống',
    icon: 'Settings',
    allowedRoles: ['erp-admin']
  },
  {
    module: 'user-management',
    label: 'Quản Lý Người Dùng',
    icon: 'UserCog',
    allowedRoles: ['erp-admin']
  }
];

export const DEFAULT_PERMISSIONS = {
  modules: [],
  voucherFeatures: [],
  affiliateFeatures: [],
  canManageUsers: false,
  canViewAllVouchers: false
};

export const VOUCHER_FEATURES: VoucherFeature[] = [
  'voucher-dashboard',
  'campaign-management',
  'issue-voucher',
  'voucher-list',
  'voucher-analytics',
  'voucher-leaderboard',
  'voucher-settings'
];

export const AFFILIATE_FEATURES: AffiliateFeature[] = [
  'affiliate-dashboard',
  'referrer-management',
  'voucher-monitoring',
  'commission-tracking',
  'affiliate-analytics',
  'affiliate-reports'
];
