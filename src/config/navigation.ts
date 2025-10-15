import { LucideIcon, LayoutDashboard, Users, TrendingUp, Package, Target, Ticket, UserCheck, Settings } from 'lucide-react';
import { ERPModule, VoucherFeature } from '@/types/auth';

export interface SubNavItem {
  id: string;
  label: string;
  path: string;
  requiredPermission?: VoucherFeature | string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  subItems?: SubNavItem[];
  requiredPermission?: ERPModule;
}

export const navigationConfig: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/ERP/Dashboard',
    requiredPermission: 'dashboard'
  },
  {
    id: 'customers',
    label: 'Khách Hàng',
    icon: Users,
    path: '/ERP/Customers',
    requiredPermission: 'customers'
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: TrendingUp,
    path: '/ERP/Invoices',
    requiredPermission: 'sales'
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    path: '/ERP/Products',
    requiredPermission: 'inventory'
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Target,
    path: '/ERP/Marketing',
    requiredPermission: 'marketing'
  },
  {
    id: 'voucher',
    label: 'Voucher',
    icon: Ticket,
    path: '/ERP/Voucher',
    requiredPermission: 'voucher',
    subItems: [
      { id: 'voucher-dashboard', label: 'Tổng Quan', path: '/ERP/Voucher/Dashboard', requiredPermission: 'voucher-dashboard' },
      { id: 'campaign', label: 'Quản Lý Chiến Dịch', path: '/ERP/Voucher/Campaign', requiredPermission: 'campaign-management' },
      { id: 'issue', label: 'Phát Hành Voucher', path: '/ERP/Voucher/Issue', requiredPermission: 'issue-voucher' },
      { id: 'list', label: 'Danh Sách Voucher', path: '/ERP/Voucher/List', requiredPermission: 'voucher-list' },
      { id: 'report', label: 'Báo Cáo Phân Tích', path: '/ERP/Voucher/Report', requiredPermission: 'voucher-analytics' },
      { id: 'ranking', label: 'Bảng Xếp Hạng', path: '/ERP/Voucher/Ranking', requiredPermission: 'voucher-leaderboard' },
      { id: 'setting', label: 'Cài Đặt', path: '/ERP/Voucher/Setting', requiredPermission: 'voucher-settings' }
    ]
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: UserCheck,
    path: '/ERP/UserManagement',
    requiredPermission: 'user-management',
    subItems: [
      { id: 'um-dashboard', label: 'Tổng Quan', path: '/ERP/UserManagement' },
      { id: 'members', label: 'Thành Viên', path: '/ERP/UserManagement/Members' },
      { id: 'departments', label: 'Phòng Ban', path: '/ERP/UserManagement/Departments' },
      { id: 'roles', label: 'Vai Trò', path: '/ERP/UserManagement/Roles' },
      { id: 'groups', label: 'Nhóm', path: '/ERP/UserManagement/Groups' },
      { id: 'invitations', label: 'Lời Mời', path: '/ERP/UserManagement/Invitations' }
    ]
  },
  {
    id: 'affiliate',
    label: 'Affiliate',
    icon: Users,
    path: '/ERP/Affiliate',
    requiredPermission: 'affiliate',
    subItems: [
      { id: 'affiliate-dashboard', label: 'Tổng Quan', path: '/ERP/Affiliate' },
      { id: 'f0-approval', label: 'Duyệt F0', path: '/ERP/Affiliate/f0-approval' },
      { id: 'referral-management', label: 'Quản Lý Giới Thiệu', path: '/ERP/Affiliate/referral-management' },
      { id: 'voucher-management', label: 'Quản Lý Voucher', path: '/ERP/Affiliate/voucher-management' },
      { id: 'withdrawal-management', label: 'Quản Lý Rút Tiền', path: '/ERP/Affiliate/withdrawal-management' },
      { id: 'activity-log', label: 'Nhật Ký Hoạt Động', path: '/ERP/Affiliate/activity-log' },
      { id: 'reports', label: 'Báo Cáo/Xuất File', path: '/ERP/Affiliate/reports' },
      { id: 'f0-dashboard', label: 'Portal F0 - Dashboard', path: '/ERP/Affiliate/f0-dashboard' },
      { id: 'f0-link', label: 'Portal F0 - Tạo Link', path: '/ERP/Affiliate/f0-link-generation' },
      { id: 'f0-referral', label: 'Portal F0 - Giới Thiệu', path: '/ERP/Affiliate/f0-referral' },
      { id: 'f0-history', label: 'Portal F0 - Lịch Sử', path: '/ERP/Affiliate/f0-referral-history' },
      { id: 'f0-withdrawal', label: 'Portal F0 - Rút Tiền', path: '/ERP/Affiliate/f0-withdrawal' },
      { id: 'f0-account', label: 'Portal F0 - Tài Khoản', path: '/ERP/Affiliate/f0-account-info' },
      { id: 'f0-notifications', label: 'Portal F0 - Thông Báo', path: '/ERP/Affiliate/f0-notifications' }
    ]
  },
  {
    id: 'settings',
    label: 'Cài Đặt',
    icon: Settings,
    path: '/ERP/Setting',
    requiredPermission: 'system-settings',
    subItems: [
      { id: 'general', label: 'Thông Tin Chung', path: '/ERP/Setting/General' },
      { id: 'api', label: 'API Keys & Webhooks', path: '/ERP/Setting/API' },
      { id: 'integrations', label: 'Tích Hợp Bên Thứ 3', path: '/ERP/Setting/Integrations' },
      { id: 'security', label: 'Bảo Mật', path: '/ERP/Setting/Security' },
      { id: 'notifications', label: 'Thông Báo', path: '/ERP/Setting/Notifications' },
      { id: 'appearance', label: 'Giao Diện & Thương Hiệu', path: '/ERP/Setting/Appearance' }
    ]
  }
];
