
import { useState, useCallback } from 'react';
import { SessionInfo, LoginAttempt, SecurityAlert, TwoFactorAuth } from '@/types/security';

// Mock data
const mockSessions: SessionInfo[] = [
  {
    id: '1',
    userId: '1',
    deviceName: 'MacBook Pro',
    browser: 'Chrome 120.0',
    operatingSystem: 'macOS 14.2',
    ipAddress: '192.168.1.100',
    location: 'Hồ Chí Minh, Việt Nam',
    isCurrentSession: true,
    createdAt: new Date('2024-05-29T08:00:00'),
    lastActivity: new Date('2024-05-29T16:30:00')
  },
  {
    id: '2',
    userId: '1',
    deviceName: 'iPhone 15',
    browser: 'Safari 17.2',
    operatingSystem: 'iOS 17.2',
    ipAddress: '192.168.1.101',
    location: 'Hồ Chí Minh, Việt Nam',
    isCurrentSession: false,
    createdAt: new Date('2024-05-28T14:20:00'),
    lastActivity: new Date('2024-05-29T12:15:00')
  }
];

const mockLoginAttempts: LoginAttempt[] = [
  {
    id: '1',
    userId: '1',
    username: 'admin',
    ipAddress: '192.168.1.100',
    location: 'Hồ Chí Minh, Việt Nam',
    deviceInfo: 'MacBook Pro',
    browser: 'Chrome 120.0',
    success: true,
    timestamp: new Date('2024-05-29T08:00:00')
  },
  {
    id: '2',
    username: 'admin',
    ipAddress: '103.45.67.89',
    location: 'Hà Nội, Việt Nam',
    deviceInfo: 'Windows PC',
    browser: 'Firefox 118.0',
    success: false,
    timestamp: new Date('2024-05-29T03:15:00'),
    failureReason: 'Sai mật khẩu'
  },
  {
    id: '3',
    username: 'admin',
    ipAddress: '103.45.67.89',
    location: 'Hà Nội, Việt Nam',
    deviceInfo: 'Windows PC',
    browser: 'Firefox 118.0',
    success: false,
    timestamp: new Date('2024-05-29T03:12:00'),
    failureReason: 'Sai mật khẩu'
  }
];

const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: '1',
    type: 'suspicious_login',
    severity: 'warning',
    title: 'Đăng Nhập Từ Thiết Bị Mới',
    description: 'Phát hiện đăng nhập từ thiết bị mới tại Hà Nội, Việt Nam',
    timestamp: new Date('2024-05-29T03:15:00'),
    isRead: false,
    actionRequired: true,
    userId: '1'
  },
  {
    id: '2',
    type: 'multiple_failed_attempts',
    severity: 'critical',
    title: 'Nhiều Lần Đăng Nhập Thất Bại',
    description: '3 lần thử đăng nhập thất bại liên tiếp từ IP 103.45.67.89',
    timestamp: new Date('2024-05-29T03:15:00'),
    isRead: false,
    actionRequired: false,
    userId: '1'
  }
];

export const useSecurity = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>(mockSessions);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>(mockLoginAttempts);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(mockSecurityAlerts);
  const [twoFactorAuth, setTwoFactorAuth] = useState<TwoFactorAuth>({
    enabled: false,
    qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    backupCodes: ['123456', '789012', '345678', '901234', '567890'],
    setupComplete: false
  });

  const terminateSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  }, []);

  const markAlertAsRead = useCallback((alertId: string) => {
    setSecurityAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  }, []);

  const enable2FA = useCallback((verificationCode: string) => {
    console.log('Enabling 2FA with code:', verificationCode);
    setTwoFactorAuth(prev => ({
      ...prev,
      enabled: true,
      setupComplete: true,
      lastVerified: new Date()
    }));
  }, []);

  const disable2FA = useCallback(() => {
    setTwoFactorAuth(prev => ({
      ...prev,
      enabled: false,
      setupComplete: false,
      lastVerified: undefined
    }));
  }, []);

  const generateNewBackupCodes = useCallback(() => {
    const newCodes = Array.from({ length: 5 }, () => 
      Math.random().toString().slice(2, 8)
    );
    setTwoFactorAuth(prev => ({
      ...prev,
      backupCodes: newCodes
    }));
  }, []);

  return {
    sessions,
    loginAttempts,
    securityAlerts,
    twoFactorAuth,
    terminateSession,
    markAlertAsRead,
    enable2FA,
    disable2FA,
    generateNewBackupCodes
  };
};
