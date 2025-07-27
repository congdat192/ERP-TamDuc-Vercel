
import { ERPModule, UserRole, UserPermissions, VoucherFeature } from "@/types/auth";

export const MODULE_PERMISSIONS = [
  {
    module: 'dashboard' as ERPModule,
    label: 'Tổng Quan',
    icon: 'LayoutDashboard',
    permissions: ['dashboard.view'],
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom'] as UserRole[]
  },
  {
    module: 'customers' as ERPModule,
    label: 'Khách Hàng',
    icon: 'Users',
    permissions: ['customers.view'],
    allowedRoles: ['erp-admin', 'telesales', 'custom'] as UserRole[]
  },
  {
    module: 'sales' as ERPModule,
    label: 'Hóa Đơn',
    icon: 'Receipt',
    permissions: ['sales.view'],
    allowedRoles: ['erp-admin', 'custom'] as UserRole[]
  },
  {
    module: 'inventory' as ERPModule,
    label: 'Kho Hàng',
    icon: 'Package',
    permissions: ['inventory.view'],
    allowedRoles: ['erp-admin', 'custom'] as UserRole[]
  },
  {
    module: 'voucher' as ERPModule,
    label: 'Voucher',
    icon: 'Ticket',
    permissions: ['voucher.view'],
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom'] as UserRole[]
  },
  {
    module: 'affiliate' as ERPModule,
    label: 'Affiliate',
    icon: 'Users',
    permissions: ['affiliate.view'],
    allowedRoles: ['erp-admin', 'custom'] as UserRole[]
  },
  {
    module: 'marketing' as ERPModule,
    label: 'Marketing',
    icon: 'Megaphone',
    permissions: ['marketing.view'],
    allowedRoles: ['erp-admin', 'custom'] as UserRole[]
  },
  {
    module: 'user-management' as ERPModule,
    label: 'Quản Lý Người Dùng',
    icon: 'Settings',
    permissions: ['user-management.view'],
    allowedRoles: ['erp-admin'] as UserRole[]
  },
  {
    module: 'system-settings' as ERPModule,
    label: 'Cài Đặt Hệ Thống',
    icon: 'Settings',
    permissions: ['system-settings.view'],
    allowedRoles: ['erp-admin'] as UserRole[]
  }
];

export const VOUCHER_FEATURES = [
  {
    id: 'voucher-dashboard' as VoucherFeature,
    label: 'Tổng Quan Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom'] as UserRole[]
  },
  {
    id: 'campaign-management' as VoucherFeature,
    label: 'Quản Lý Chiến Dịch',
    allowedRoles: ['erp-admin', 'voucher-admin'] as UserRole[]
  },
  {
    id: 'issue-voucher' as VoucherFeature,
    label: 'Phát Hành Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom'] as UserRole[]
  },
  {
    id: 'voucher-list' as VoucherFeature,
    label: 'Danh Sách Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom'] as UserRole[]
  },
  {
    id: 'voucher-analytics' as VoucherFeature,
    label: 'Phân Tích Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin'] as UserRole[]
  },
  {
    id: 'voucher-leaderboard' as VoucherFeature,
    label: 'Bảng Xếp Hạng',
    allowedRoles: ['erp-admin', 'voucher-admin'] as UserRole[]
  },
  {
    id: 'voucher-settings' as VoucherFeature,
    label: 'Cài Đặt Voucher',
    allowedRoles: ['erp-admin', 'voucher-admin'] as UserRole[]
  }
];

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  'erp-admin': {
    modules: ['dashboard', 'customers', 'sales', 'inventory', 'voucher', 'affiliate', 'marketing', 'user-management', 'system-settings'],
    actions: ['view', 'create', 'edit', 'delete'],
    voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
    canManageUsers: true,
    canViewAllVouchers: true
  },
  'voucher-admin': {
    modules: ['dashboard', 'voucher'],
    actions: ['view', 'create', 'edit'],
    voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
    canManageUsers: false,
    canViewAllVouchers: true
  },
  'telesales': {
    modules: ['dashboard', 'customers', 'voucher'],
    actions: ['view', 'create'],
    voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list'],
    canManageUsers: false,
    canViewAllVouchers: false
  },
  'custom': {
    modules: ['dashboard'],
    actions: ['view'],
    voucherFeatures: [],
    canManageUsers: false,
    canViewAllVouchers: false
  }
};
