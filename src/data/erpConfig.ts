
import { User, ModulePermission, ERPModule } from '@/types/erp';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Package, 
  Calculator, 
  UserCheck, 
  Ticket, 
  Settings, 
  Shield 
} from 'lucide-react';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'erp-admin',
    fullName: 'Nguyễn Văn Quản Trị',
    role: 'erp-admin',
    email: 'admin@company.com',
    permissions: {
      modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'system-settings', 'user-management'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      canManageUsers: true,
      canViewAllVouchers: true
    }
  },
  {
    id: '2',
    username: 'voucher-admin',
    fullName: 'Trần Thị Quản Lý Voucher',
    role: 'voucher-admin',
    email: 'voucher.admin@company.com',
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      canManageUsers: false,
      canViewAllVouchers: true
    }
  },
  {
    id: '3',
    username: 'telesales',
    fullName: 'Lê Văn Nhân Viên',
    role: 'telesales',
    email: 'telesales@company.com',
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list'],
      canManageUsers: false,
      canViewAllVouchers: false
    }
  },
  {
    id: '4',
    username: 'custom',
    fullName: 'Phạm Thị Tùy Chỉnh',
    role: 'custom',
    email: 'custom@company.com',
    permissions: {
      modules: ['dashboard', 'customers', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'voucher-list'],
      canManageUsers: false,
      canViewAllVouchers: false
    }
  }
];

export const modulePermissions: ModulePermission[] = [
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
    allowedRoles: ['erp-admin']
  },
  {
    module: 'inventory',
    label: 'Kho Hàng',
    icon: 'Package',
    allowedRoles: ['erp-admin']
  },
  {
    module: 'accounting',
    label: 'Kế Toán',
    icon: 'Calculator',
    allowedRoles: ['erp-admin']
  },
  {
    module: 'hr',
    label: 'Nhân Sự',
    icon: 'UserCheck',
    allowedRoles: ['erp-admin']
  },
  {
    module: 'voucher',
    label: 'Voucher/Khuyến Mãi',
    icon: 'Ticket',
    allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom'],
    subFeatures: [
      {
        feature: 'voucher-dashboard',
        label: 'Tổng Quan Voucher',
        allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
      },
      {
        feature: 'issue-voucher',
        label: 'Phát Hành Voucher',
        allowedRoles: ['erp-admin', 'voucher-admin', 'telesales']
      },
      {
        feature: 'voucher-list',
        label: 'Danh Sách Voucher',
        allowedRoles: ['erp-admin', 'voucher-admin', 'telesales', 'custom']
      },
      {
        feature: 'voucher-analytics',
        label: 'Báo Cáo Voucher',
        allowedRoles: ['erp-admin', 'voucher-admin']
      },
      {
        feature: 'voucher-leaderboard',
        label: 'Bảng Xếp Hạng',
        allowedRoles: ['erp-admin', 'voucher-admin']
      },
      {
        feature: 'voucher-settings',
        label: 'Cài Đặt Voucher',
        allowedRoles: ['erp-admin', 'voucher-admin']
      }
    ]
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

export const getIconComponent = (iconName: string) => {
  const icons = {
    LayoutDashboard,
    Users,
    TrendingUp,
    Package,
    Calculator,
    UserCheck,
    Ticket,
    Settings,
    Shield
  };
  return icons[iconName as keyof typeof icons] || LayoutDashboard;
};
