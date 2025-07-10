
import { ModuleInfo } from '../types/role-management';

export class ModuleService {
  // Danh sách modules mặc định cho demo - sẽ được thay thế bằng API
  static getDefaultModules(): ModuleInfo[] {
    return [
      {
        id: 'dashboard',
        name: 'dashboard',
        label: 'Tổng Quan',
        icon: 'LayoutDashboard',
        features: ['view_dashboard', 'export_reports'],
        status: 'active'
      },
      {
        id: 'customers',
        name: 'customers', 
        label: 'Quản Lý Khách Hàng',
        icon: 'Users',
        features: ['view_customers', 'add_customers', 'edit_customers', 'delete_customers', 'export_customers'],
        status: 'active'
      },
      {
        id: 'sales',
        name: 'sales',
        label: 'Quản Lý Bán Hàng', 
        icon: 'ShoppingCart',
        features: ['view_sales', 'create_orders', 'edit_orders', 'cancel_orders', 'view_reports'],
        status: 'active'
      },
      {
        id: 'inventory',
        name: 'inventory',
        label: 'Quản Lý Kho',
        icon: 'Package',
        features: ['view_inventory', 'add_products', 'edit_products', 'delete_products', 'manage_stock'],
        status: 'active'
      },
      {
        id: 'voucher',
        name: 'voucher',
        label: 'Quản Lý Voucher',
        icon: 'Ticket',
        features: ['view_vouchers', 'create_vouchers', 'edit_vouchers', 'delete_vouchers', 'manage_campaigns'],
        status: 'active'
      },
      {
        id: 'marketing',
        name: 'marketing',
        label: 'Marketing',
        icon: 'Megaphone',
        features: ['view_campaigns', 'create_campaigns', 'edit_campaigns', 'delete_campaigns', 'send_messages'],
        status: 'active'
      },
      {
        id: 'user-management',
        name: 'user-management',
        label: 'Quản Lý Người Dùng',
        icon: 'UserCog',
        features: ['view_users', 'add_users', 'edit_users', 'delete_users', 'manage_permissions'],
        status: 'active'
      },
      {
        id: 'system-settings',
        name: 'system-settings',
        label: 'Cài Đặt Hệ Thống',
        icon: 'Settings',
        features: ['view_settings', 'edit_settings', 'manage_integrations', 'system_backup'],
        status: 'active'
      }
    ];
  }

  static async getActiveModules(): Promise<ModuleInfo[]> {
    // TODO: Replace with actual API call
    // return await fetch('/api/modules/active').then(res => res.json());
    
    // Tạm thời return default modules
    return this.getDefaultModules().filter(module => module.status === 'active');
  }
}
