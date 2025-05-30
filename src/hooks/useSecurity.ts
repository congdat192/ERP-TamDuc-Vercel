
import { useState, useEffect, useCallback } from 'react';
import { SessionInfo, LoginAttempt, SecurityAlert, TwoFactorAuth, SessionTimeoutState } from '@/types/security';

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
    lastActivity: new Date('2024-05-29T16:30:00'),
    expiresAt: new Date('2024-05-30T08:00:00')
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
    lastActivity: new Date('2024-05-29T12:15:00'),
    expiresAt: new Date('2024-05-29T14:20:00')
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
    type: 'unusual_login',
    severity: 'medium',
    title: 'Đăng Nhập Từ Thiết Bị Mới',
    description: 'Phát hiện đăng nhập từ thiết bị mới tại Hà Nội, Việt Nam',
    timestamp: new Date('2024-05-29T03:15:00'),
    isRead: false,
    actionRequired: true,
    userId: '1'
  },
  {
    id: '2',
    type: 'failed_attempts',
    severity: 'high',
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

export const useSessionTimeout = (timeoutMinutes: number = 30) => {
  const [sessionState, setSessionState] = useState<SessionTimeoutState>({
    isWarning: false,
    timeRemaining: timeoutMinutes * 60,
    isExpired: false
  });

  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetSession = useCallback(() => {
    setLastActivity(Date.now());
    setSessionState({
      isWarning: false,
      timeRemaining: timeoutMinutes * 60,
      isExpired: false
    });
  }, [timeoutMinutes]);

  const forceLogout = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      isExpired: true,
      timeRemaining: 0
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = Math.floor((now - lastActivity) / 1000);
      const remaining = Math.max(0, (timeoutMinutes * 60) - timeSinceLastActivity);

      if (remaining <= 0) {
        setSessionState({
          isWarning: false,
          timeRemaining: 0,
          isExpired: true
        });
      } else if (remaining <= 300) { // 5 minutes warning
        setSessionState({
          isWarning: true,
          timeRemaining: remaining,
          isExpired: false
        });
      } else {
        setSessionState({
          isWarning: false,
          timeRemaining: remaining,
          isExpired: false
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, timeoutMinutes]);

  // Reset activity on user interaction
  useEffect(() => {
    const handleActivity = () => {
      if (!sessionState.isExpired) {
        setLastActivity(Date.now());
      }
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [sessionState.isExpired]);

  return {
    sessionState,
    resetSession,
    forceLogout
  };
};
