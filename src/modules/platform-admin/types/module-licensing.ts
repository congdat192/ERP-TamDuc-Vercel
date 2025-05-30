
export type ModuleStatus = 'active' | 'disabled' | 'expired' | 'suspended' | 'trial' | 'pending_payment';

export type ModulePlan = 'free' | 'basic' | 'professional' | 'enterprise' | 'custom' | 'trial';

export interface ModuleLicense {
  moduleId: string;
  moduleName: string;
  description: string;
  status: ModuleStatus;
  plan: ModulePlan;
  activationDate?: Date;
  expirationDate?: Date;
  trialEndsAt?: Date;
  usageQuota?: {
    limit: number;
    used: number;
    type: 'users' | 'storage' | 'transactions' | 'api_calls';
  };
  monthlyPrice: number;
  currency: string;
  notes?: string;
}

export interface TenantModuleLicensing {
  tenantId: string;
  tenantName: string;
  modules: ModuleLicense[];
  totalMonthlyRevenue: number;
  lastModified: Date;
  modifiedBy: string;
}

export interface ModuleLicenseAction {
  id: string;
  tenantId: string;
  moduleId: string;
  action: 'enabled' | 'disabled' | 'upgraded' | 'downgraded' | 'extended' | 'suspended' | 'trial_started';
  previousStatus: ModuleStatus;
  newStatus: ModuleStatus;
  previousPlan?: ModulePlan;
  newPlan?: ModulePlan;
  performedBy: string;
  timestamp: Date;
  notes?: string;
}

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  modules: {
    moduleId: string;
    plan: ModulePlan;
    defaultExpiration: number; // months
  }[];
  targetPlan: 'startup' | 'business' | 'enterprise';
}
