
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database, Inbox, Settings } from 'lucide-react';

interface EmptyStateConfig {
  icon: React.ComponentType<any>;
  message: string;
  defaultAction?: string;
}

interface EmptyStateConfigs {
  'no-data': EmptyStateConfig;
  'no-results': EmptyStateConfig;
  'error': EmptyStateConfig;
  'maintenance': EmptyStateConfig;
  'custom': EmptyStateConfig;
}

export const emptyStateConfigs: EmptyStateConfigs = {
  'no-data': {
    icon: Database,
    message: 'Không có dữ liệu để hiển thị.',
    defaultAction: 'Tạo mới'
  },
  'no-results': {
    icon: Inbox,
    message: 'Không tìm thấy kết quả nào.',
    defaultAction: 'Xóa bộ lọc'
  },
  'error': {
    icon: AlertTriangle,
    message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    defaultAction: 'Tải lại'
  },
  'maintenance': {
    icon: Settings,
    message: 'Hệ thống đang bảo trì. Vui lòng quay lại sau.',
    defaultAction: 'Tải lại'
  },
  'custom': {
    icon: Database,
    message: 'Không có dữ liệu để hiển thị.',
  }
};

interface EnhancedEmptyStateProps {
  variant: keyof EmptyStateConfigs;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export const EnhancedEmptyState = ({ 
  variant, 
  title, 
  description, 
  actionLabel, 
  onAction, 
  children 
}: EnhancedEmptyStateProps) => {
  const config = emptyStateConfigs[variant];

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      // Default actions for common scenarios
      switch (variant) {
        case 'no-data':
          console.log('Create new item action');
          break;
        case 'no-results':
          console.log('Clear filters action');
          break;
        case 'error':
          window.location.reload();
          break;
        case 'maintenance':
          window.location.reload();
          break;
        default:
          console.log('Default action triggered');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {config.icon && (
        <config.icon className="w-12 h-12 text-gray-400 mb-4" />
      )}
      
      {title && <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>}
      
      <p className="text-gray-600 mb-4">{description || config.message}</p>
      
      {(actionLabel || config.defaultAction) && (
        <Button 
          variant={variant === 'error' ? 'destructive' : 'default'} 
          className="mt-6"
          onClick={handleAction}
        >
          {actionLabel || config.defaultAction}
        </Button>
      )}
      
      {children}
    </div>
  );
};

// Add NoDataEmptyState component for backwards compatibility
interface NoDataEmptyStateProps {
  entityName: string;
  onAdd?: () => void;
}

export const NoDataEmptyState = ({ entityName, onAdd }: NoDataEmptyStateProps) => {
  return (
    <EnhancedEmptyState
      variant="no-data"
      title={`Chưa có ${entityName} nào`}
      description={`Bắt đầu bằng cách tạo ${entityName} đầu tiên của bạn.`}
      actionLabel={`Thêm ${entityName}`}
      onAction={onAdd}
    />
  );
};
