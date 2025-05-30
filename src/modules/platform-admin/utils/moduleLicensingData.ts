
import { ModuleLicense, TenantModuleLicensing, ModuleLicenseAction, ModuleTemplate, ModuleStatus, ModulePlan } from '../types/module-licensing';

export const availableModules = [
  {
    id: 'sales',
    name: 'Bán Hàng',
    description: 'Quản lý quy trình bán hàng, báo giá, đơn hàng',
    category: 'core',
    icon: 'TrendingUp'
  },
  {
    id: 'inventory',
    name: 'Kho Hàng',
    description: 'Quản lý tồn kho, nhập xuất, theo dõi hàng hóa',
    category: 'core',
    icon: 'Package'
  },
  {
    id: 'accounting',
    name: 'Kế Toán',
    description: 'Sổ sách kế toán, báo cáo tài chính',
    category: 'core',
    icon: 'Calculator'
  },
  {
    id: 'hr',
    name: 'Nhân Sự',
    description: 'Quản lý nhân viên, chấm công, lương',
    category: 'core',
    icon: 'UserCheck'
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Quản lý khách hàng, cơ hội bán hàng',
    category: 'premium',
    icon: 'Users'
  },
  {
    id: 'analytics',
    name: 'Phân Tích',
    description: 'Báo cáo chi tiết, dashboard tùy chỉnh',
    category: 'premium',
    icon: 'BarChart3'
  },
  {
    id: 'project',
    name: 'Dự Án',
    description: 'Quản lý dự án, task, timeline',
    category: 'premium',
    icon: 'FolderKanban'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Tích hợp bán hàng online, website',
    category: 'enterprise',
    icon: 'ShoppingCart'
  }
];

