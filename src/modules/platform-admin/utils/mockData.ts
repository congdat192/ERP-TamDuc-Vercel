
// Essential mock data for Platform Admin module
export interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  newTenantsThisMonth: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  systemUptime: number;
  criticalAlerts: number;
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
    monthlyRevenue: 485600000,
    revenueGrowth: 8.5,
    systemUptime: 99.9,
    criticalAlerts: 0,
  };
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
