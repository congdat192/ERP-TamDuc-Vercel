
import { 
  FileText, 
  Users, 
  Search, 
  Database, 
  Settings, 
  Activity,
  Bell,
  Inbox,
  BarChart3,
  Shield,
  Calendar,
  FolderOpen,
  CloudOff,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Plus,
  Upload,
  Download,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedEmptyStateProps {
  type: 'no-data' | 'no-results' | 'error' | 'offline' | 'unauthorized' | 'loading' | 'success';
  title: string;
  description: string;
  illustration?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  tips?: string[];
  className?: string;
}

export const EnhancedEmptyState = ({
  type,
  title,
  description,
  illustration,
  primaryAction,
  secondaryAction,
  tips,
  className
}: EnhancedEmptyStateProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          bgColor: 'bg-red-50',
          iconColor: 'text-red-500',
          borderColor: 'border-red-200'
        };
      case 'offline':
        return {
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-500',
          borderColor: 'border-gray-200'
        };
      case 'unauthorized':
        return {
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-500',
          borderColor: 'border-orange-200'
        };
      case 'success':
        return {
          bgColor: 'bg-green-50',
          iconColor: 'text-green-500',
          borderColor: 'border-green-200'
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200'
        };
    }
  };

  const { bgColor, iconColor, borderColor } = getTypeStyles();

  return (
    <Card className={cn('border-dashed', borderColor, className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {/* Illustration */}
        <div className={cn('mb-6 p-6 rounded-full', bgColor)}>
          {illustration || <FileText className={cn('w-12 h-12', iconColor)} />}
        </div>

        {/* Content */}
        <div className="max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              {primaryAction && (
                <Button onClick={primaryAction.onClick} className="flex items-center space-x-2">
                  {primaryAction.icon}
                  <span>{primaryAction.label}</span>
                </Button>
              )}
              {secondaryAction && (
                <Button 
                  variant="outline" 
                  onClick={secondaryAction.onClick}
                  className="flex items-center space-x-2"
                >
                  {secondaryAction.icon}
                  <span>{secondaryAction.label}</span>
                </Button>
              )}
            </div>
          )}

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className={cn('p-4 rounded-lg text-left', bgColor)}>
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className={cn('w-4 h-4', iconColor)} />
                <span className="font-medium text-gray-800">Gợi ý:</span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-gray-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Specialized empty state components
export const NoDataEmptyState = ({ 
  entityName, 
  onAdd 
}: { 
  entityName: string; 
  onAdd?: () => void; 
}) => {
  return (
    <EnhancedEmptyState
      type="no-data"
      title={`Chưa có ${entityName} nào`}
      description={`Bạn chưa có ${entityName} nào trong hệ thống. Hãy tạo ${entityName} đầu tiên để bắt đầu.`}
      illustration={<Database className="w-12 h-12 text-blue-500" />}
      primaryAction={onAdd ? {
        label: `Thêm ${entityName}`,
        onClick: onAdd,
        icon: <Plus className="w-4 h-4" />
      } : undefined}
      tips={[
        `Sử dụng nút "Thêm ${entityName}" để tạo mục đầu tiên`,
        'Bạn có thể nhập dữ liệu từ file Excel nếu có sẵn',
        'Liên hệ quản trị viên nếu cần hỗ trợ thiết lập ban đầu'
      ]}
    />
  );
};

export const SearchEmptyState = ({ searchTerm, onClear }: { searchTerm: string; onClear: () => void }) => {
  return (
    <EnhancedEmptyState
      type="no-results"
      title="Không tìm thấy kết quả"
      description={`Không có kết quả nào phù hợp với "${searchTerm}". Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc.`}
      illustration={<Search className="w-12 h-12 text-blue-500" />}
      primaryAction={{
        label: 'Xóa Tìm Kiếm',
        onClick: onClear,
        icon: <RefreshCw className="w-4 h-4" />
      }}
      tips={[
        'Thử sử dụng từ khóa ngắn gọn hơn',
        'Kiểm tra chính tả của từ khóa tìm kiếm',
        'Sử dụng bộ lọc để thu hẹp kết quả',
        'Thử tìm kiếm với từ đồng nghĩa'
      ]}
    />
  );
};

export const ErrorEmptyState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <EnhancedEmptyState
      type="error"
      title="Đã xảy ra lỗi"
      description="Không thể tải dữ liệu. Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ kỹ thuật."
      illustration={<AlertTriangle className="w-12 h-12 text-red-500" />}
      primaryAction={{
        label: 'Thử Lại',
        onClick: onRetry,
        icon: <RefreshCw className="w-4 h-4" />
      }}
      tips={[
        'Kiểm tra kết nối mạng của bạn',
        'Thử làm mới trang (Ctrl + R)',
        'Liên hệ IT nếu lỗi vẫn tiếp tục xảy ra'
      ]}
    />
  );
};

export const OfflineEmptyState = () => {
  return (
    <EnhancedEmptyState
      type="offline"
      title="Không có kết nối mạng"
      description="Bạn đang ở chế độ ngoại tuyến. Vui lòng kiểm tra kết nối internet và thử lại."
      illustration={<WifiOff className="w-12 h-12 text-gray-500" />}
      primaryAction={{
        label: 'Thử Lại',
        onClick: () => window.location.reload(),
        icon: <RefreshCw className="w-4 h-4" />
      }}
      tips={[
        'Kiểm tra cáp mạng hoặc WiFi',
        'Thử truy cập các website khác',
        'Liên hệ bộ phận IT nếu cần hỗ trợ'
      ]}
    />
  );
};

export const UnauthorizedEmptyState = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <EnhancedEmptyState
      type="unauthorized"
      title="Không có quyền truy cập"
      description="Bạn không có quyền xem nội dung này. Vui lòng đăng nhập với tài khoản có quyền hạn phù hợp."
      illustration={<Shield className="w-12 h-12 text-orange-500" />}
      primaryAction={{
        label: 'Đăng Nhập',
        onClick: onLogin,
        icon: <Users className="w-4 h-4" />
      }}
      tips={[
        'Liên hệ quản trị viên để cấp quyền truy cập',
        'Đảm bảo bạn đã đăng nhập đúng tài khoản',
        'Kiểm tra vai trò và quyền hạn của tài khoản'
      ]}
    />
  );
};

export const SuccessEmptyState = ({ 
  title, 
  description, 
  onContinue 
}: { 
  title: string; 
  description: string; 
  onContinue: () => void; 
}) => {
  return (
    <EnhancedEmptyState
      type="success"
      title={title}
      description={description}
      illustration={<Sparkles className="w-12 h-12 text-green-500" />}
      primaryAction={{
        label: 'Tiếp Tục',
        onClick: onContinue,
        icon: <Target className="w-4 h-4" />
      }}
    />
  );
};

// Specialized illustrations for different modules
export const VoucherEmptyIllustration = () => (
  <div className="relative">
    <Inbox className="w-12 h-12 text-blue-500" />
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
      <Sparkles className="w-2 h-2 text-blue-600" />
    </div>
  </div>
);

export const AnalyticsEmptyIllustration = () => (
  <div className="relative">
    <BarChart3 className="w-12 h-12 text-blue-500" />
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
      <TrendingUp className="w-2 h-2 text-green-600" />
    </div>
  </div>
);

export const UserEmptyIllustration = () => (
  <div className="relative">
    <Users className="w-12 h-12 text-blue-500" />
    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
      <Plus className="w-2 h-2 text-blue-600" />
    </div>
  </div>
);
