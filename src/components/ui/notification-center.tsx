
import { useState } from 'react';
import { Bell, Check, X, Settings, MoreVertical, AlertTriangle, Info, Shield, User, Ticket, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification, NotificationType } from '@/types/notification';
import { cn } from '@/lib/utils';
import { EmptyStateCard } from '@/components/ui/empty-states';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'system': return Monitor;
    case 'user': return User;
    case 'alert': return AlertTriangle;
    case 'info': return Info;
    case 'voucher': return Ticket;
    case 'security': return Shield;
    default: return Bell;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'system': return 'text-blue-600';
    case 'user': return 'text-green-600';
    case 'alert': return 'text-orange-600';
    case 'info': return 'text-gray-600';
    case 'voucher': return 'text-purple-600';
    case 'security': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeDisplayName = (type: NotificationType) => {
  const names = {
    system: 'Hệ Thống',
    user: 'Người Dùng',
    alert: 'Cảnh Báo',
    info: 'Thông Tin',
    voucher: 'Voucher',
    security: 'Bảo Mật'
  };
  return names[type] || 'Khác';
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (notification: Notification) => void;
}

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onMarkAsUnread, 
  onDelete,
  onViewDetails 
}: NotificationItemProps) => {
  const Icon = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);
  const priorityColor = getPriorityColor(notification.priority);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  return (
    <div 
      className={cn(
        "p-4 border-l-4 hover:bg-gray-50 transition-colors cursor-pointer",
        notification.isRead ? "bg-white border-l-gray-200" : "bg-blue-50 border-l-blue-500"
      )}
      onClick={() => onViewDetails(notification)}
    >
      <div className="flex items-start space-x-3">
        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", 
          notification.isRead ? "bg-gray-100" : "bg-blue-100"
        )}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h4 className={cn("text-sm font-medium", 
                notification.isRead ? "text-gray-900" : "text-blue-900"
              )}>
                {notification.title}
              </h4>
              <Badge className={cn("text-xs", priorityColor)}>
                {notification.priority === 'urgent' ? 'Khẩn Cấp' :
                 notification.priority === 'high' ? 'Cao' :
                 notification.priority === 'medium' ? 'Trung Bình' : 'Thấp'}
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {notification.isRead ? (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsUnread(notification.id);
                  }}>
                    Đánh Dấu Chưa Đọc
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}>
                    <Check className="w-4 h-4 mr-2" />
                    Đánh Dấu Đã Đọc
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="text-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa Thông Báo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
            {notification.actionText && (
              <Button variant="outline" size="sm" className="text-xs">
                {notification.actionText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAsUnread, 
    markAllAsRead, 
    deleteNotification,
    getNotificationsByType 
  } = useNotifications();
  
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const filteredNotifications = getNotificationsByType(activeTab);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Thông Báo</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-1" />
                Đọc Tất Cả
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 px-4 py-2">
            <TabsTrigger value="all" className="text-xs">Tất Cả</TabsTrigger>
            <TabsTrigger value="system" className="text-xs">Hệ Thống</TabsTrigger>
            <TabsTrigger value="voucher" className="text-xs">Voucher</TabsTrigger>
            <TabsTrigger value="security" className="text-xs">Bảo Mật</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-96">
            <TabsContent value={activeTab} className="m-0">
              {filteredNotifications.length === 0 ? (
                <div className="p-4">
                  <EmptyStateCard
                    icon={Bell}
                    title="Không Có Thông Báo"
                    description="Bạn đã xem hết tất cả thông báo."
                  />
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onMarkAsUnread={markAsUnread}
                      onDelete={deleteNotification}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
