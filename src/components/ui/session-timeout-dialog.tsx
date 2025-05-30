
import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SessionTimeoutState } from '@/types/security';

interface SessionTimeoutDialogProps {
  sessionState: SessionTimeoutState;
  onExtendSession: () => void;
  onLogout: () => void;
}

export const SessionTimeoutDialog = ({ 
  sessionState, 
  onExtendSession, 
  onLogout 
}: SessionTimeoutDialogProps) => {
  const [countdown, setCountdown] = useState(sessionState.timeRemaining);

  useEffect(() => {
    setCountdown(sessionState.timeRemaining);
  }, [sessionState.timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = sessionState.isWarning 
    ? (countdown / 300) * 100 
    : 100;

  if (sessionState.isExpired) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-red-600">
              Phiên Làm Việc Đã Hết Hạn
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Phiên làm việc của bạn đã hết hạn do không hoạt động. 
              Vui lòng đăng nhập lại để tiếp tục.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onLogout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Đăng Nhập Lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={sessionState.isWarning}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Cảnh Báo Hết Hạn Phiên
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Phiên làm việc của bạn sẽ hết hạn trong:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 flex items-center justify-center space-x-2">
              <Clock className="w-8 h-8" />
              <span>{formatTime(countdown)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Thời gian còn lại</span>
              <span>{formatTime(countdown)}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Bạn có thể gia hạn phiên hoặc tiếp tục làm việc bằng cách 
              nhấp vào "Gia Hạn Phiên" hoặc thực hiện bất kỳ thao tác nào trong hệ thống.
            </p>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Đăng Xuất
          </Button>
          <Button onClick={onExtendSession}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Gia Hạn Phiên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
