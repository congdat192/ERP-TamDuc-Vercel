
export interface SessionInfo {
  id: string;
  userId: string;
  deviceName: string;
  browser: string;
  operatingSystem: string;
  ipAddress: string;
  location: string;
  isCurrentSession: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface LoginAttempt {
  id: string;
  userId?: string;
  username: string;
  ipAddress: string;
  location: string;
  deviceInfo: string;
  browser: string;
  success: boolean;
  timestamp: Date;
  failureReason?: string;
}

export type SecurityAlertType = 'suspicious_login' | 'multiple_failed_attempts' | 'new_device' | 'unusual_activity';
export type SecurityAlertSeverity = 'critical' | 'warning' | 'info';

export interface SecurityAlert {
  id: string;
  type: SecurityAlertType;
  severity: SecurityAlertSeverity;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
  userId: string;
}

export interface TwoFactorAuth {
  enabled: boolean;
  qrCodeUrl: string;
  backupCodes: string[];
  setupComplete: boolean;
  lastVerified?: Date;
}
