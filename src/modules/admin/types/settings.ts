
export type SettingsCategory = 
  | 'general-info'
  | 'email'
  | 'security'
  | 'api-integration'
  | 'backup-restore'
  | 'features-plans';

export interface SettingsMenuItem {
  id: SettingsCategory;
  label: string;
  icon: string;
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

export interface ApiIntegration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  lastSync?: string;
  features: string[];
}
