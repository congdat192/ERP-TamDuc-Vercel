import { supabase } from '@/integrations/supabase/client';

export interface ModuleStats {
  module: string;
  title: string;
  value: string | number;
  change?: string;
  description: string;
  icon: string; // Lucide icon name
  available: boolean;
}

export class UniversalDashboardService {
  // HR Module Stats
  static async getHRStats(): Promise<ModuleStats | null> {
    try {
      const { count: totalEmployees } = await supabase
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .is('deleted_at', null);

      const { count: activeEmployees } = await supabase
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .is('deleted_at', null);

      return {
        module: 'hr',
        title: 'Nhân Sự',
        value: `${activeEmployees || 0}/${totalEmployees || 0}`,
        description: 'Nhân viên đang làm việc',
        icon: 'Users',
        available: true
      };
    } catch (error) {
      console.error('[UniversalDashboard] HR stats error:', error);
      return null;
    }
  }

  // Marketing Module Stats
  static async getMarketingStats(): Promise<ModuleStats | null> {
    try {
      // TODO: Replace with actual customers/campaigns tables when available
      return {
        module: 'marketing',
        title: 'Marketing',
        value: 'Đang phát triển',
        description: 'Khách hàng & chiến dịch',
        icon: 'Megaphone',
        available: true
      };
    } catch (error) {
      console.error('[UniversalDashboard] Marketing stats error:', error);
      return null;
    }
  }

  // Voucher Module Stats
  static async getVoucherStats(): Promise<ModuleStats | null> {
    try {
      // TODO: Replace with actual vouchers table when available
      return {
        module: 'voucher',
        title: 'Voucher',
        value: 'Đang phát triển',
        description: 'Voucher đang hoạt động',
        icon: 'Ticket',
        available: true
      };
    } catch (error) {
      console.error('[UniversalDashboard] Voucher stats error:', error);
      return null;
    }
  }

  // Sales Module Stats
  static async getSalesStats(): Promise<ModuleStats | null> {
    try {
      // TODO: Replace with actual sales/invoices table when available
      return {
        module: 'sales',
        title: 'Bán Hàng',
        value: 'Đang phát triển',
        description: 'Doanh thu & đơn hàng',
        icon: 'TrendingUp',
        available: true
      };
    } catch (error) {
      console.error('[UniversalDashboard] Sales stats error:', error);
      return null;
    }
  }

  // Inventory Module Stats
  static async getInventoryStats(): Promise<ModuleStats | null> {
    try {
      // TODO: Replace with actual inventory table when available
      return {
        module: 'inventory',
        title: 'Kho Hàng',
        value: 'Đang phát triển',
        description: 'Sản phẩm & tồn kho',
        icon: 'Package',
        available: true
      };
    } catch (error) {
      console.error('[UniversalDashboard] Inventory stats error:', error);
      return null;
    }
  }

  // User Management Stats
  static async getUserManagementStats(): Promise<ModuleStats | null> {
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { count: totalRoles } = await supabase
        .from('roles')
        .select('id', { count: 'exact', head: true });

      return {
        module: 'user-management',
        title: 'Người Dùng',
        value: totalUsers || 0,
        change: `${totalRoles || 0} vai trò`,
        description: 'Tài khoản & phân quyền',
        icon: 'UserCheck',
        available: true
      };
    } catch (error) {
      console.error('[UniversalDashboard] User Management stats error:', error);
      return null;
    }
  }

  // Accounting Module Stats
  static async getAccountingStats(): Promise<ModuleStats | null> {
    try {
      // TODO: Replace with actual accounting tables when available
      return {
        module: 'accounting',
        title: 'Kế Toán',
        value: 'Đang phát triển',
        description: 'Sổ sách & báo cáo tài chính',
        icon: 'Calculator',
        available: true
      };
    } catch (error) {
      console.error('[UniversalDashboard] Accounting stats error:', error);
      return null;
    }
  }

  // Fetch all stats for user's accessible modules
  static async getAllStats(userModules: string[]): Promise<ModuleStats[]> {
    console.log('🔍 [UniversalDashboard] Fetching stats for modules:', userModules);
    
    const statsPromises: Promise<ModuleStats | null>[] = [];

    if (userModules.includes('hr')) {
      statsPromises.push(this.getHRStats());
    }
    if (userModules.includes('marketing')) {
      statsPromises.push(this.getMarketingStats());
    }
    if (userModules.includes('voucher')) {
      statsPromises.push(this.getVoucherStats());
    }
    if (userModules.includes('sales')) {
      statsPromises.push(this.getSalesStats());
    }
    if (userModules.includes('inventory')) {
      statsPromises.push(this.getInventoryStats());
    }
    if (userModules.includes('user-management')) {
      statsPromises.push(this.getUserManagementStats());
    }
    if (userModules.includes('accounting')) {
      statsPromises.push(this.getAccountingStats());
    }

    const results = await Promise.all(statsPromises);
    const validStats = results.filter((stat): stat is ModuleStats => stat !== null);
    
    console.log('✅ [UniversalDashboard] Stats loaded:', validStats);
    return validStats;
  }
}