export function mockTenantModuleLicensing(): TenantModuleLicensing[] {
  const now = new Date();
  
  return [
    {
      tenantId: 'tenant-1',
      tenantName: 'ABC Technology Co., Ltd',
      totalMonthlyRevenue: 15000000,
      lastModified: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      modifiedBy: 'Platform Admin',
      modules: [
        {
          moduleId: 'sales',
          moduleName: 'Bán Hàng',
          description: 'Quản lý quy trình bán hàng, báo giá, đơn hàng',
          status: 'active',
          plan: 'enterprise',
          activationDate: new Date(2024, 0, 15),
          expirationDate: new Date(2024, 11, 31),
          usageQuota: { limit: 100, used: 67, type: 'users' },
          monthlyPrice: 3000000,
          currency: 'VND'
        },
        {
          moduleId: 'inventory',
          moduleName: 'Kho Hàng',
          description: 'Quản lý tồn kho, nhập xuất, theo dõi hàng hóa',
          status: 'active',
          plan: 'enterprise',
          activationDate: new Date(2024, 0, 15),
          expirationDate: new Date(2024, 11, 31),
          usageQuota: { limit: 50000, used: 23450, type: 'transactions' },
          monthlyPrice: 2500000,
          currency: 'VND'
        },
        {
          moduleId: 'accounting',
          moduleName: 'Kế Toán',
          description: 'Sổ sách kế toán, báo cáo tài chính',
          status: 'active',
          plan: 'professional',
          activationDate: new Date(2024, 0, 15),
          expirationDate: new Date(2024, 11, 31),
          monthlyPrice: 4000000,
          currency: 'VND'
        },
        {
          moduleId: 'hr',
          moduleName: 'Nhân Sự',
          description: 'Quản lý nhân viên, chấm công, lương',
          status: 'active',
          plan: 'professional',
          activationDate: new Date(2024, 0, 15),
          expirationDate: new Date(2024, 11, 31),
          usageQuota: { limit: 100, used: 45, type: 'users' },
          monthlyPrice: 2000000,
          currency: 'VND'
        },
        {
          moduleId: 'crm',
          moduleName: 'CRM',
          description: 'Quản lý khách hàng, cơ hội bán hàng',
          status: 'active',
          plan: 'professional',
          activationDate: new Date(2024, 0, 15),
          expirationDate: new Date(2024, 11, 31),
          monthlyPrice: 1500000,
          currency: 'VND'
        },
        {
          moduleId: 'analytics',
          moduleName: 'Phân Tích',
          description: 'Báo cáo chi tiết, dashboard tùy chỉnh',
          status: 'trial',
          plan: 'trial',
          activationDate: new Date(2024, 10, 1),
          trialEndsAt: new Date(2024, 10, 30),
          monthlyPrice: 2000000,
          currency: 'VND',
          notes: 'Đang dùng thử 30 ngày'
        },
        {
          moduleId: 'project',
          moduleName: 'Dự Án',
          description: 'Quản lý dự án, task, timeline',
          status: 'disabled',
          plan: 'professional',
          monthlyPrice: 1800000,
          currency: 'VND'
        },
        {
          moduleId: 'ecommerce',
          moduleName: 'E-Commerce',
          description: 'Tích hợp bán hàng online, website',
          status: 'disabled',
          plan: 'enterprise',
          monthlyPrice: 3500000,
          currency: 'VND'
        }
      ]
    },
    {
      tenantId: 'tenant-2',
      tenantName: 'XYZ Corporation',
      totalMonthlyRevenue: 8000000,
      lastModified: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      modifiedBy: 'Platform Admin',
      modules: [
        {
          moduleId: 'sales',
          moduleName: 'Bán Hàng',
          description: 'Quản lý quy trình bán hàng, báo giá, đơn hàng',
          status: 'active',
          plan: 'professional',
          activationDate: new Date(2024, 1, 10),
          expirationDate: new Date(2024, 12, 31),
          usageQuota: { limit: 50, used: 23, type: 'users' },
          monthlyPrice: 2000000,
          currency: 'VND'
        },
        {
          moduleId: 'inventory',
          moduleName: 'Kho Hàng',
          description: 'Quản lý tồn kho, nhập xuất, theo dõi hàng hóa',
          status: 'active',
          plan: 'professional',
          activationDate: new Date(2024, 1, 10),
          expirationDate: new Date(2024, 12, 31),
          usageQuota: { limit: 10000, used: 4567, type: 'transactions' },
          monthlyPrice: 1500000,
          currency: 'VND'
        },
        {
          moduleId: 'accounting',
          moduleName: 'Kế Toán',
          description: 'Sổ sách kế toán, báo cáo tài chính',
          status: 'expired',
          plan: 'basic',
          activationDate: new Date(2024, 1, 10),
          expirationDate: new Date(2024, 10, 10),
          monthlyPrice: 1500000,
          currency: 'VND',
          notes: 'Hết hạn, cần gia hạn'
        },
        {
          moduleId: 'hr',
          moduleName: 'Nhân Sự',
          description: 'Quản lý nhân viên, chấm công, lương',
          status: 'active',
          plan: 'basic',
          activationDate: new Date(2024, 1, 10),
          expirationDate: new Date(2024, 12, 31),
          usageQuota: { limit: 25, used: 23, type: 'users' },
          monthlyPrice: 1000000,
          currency: 'VND'
        },
        {
          moduleId: 'crm',
          moduleName: 'CRM',
          description: 'Quản lý khách hàng, cơ hội bán hàng',
          status: 'pending_payment',
          plan: 'professional',
          activationDate: new Date(2024, 8, 1),
          expirationDate: new Date(2024, 11, 31),
          monthlyPrice: 1500000,
          currency: 'VND',
          notes: 'Chờ thanh toán tháng 11'
        },
        {
          moduleId: 'analytics',
          moduleName: 'Phân Tích',
          description: 'Báo cáo chi tiết, dashboard tùy chỉnh',
          status: 'disabled',
          plan: 'professional',
          monthlyPrice: 2000000,
          currency: 'VND'
        },
        {
          moduleId: 'project',
          moduleName: 'Dự Án',
          description: 'Quản lý dự án, task, timeline',
          status: 'disabled',
          plan: 'professional',
          monthlyPrice: 1800000,
          currency: 'VND'
        },
        {
          moduleId: 'ecommerce',
          moduleName: 'E-Commerce',
          description: 'Tích hợp bán hàng online, website',
          status: 'disabled',
          plan: 'enterprise',
          monthlyPrice: 3500000,
          currency: 'VND'
        }
      ]
    }
  ];
}

