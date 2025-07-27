
import { ModulePermission } from '@/types/auth';

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
