
import { AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SessionTimeoutDialogProps {
  isExpired: boolean;
  onLogout: () => void;
}

// Simplified session timeout dialog - no countdown, just show expired message
export const SessionTimeoutDialog = ({ 
  isExpired, 
  onLogout 
}: SessionTimeoutDialogProps) => {
  if (!isExpired) {
    return null;
  }

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
            Phiên làm việc của bạn đã hết hạn. 
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
};
