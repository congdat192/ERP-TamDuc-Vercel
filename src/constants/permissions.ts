
import { ModulePermission, UserRole, ERPModule, VoucherFeature } from '@/types/auth';

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
    label: 'Hóa đơn',
    icon: 'TrendingUp',
    allowedRoles: ['erp-admin', 'custom']
  },
  {
    module: 'inventory',
    label: 'Kho Hàng',
    icon: 'Package',
    allowedRoles: ['erp-admin', 'custom'],
    subMenus: [
      { path: '/ERP/Products', label: 'Sản phẩm', icon: 'Package' },
      { path: '/ERP/KiotViet/products', label: 'KiotViet - Sản phẩm', icon: 'Database' },
      { path: '/ERP/KiotViet/categories', label: 'KiotViet - Nhóm hàng', icon: 'FolderTree' },
      { path: '/ERP/KiotViet/inventory', label: 'KiotViet - Tồn kho', icon: 'Boxes' }
    ]
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
    module: 'marketing',
    label: 'Marketing',
    icon: 'Target',
    allowedRoles: ['erp-admin', 'custom'],
    subMenus: [
      { path: '/ERP/Marketing', label: 'Khách hàng', icon: 'Users' },
      { path: '/ERP/Marketing/voucher', label: 'Quản lý Voucher', icon: 'Ticket', requiredFeature: 'view_vouchers' }
    ]
  },
  {
    module: 'operations',
    label: 'Vận Hành',
    icon: 'Wrench',
    allowedRoles: ['erp-admin', 'custom'],
    subMenus: [
      { path: '/ERP/Operations/Lens-Admin', label: 'Lens Catalog Admin', icon: 'Glasses' }
    ]
  },
  {
    module: 'affiliate',
    label: 'Affiliate',
    icon: 'UserPlus',
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
  { id: 'campaign-management', label: 'Quản Lý Chiến Dịch', allowedRoles: ['erp-admin', 'voucher-admin'] },
  { id: 'issue-voucher', label: 'Phát Hành Voucher', allowedRoles: ['erp-admin', 'voucher-admin', 'telesales'] },
  { id: 'voucher-list', label: 'Danh Sách Voucher', allowedRoles: ['erp-admin', 'voucher-admin', 'telesales'] },
  { id: 'voucher-analytics', label: 'Báo Cáo Phân Tích', allowedRoles: ['erp-admin', 'voucher-admin'] },
  { id: 'voucher-leaderboard', label: 'Bảng Xếp Hạng', allowedRoles: ['erp-admin', 'voucher-admin', 'telesales'] },
  { id: 'voucher-settings', label: 'Cài Đặt', allowedRoles: ['erp-admin', 'voucher-admin'] },
] as const;

export const DEFAULT_PERMISSIONS = {
  'erp-admin': {
    modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'marketing', 'voucher', 'operations', 'affiliate', 'system-settings', 'user-management'] as ERPModule[],
    features: ['full_access'],
    voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'] as VoucherFeature[],
    canManageUsers: true,
    canViewAllVouchers: true
  },
  'voucher-admin': {
    modules: ['dashboard', 'voucher'] as ERPModule[],
    features: ['view_voucher', 'create_voucher', 'approve_voucher'],
    voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'] as VoucherFeature[],
    canManageUsers: false,
    canViewAllVouchers: true
  },
  'telesales': {
    modules: ['dashboard', 'voucher'] as ERPModule[],
    features: ['view_voucher', 'create_voucher'],
    voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-leaderboard'] as VoucherFeature[],
    canManageUsers: false,
    canViewAllVouchers: false
  },
  'custom': {
    modules: ['dashboard', 'marketing', 'affiliate'] as ERPModule[],
    features: [],
    voucherFeatures: [] as VoucherFeature[],
    canManageUsers: false,
    canViewAllVouchers: false
  }
};
