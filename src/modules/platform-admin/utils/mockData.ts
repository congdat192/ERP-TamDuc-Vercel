
// Mock data for Platform Admin module
export interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  newTenantsThisMonth: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  systemUptime: number;
  criticalAlerts: number;
}

export interface ActivityItem {
  id: string;
  type: 'tenant_created' | 'payment_received' | 'support_ticket' | 'system_alert' | 'user_login';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tenantName?: string;
}

export interface TenantInfo {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  plan: 'basic' | 'professional' | 'enterprise';
  userCount: number;
  createdAt: Date;
  lastLoginAt: Date;
  subscription: {
    startDate: Date;
    endDate: Date;
    status: 'active' | 'expired' | 'cancelled';
    amount: number;
  };
}

export function mockPlatformStats(): PlatformStats {
  return {
    totalTenants: 156,
    activeTenants: 142,
    newTenantsThisMonth: 12,
    monthlyRevenue: 485600000, // 485.6M VND
    revenueGrowth: 8.5,
    systemUptime: 99.9,
    criticalAlerts: 0,
  };
}

export function mockRecentActivities(): ActivityItem[] {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'tenant_created',
      title: 'Khách hàng mới đăng ký',
      description: 'Công ty ABC Tech đã đăng ký gói Enterprise',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000),
      severity: 'medium',
      tenantName: 'ABC Tech Co., Ltd'
    },
    {
      id: '2',
      type: 'payment_received',
      title: 'Thanh toán thành công',
      description: 'XYZ Corp đã thanh toán hóa đơn tháng 12',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000),
      severity: 'low',
      tenantName: 'XYZ Corp'
    },
    {
      id: '3',
      type: 'support_ticket',
      title: 'Ticket hỗ trợ mới',
      description: 'Yêu cầu hỗ trợ tích hợp API từ DEF Solutions',
      timestamp: new Date(now.getTime() - 60 * 60 * 1000),
      severity: 'medium',
      tenantName: 'DEF Solutions'
    },
    {
      id: '4',
      type: 'system_alert',
      title: 'Cảnh báo hệ thống',
      description: 'Tài nguyên CPU vượt ngưỡng 80% trong 5 phút',
      timestamp: new Date(now.getTime() - 90 * 60 * 1000),
      severity: 'high'
    },
    {
      id: '5',
      type: 'user_login',
      title: 'Đăng nhập admin',
      description: 'Super Admin đăng nhập từ IP 192.168.1.100',
      timestamp: new Date(now.getTime() - 120 * 60 * 1000),
      severity: 'low'
    }
  ];
}

export function mockTenantList(): TenantInfo[] {
  const now = new Date();
  return [
    {
      id: 'tenant-1',
      companyName: 'ABC Technology Co., Ltd',
      contactEmail: 'admin@abctech.vn',
      contactPhone: '+84 24 3888 9999',
      status: 'active',
      plan: 'enterprise',
      userCount: 45,
      createdAt: new Date(2024, 0, 15),
      lastLoginAt: new Date(now.getTime() - 30 * 60 * 1000),
      subscription: {
        startDate: new Date(2024, 0, 15),
        endDate: new Date(2024, 11, 31),
        status: 'active',
        amount: 15000000
      }
    },
    {
      id: 'tenant-2',
      companyName: 'XYZ Corporation',
      contactEmail: 'contact@xyzcorp.com.vn',
      contactPhone: '+84 28 3777 8888',
      status: 'active',
      plan: 'professional',
      userCount: 23,
      createdAt: new Date(2024, 1, 10),
      lastLoginAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      subscription: {
        startDate: new Date(2024, 1, 10),
        endDate: new Date(2024, 12, 31),
        status: 'active',
        amount: 8000000
      }
    },
    {
      id: 'tenant-3',
      companyName: 'DEF Solutions Ltd',
      contactEmail: 'info@defsolutions.vn',
      contactPhone: '+84 24 3666 7777',
      status: 'trial',
      plan: 'basic',
      userCount: 8,
      createdAt: new Date(2024, 10, 1),
      lastLoginAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      subscription: {
        startDate: new Date(2024, 10, 1),
        endDate: new Date(2024, 10, 30),
        status: 'active',
        amount: 0
      }
    }
  ];
}

export function mockSupportTickets() {
  return [
    {
      id: 'ticket-1',
      title: 'Không thể truy cập module báo cáo',
      description: 'Nhân viên không thể xem báo cáo doanh thu tháng này',
      tenantName: 'ABC Technology Co., Ltd',
      priority: 'high',
      status: 'open',
      createdAt: new Date(2024, 10, 25),
      assignee: 'Nguyễn Văn A'
    },
    {
      id: 'ticket-2', 
      title: 'Yêu cầu tăng số lượng user',
      description: 'Cần tăng từ 20 lên 30 user cho gói Professional',
      tenantName: 'XYZ Corporation',
      priority: 'medium',
      status: 'in_progress',
      createdAt: new Date(2024, 10, 24),
      assignee: 'Trần Thị B'
    }
  ];
}

export function mockAuditLogs() {
  return [
    {
      id: 'log-1',
      action: 'USER_LOGIN',
      user: 'admin@abctech.vn',
      tenant: 'ABC Technology Co., Ltd',
      details: 'Đăng nhập thành công từ IP 192.168.1.50',
      timestamp: new Date(2024, 10, 25, 14, 30),
      result: 'success'
    },
    {
      id: 'log-2',
      action: 'TENANT_CREATED',
      user: 'platform-admin',
      tenant: 'DEF Solutions Ltd',
      details: 'Tạo mới khách hàng với gói Basic (trial)',
      timestamp: new Date(2024, 10, 1, 9, 15),
      result: 'success'
    }
  ];
}
