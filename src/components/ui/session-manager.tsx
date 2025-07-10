
import { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  MapPin, 
  Clock, 
  LogOut, 
  AlertTriangle,
  Shield,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { EmptyState } from '@/components/ui/empty-states';
import { SessionInfo } from '@/types/security';

interface SessionManagerProps {
  sessions: SessionInfo[];
  onTerminateSession: (sessionId: string) => void;
}

export const SessionManager = ({ sessions, onTerminateSession }: SessionManagerProps) => {
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);

  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.toLowerCase().includes('iphone') || 
        deviceName.toLowerCase().includes('android') ||
        deviceName.toLowerCase().includes('mobile')) {
      return <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleTerminateSession = (sessionId: string) => {
    setTerminatingSession(sessionId);
    onTerminateSession(sessionId);
    setTimeout(() => setTerminatingSession(null), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản Lý Phiên</h2>
          <p className="text-gray-600">
            Xem và quản lý tất cả các phiên đăng nhập của bạn
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {sessions.length} phiên hoạt động
          </Badge>
        </div>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Phiên Hoạt Động</span>
          </CardTitle>
          <CardDescription>
            Các phiên đăng nhập hiện tại của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <EmptyState
              icon={<Monitor className="w-12 h-12 text-gray-400" />}
              title="Không Có Phiên Hoạt Động"
              description="Bạn hiện tại không có phiên đăng nhập nào."
            />
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 border rounded-lg ${
                    session.isCurrentSession ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${
                        session.isCurrentSession ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {getDeviceIcon(session.deviceName)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{session.deviceName}</h3>
                          {session.isCurrentSession && (
                            <Badge variant="default">Phiên Hiện Tại</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Monitor className="w-3 h-3" />
                              <span>{session.browser} trên {session.operatingSystem}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Wifi className="w-3 h-3" />
                              <span>{session.ipAddress}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Đăng nhập: {formatDateTime(session.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Hoạt động cuối: {formatDateTime(session.lastActivity)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {!session.isCurrentSession && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={terminatingSession === session.id}
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Đăng Xuất
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <span>Chấm Dứt Phiên</span>
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn chấm dứt phiên trên thiết bị "{session.deviceName}"? 
                                Thiết bị này sẽ cần đăng nhập lại để tiếp tục sử dụng.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleTerminateSession(session.id)}
                              >
                                Chấm Dứt Phiên
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
