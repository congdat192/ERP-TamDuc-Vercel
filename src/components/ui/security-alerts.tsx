
import { useState } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Clock, 
  Eye, 
  Check, 
  X,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-states';
import { SecurityAlert } from '@/types/security';

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
  onMarkAsRead: (alertId: string) => void;
}

export const SecurityAlerts = ({ alerts, onMarkAsRead }: SecurityAlertsProps) => {
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'info': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious_login': return <MapPin className="w-4 h-4" />;
      case 'multiple_failed_attempts': return <X className="w-4 h-4" />;
      case 'new_device': return <Monitor className="w-4 h-4" />;
      case 'unusual_activity': return <Shield className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleAlertClick = (alert: SecurityAlert) => {
    setSelectedAlert(alert);
    if (!alert.isRead) {
      onMarkAsRead(alert.id);
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cảnh Báo Bảo Mật</h2>
          <p className="text-gray-600">
            Theo dõi các hoạt động bảo mật và cảnh báo của tài khoản
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive">
            {unreadCount} cảnh báo mới
          </Badge>
        )}
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Shield className="w-12 h-12 text-gray-400" />}
              title="Không Có Cảnh Báo"
              description="Tài khoản của bạn hiện tại không có cảnh báo bảo mật nào."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                !alert.isRead ? 'border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => handleAlertClick(alert)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100' :
                    alert.severity === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    {getTypeIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${
                          !alert.isRead ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {alert.title}
                        </h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity === 'critical' ? 'Nghiêm Trọng' :
                           alert.severity === 'warning' ? 'Cảnh Báo' : 'Thông Tin'}
                        </Badge>
                        {alert.actionRequired && (
                          <Badge variant="destructive">Cần Hành Động</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getSeverityIcon(alert.severity)}
                        <span className="text-xs text-gray-500">
                          {alert.type === 'suspicious_login' ? 'Đăng nhập khả nghi' :
                           alert.type === 'multiple_failed_attempts' ? 'Thất bại đăng nhập' :
                           alert.type === 'new_device' ? 'Thiết bị mới' :
                           alert.type === 'unusual_activity' ? 'Hoạt động bất thường' : 'Khác'}
                        </span>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem Chi Tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alert Detail Modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedAlert && getSeverityIcon(selectedAlert.severity)}
              <span>{selectedAlert?.title}</span>
            </DialogTitle>
            <DialogDescription>
              Chi tiết cảnh báo bảo mật
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getSeverityColor(selectedAlert.severity)}>
                  {selectedAlert.severity === 'critical' ? 'Nghiêm Trọng' :
                   selectedAlert.severity === 'warning' ? 'Cảnh Báo' : 'Thông Tin'}
                </Badge>
                {selectedAlert.actionRequired && (
                  <Badge variant="destructive">Cần Hành Động</Badge>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Mô Tả Chi Tiết</h4>
                <p className="text-sm text-gray-700">
                  {selectedAlert.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Thời Gian:</span>
                  <p>{formatTime(selectedAlert.timestamp)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Loại:</span>
                  <p>
                    {selectedAlert.type === 'suspicious_login' ? 'Đăng nhập khả nghi' :
                     selectedAlert.type === 'multiple_failed_attempts' ? 'Thất bại đăng nhập' :
                     selectedAlert.type === 'new_device' ? 'Thiết bị mới' :
                     selectedAlert.type === 'unusual_activity' ? 'Hoạt động bất thường' : 'Khác'}
                  </p>
                </div>
              </div>
              
              {selectedAlert.actionRequired && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Hành Động Được Đề Xuất</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Kiểm tra thiết bị và vị trí đăng nhập</li>
                    <li>• Thay đổi mật khẩu nếu cần thiết</li>
                    <li>• Kích hoạt xác thực 2 bước</li>
                    <li>• Liên hệ bộ phận hỗ trợ nếu cần</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