export function mockModuleLicenseActions(): ModuleLicenseAction[] {
  const now = new Date();
  
  return [
    {
      id: 'action-1',
      tenantId: 'tenant-1',
      moduleId: 'analytics',
      action: 'trial_started',
      previousStatus: 'disabled',
      newStatus: 'trial',
      newPlan: 'trial',
      performedBy: 'Platform Admin',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      notes: 'Khách hàng yêu cầu dùng thử module Analytics'
    },
    {
      id: 'action-2',
      tenantId: 'tenant-2',
      moduleId: 'accounting',
      action: 'disabled',
      previousStatus: 'expired',
      newStatus: 'disabled',
      performedBy: 'System Auto',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      notes: 'Tự động vô hiệu hóa do hết hạn'
    },
    {
      id: 'action-3',
      tenantId: 'tenant-1',
      moduleId: 'hr',
      action: 'upgraded',
      previousStatus: 'active',
      newStatus: 'active',
      previousPlan: 'basic',
      newPlan: 'professional',
      performedBy: 'Platform Admin',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      notes: 'Nâng cấp theo yêu cầu khách hàng'
    }
  ];
}

export function mockModuleTemplates(): ModuleTemplate[] {
  return [
    {
      id: 'startup-package',
      name: 'Gói Khởi Nghiệp',
      description: 'Bao gồm các module cơ bản cho doanh nghiệp nhỏ',
      targetPlan: 'startup',
      modules: [
        { moduleId: 'sales', plan: 'basic', defaultExpiration: 12 },
        { moduleId: 'inventory', plan: 'basic', defaultExpiration: 12 },
        { moduleId: 'accounting', plan: 'basic', defaultExpiration: 12 }
      ]
    },
    {
      id: 'business-package',
      name: 'Gói Doanh Nghiệp',
      description: 'Bao gồm tất cả module cần thiết cho doanh nghiệp vừa',
      targetPlan: 'business',
      modules: [
        { moduleId: 'sales', plan: 'professional', defaultExpiration: 12 },
        { moduleId: 'inventory', plan: 'professional', defaultExpiration: 12 },
        { moduleId: 'accounting', plan: 'professional', defaultExpiration: 12 },
        { moduleId: 'hr', plan: 'professional', defaultExpiration: 12 },
        { moduleId: 'crm', plan: 'professional', defaultExpiration: 12 }
      ]
    },
    {
      id: 'enterprise-package',
      name: 'Gói Tập Đoàn',
      description: 'Bao gồm toàn bộ module với tính năng cao cấp',
      targetPlan: 'enterprise',
      modules: [
        { moduleId: 'sales', plan: 'enterprise', defaultExpiration: 12 },
        { moduleId: 'inventory', plan: 'enterprise', defaultExpiration: 12 },
        { moduleId: 'accounting', plan: 'enterprise', defaultExpiration: 12 },
        { moduleId: 'hr', plan: 'enterprise', defaultExpiration: 12 },
        { moduleId: 'crm', plan: 'enterprise', defaultExpiration: 12 },
        { moduleId: 'analytics', plan: 'enterprise', defaultExpiration: 12 },
        { moduleId: 'project', plan: 'enterprise', defaultExpiration: 12 },
        { moduleId: 'ecommerce', plan: 'enterprise', defaultExpiration: 12 }
      ]
    }
  ];
}
