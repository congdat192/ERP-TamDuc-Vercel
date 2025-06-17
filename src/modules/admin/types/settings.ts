export type SettingsCategory = 
  | 'general-info'
  | 'email'
  | 'security'
  | 'api-integration'
  | 'api-keys'
  | 'webhooks'
  | 'third-party'
  | 'backup-restore'
  | 'features-plans';

export interface SettingsMenuItem {
  id: SettingsCategory;
  label: string;
  icon?: string;
  type?: 'single' | 'expandable';
  subItems?: Array<{
    id: string;
    label: string;
  }>;
}

export interface CompanySettings {
  name: string;
  slogan: string;
  logo?: string;
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  notifications: {
    enabled: boolean;
    voucherExpiry: boolean;
    newCustomer: boolean;
    systemAlerts: boolean;
  };
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  autoLogout: boolean;
}

export interface ThirdPartyIntegration {
  id: string;
  name: string;
  description: string;
  category: 'pos' | 'ecommerce' | 'communication' | 'accounting' | 'payment';
  status: 'connected' | 'disconnected' | 'error' | 'coming-soon';
  logo?: string;
  color: string;
  lastSync?: string;
  features: string[];
  setupInstructions?: string;
  apiKey?: string;
  isSupported: boolean;
}

export interface ApiIntegration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  lastSync?: string;
  features: string[];
}

export interface SyncLimitOption {
  value: number | 'all';
  label: string;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface ApiGroupSyncConfig {
  enabled: boolean;
  syncLimit: number | 'all';
  dateRange: DateRange;
  useGlobalConfig: boolean;
}

export interface InitialSyncConfig {
  globalSyncLimit: number | 'all';
  globalDateRange: DateRange;
  apiGroupConfigs: Record<string, ApiGroupSyncConfig>;
}

export interface KiotVietIntegration {
  id: string;
  retailerName: string;
  clientId: string;
  isConnected: boolean;
  lastSync?: string;
  connectedApiGroups: string[];
  connectionStatus: 'connected' | 'disconnected' | 'testing' | 'error';
  errorMessage?: string;
  initialSyncConfig?: InitialSyncConfig;
}

export interface KiotVietApiGroup {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  accessible?: boolean;
}

export interface VihatIntegration {
  id: string;
  apiEndpoint: string;
  apiKey: string;
  secretKey: string;
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'testing' | 'error';
  lastTestDate?: string;
  errorMessage?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  accessibleGroups?: string[];
  errorMessage?: string;
}
