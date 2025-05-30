
export type NotificationType = 'system' | 'user' | 'alert' | 'info' | 'voucher' | 'security';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: {
    system: boolean;
    user: boolean;
    alert: boolean;
    info: boolean;
    voucher: boolean;
    security: boolean;
  };
  pushNotifications: {
    system: boolean;
    user: boolean;
    alert: boolean;
    info: boolean;
    voucher: boolean;
    security: boolean;
  };
  inAppNotifications: {
    system: boolean;
    user: boolean;
    alert: boolean;
    info: boolean;
    voucher: boolean;
    security: boolean;
  };
}
