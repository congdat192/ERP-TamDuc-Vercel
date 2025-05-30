
import { useState, useEffect } from 'react';
import { Notification, NotificationPreferences } from '@/types/notification';

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    priority: 'high',
    title: 'Cập Nhật Hệ Thống',
    message: 'Hệ thống sẽ được bảo trì vào 2:00 AM ngày mai. Dự kiến thời gian ngừng hoạt động: 30 phút.',
    isRead: false,
    createdAt: new Date('2024-05-30T10:30:00'),
    actionUrl: '/system-maintenance',
    actionText: 'Xem Chi Tiết'
  },
  {
    id: '2',
    type: 'voucher',
    priority: 'medium',
    title: 'Voucher Mới Được Tạo',
    message: 'Bạn đã tạo thành công 100 voucher giảm giá 20% cho chiến dịch "Khuyến Mãi Mùa Hè".',
    isRead: false,
    createdAt: new Date('2024-05-30T09:15:00'),
    actionUrl: '/voucher/list',
    actionText: 'Xem Voucher'
  },
  {
    id: '3',
    type: 'security',
    priority: 'urgent',
    title: 'Phát Hiện Đăng Nhập Bất Thường',
    message: 'Có một lần đăng nhập từ địa chỉ IP không quen thuộc vào tài khoản của bạn.',
    isRead: false,
    createdAt: new Date('2024-05-30T08:45:00'),
    actionUrl: '/security/activity',
    actionText: 'Kiểm Tra Bảo Mật'
  },
  {
    id: '4',
    type: 'user',
    priority: 'low',
    title: 'Người Dùng Mới Đăng Ký',
    message: 'Nguyễn Văn An đã đăng ký tài khoản và đang chờ xác thực.',
    isRead: true,
    createdAt: new Date('2024-05-29T16:20:00'),
    actionUrl: '/admin/user-management',
    actionText: 'Xác Thực'
  },
  {
    id: '5',
    type: 'info',
    priority: 'low',
    title: 'Báo Cáo Tuần Đã Sẵn Sàng',
    message: 'Báo cáo doanh thu tuần từ 20/05 - 26/05 đã được tạo và sẵn sàng để xem.',
    isRead: true,
    createdAt: new Date('2024-05-29T14:00:00'),
    actionUrl: '/reports/weekly',
    actionText: 'Xem Báo Cáo'
  },
  {
    id: '6',
    type: 'alert',
    priority: 'medium',
    title: 'Cảnh Báo Dung Lượng',
    message: 'Dung lượng lưu trữ đã sử dụng 85%. Vui lòng xem xét nâng cấp hoặc dọn dẹp dữ liệu.',
    isRead: true,
    createdAt: new Date('2024-05-29T11:30:00'),
    actionUrl: '/settings/storage',
    actionText: 'Quản Lý Dung Lượng'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAsUnread = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationsByType = (type: string) => {
    if (type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    getNotificationsByType
  };
};

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    userId: '1',
    emailNotifications: {
      system: true,
      user: true,
      alert: true,
      info: false,
      voucher: true,
      security: true,
    },
    pushNotifications: {
      system: true,
      user: false,
      alert: true,
      info: false,
      voucher: true,
      security: true,
    },
    inAppNotifications: {
      system: true,
      user: true,
      alert: true,
      info: true,
      voucher: true,
      security: true,
    },
  });

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  return {
    preferences,
    updatePreferences
  };
};
