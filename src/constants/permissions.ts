
import { LayoutDashboard, Users } from 'lucide-react';

export type UserRole = 'platform-admin' | 'erp-admin' | 'voucher-admin' | 'telesales' | 'custom';

export interface UserPermissions {
  modules: ERPModule[];
  actions: string[];
  features: string[];
}

export interface ModulePermission {
  module: ERPModule;
  label: string;
  icon: keyof typeof import("lucide-react");
  description: string;
  allowedRoles: UserRole[];
}

export interface VoucherFeature {
  id: string;
  label: string;
  allowedRoles: UserRole[];
}

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

export const MODULE_PERMISSIONS: ModulePermission[] = [
  {
    module: 'dashboard',
    label: 'Tổng Quan',
    icon: 'LayoutDashboard',
    description: 'Dashboard và báo cáo tổng quan',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin', 'telesales']
  },
  {
    module: 'customers',
    label: 'Khách Hàng',
    icon: 'Users',
    description: 'Quản lý thông tin khách hàng',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin', 'telesales']
  },
  {
    module: 'sales',
    label: 'Bán Hàng',
    icon: 'LayoutDashboard',
    description: 'Quản lý quy trình bán hàng',
    allowedRoles: ['platform-admin', 'erp-admin', 'telesales']
  },
  {
    module: 'inventory',
    label: 'Kho Hàng',
    icon: 'LayoutDashboard',
    description: 'Quản lý kho và sản phẩm',
    allowedRoles: ['platform-admin', 'erp-admin']
  },
  {
    module: 'accounting',
    label: 'Kế Toán',
    icon: 'LayoutDashboard',
    description: 'Quản lý tài chính và kế toán',
    allowedRoles: ['platform-admin', 'erp-admin']
  },
  {
    module: 'hr',
    label: 'Nhân Sự',
    icon: 'LayoutDashboard',
    description: 'Quản lý thông tin nhân viên',
    allowedRoles: ['platform-admin', 'erp-admin']
  },
  {
    module: 'voucher',
    label: 'Voucher',
    icon: 'LayoutDashboard',
    description: 'Quản lý và phát hành voucher',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin']
  },
  {
    module: 'system-settings',
    label: 'Cài Đặt Hệ Thống',
    icon: 'LayoutDashboard',
    description: 'Cấu hình hệ thống và bảo mật',
    allowedRoles: ['platform-admin', 'erp-admin']
  },
  {
    module: 'user-management',
    label: 'Quản Lý Người Dùng',
    icon: 'LayoutDashboard',
    description: 'Quản lý tài khoản và quyền truy cập',
    allowedRoles: ['platform-admin', 'erp-admin']
  },
];

export const VOUCHER_FEATURES: VoucherFeature[] = [
  {
    id: 'voucher-dashboard',
    label: 'Dashboard Voucher',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin']
  },
  {
    id: 'campaign-management',
    label: 'Quản Lý Chiến Dịch',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin']
  },
  {
    id: 'issue-voucher',
    label: 'Phát Hành Voucher',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin']
  },
  {
    id: 'voucher-list',
    label: 'Danh Sách Voucher',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin']
  },
  {
    id: 'voucher-analytics',
    label: 'Phân Tích Voucher',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin']
  },
  {
    id: 'voucher-leaderboard',
    label: 'Bảng Xếp Hạng',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin']
  },
  {
    id: 'voucher-settings',
    label: 'Cài Đặt Voucher',
    allowedRoles: ['platform-admin', 'erp-admin', 'voucher-admin']
  }
];

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  'platform-admin': {
    modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'system-settings', 'user-management'],
    actions: ['create', 'read', 'update', 'delete', 'export', 'import'],
    features: ['bulk-operations', 'advanced-search', 'api-access', 'audit-log']
  },
  'erp-admin': {
    modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'system-settings', 'user-management'],
    actions: ['create', 'read', 'update', 'delete', 'export', 'import'],
    features: ['bulk-operations', 'advanced-search', 'audit-log']
  },
  'voucher-admin': {
    modules: ['dashboard', 'customers', 'voucher', 'user-management'],
    actions: ['create', 'read', 'update', 'delete', 'export'],
    features: ['bulk-operations', 'advanced-search']
  },
  'telesales': {
    modules: ['dashboard', 'customers', 'sales', 'voucher'],
    actions: ['create', 'read', 'update', 'export'],
    features: ['advanced-search']
  },
  'custom': {
    modules: ['dashboard', 'customers'],
    actions: ['read'],
    features: []
  }
};
