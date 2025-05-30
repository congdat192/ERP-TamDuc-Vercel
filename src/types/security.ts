
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
  expiresAt: Date;
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

export interface SecurityAlert {
  id: string;
  type: 'unusual_login' | 'failed_attempts' | 'new_device' | 'password_change' | 'account_locked';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
  userId: string;
}

export interface TwoFactorAuth {
  enabled: boolean;
  qrCodeUrl?: string;
  backupCodes: string[];
  lastVerified?: Date;
  setupComplete: boolean;
}

export interface SessionTimeoutState {
  isWarning: boolean;
  timeRemaining: number;
  isExpired: boolean;
}
