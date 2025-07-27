import { ERPModule } from "@/types/auth";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Package,
  Ticket,
  Megaphone,
  Settings,
} from 'lucide-react';

export const MODULE_PERMISSIONS = [
  {
    module: 'dashboard' as ERPModule,
    label: 'Tổng Quan',
    icon: 'LayoutDashboard',
    permissions: ['dashboard.view']
  },
  {
    module: 'customers' as ERPModule,
    label: 'Khách Hàng',
    icon: 'Users',
    permissions: ['customers.view']
  },
  {
    module: 'sales' as ERPModule,
    label: 'Hóa Đơn',
    icon: 'Receipt',
    permissions: ['sales.view']
  },
  {
    module: 'inventory' as ERPModule,
    label: 'Kho Hàng',
    icon: 'Package',
    permissions: ['inventory.view']
  },
  {
    module: 'voucher' as ERPModule,
    label: 'Voucher',
    icon: 'Ticket',
    permissions: ['voucher.view']
  },
  {
    module: 'affiliate' as ERPModule,
    label: 'Affiliate',
    icon: 'Users',
    permissions: ['affiliate.view']
  },
  {
    module: 'marketing' as ERPModule,
    label: 'Marketing',
    icon: 'Megaphone',
    permissions: ['marketing.view']
  },
  {
    module: 'user-management' as ERPModule,
    label: 'Quản Lý Người Dùng',
    icon: 'Settings',
    permissions: ['user-management.view']
  },
  {
    module: 'system-settings' as ERPModule,
    label: 'Cài Đặt Hệ Thống',
    icon: 'Settings',
    permissions: ['system-settings.view']
  }
];
