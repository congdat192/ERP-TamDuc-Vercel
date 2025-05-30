
import { ModulePermission, UserRole } from '@/types/auth';

export const MODULE_PERMISSIONS: ModulePermission[] = [
  {
    module: 'dashboard',
    label: 'Tổng Quan',
    icon: 'LayoutDashboard',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
  },
  {
    module: 'customers',
    label: 'Khách Hàng',
    icon: 'Users',
    allowedRoles: ['erp-admin', 'custom']
  },
  {
    module: 'sales',
    label: 'Bán Hàng',
    icon: 'TrendingUp',
    allowedRoles: ['erp-admin', 'custom']
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
    icon: 'Ticket',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
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
    icon: 'Shield',
    allowedRoles: ['erp-admin']
  }
];

export const VOUCHER_FEATURES = [
  { id: 'voucher-dashboard', label: 'Tổng Quan', allowedRoles: ['erp-admin', 'voucher-admin', 'telesales'] },
  { id: 'issue-voucher', label: 'Phát Hành Voucher', allowedRoles: ['erp-admin', 'voucher-admin', 'telesales'] },
  { id: 'voucher-list', label: 'Danh Sách Voucher', allowedRoles: ['erp-admin', 'voucher-admin', 'telesales'] },
  { id: 'voucher-analytics', label: 'Báo Cáo Phân Tích', allowedRoles: ['erp-admin', 'voucher-admin'] },
  { id: 'voucher-leaderboard', label: 'Bảng Xếp Hạng', allowedRoles: ['erp-admin', 'voucher-admin', 'telesales'] },
  { id: 'voucher-settings', label: 'Cài Đặt', allowedRoles: ['erp-admin', 'voucher-admin'] },
] as const;

export const DEFAULT_PERMISSIONS = {
  'erp-admin': {
    modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'system-settings', 'user-management'],
    voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
    canManageUsers: true,
    canViewAllVouchers: true
  },
  'voucher-admin': {
    modules: ['dashboard', 'voucher'],
    voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
    canManageUsers: false,
    canViewAllVouchers: true
  },
  'telesales': {
    modules: ['dashboard', 'voucher'],
    voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-leaderboard'],
    canManageUsers: false,
    canViewAllVouchers: false
  },
  'custom': {
    modules: ['dashboard'],
    voucherFeatures: [],
    canManageUsers: false,
    canViewAllVouchers: false
  }
};
