
import { AlertTriangle, Home, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorPageProps {
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const ForbiddenPage = ({ onGoHome }: ErrorPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">403 - Không Có Quyền Truy Cập</CardTitle>
          <CardDescription className="text-gray-600">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onGoHome || (() => window.location.href = '/')}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Về Trang Chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const ServerErrorPage = ({ onRetry, onGoHome }: ErrorPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">500 - Lỗi Máy Chủ</CardTitle>
          <CardDescription className="text-gray-600">
            Đã xảy ra lỗi từ phía máy chủ. Chúng tôi đang khắc phục sự cố này.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onRetry || (() => window.location.reload())}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử Lại
          </Button>
          <Button 
            onClick={onGoHome || (() => window.location.href = '/')}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Về Trang Chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const NetworkErrorPage = ({ onRetry, onGoHome }: ErrorPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Lỗi Kết Nối Mạng</CardTitle>
          <CardDescription className="text-gray-600">
            Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onRetry || (() => window.location.reload())}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử Lại
          </Button>
          <Button 
            onClick={onGoHome || (() => window.location.href = '/')}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Về Trang Chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
