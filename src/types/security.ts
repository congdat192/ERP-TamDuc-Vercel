
export interface SessionInfo {
  id: string;
  userId: string;
  deviceName: string;
  browser: string;
  operatingSystem: string;
  ipAddress: string;
  location: string;
  createdAt: Date;
  lastActivity: Date;
  isCurrentSession: boolean;
}

export interface SecurityAuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'multiple_failed_attempts' | 'new_device' | 'unusual_activity';
  message: string;
  timestamp: Date;
  isRead: boolean;
  severity: 'info' | 'warning' | 'critical';
}

export interface TwoFactorSetup {
  isEnabled: boolean;
  backupCodes: string[];
  qrCodeUrl?: string;
  secret?: string;
}
