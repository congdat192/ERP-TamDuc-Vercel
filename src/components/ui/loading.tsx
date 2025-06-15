
import { Loader, RefreshCw, Clock, Database, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  className?: string;
}

export const LoadingOverlay = ({ isVisible, text = "Đang tải...", className }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
      className
    )}>
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 min-w-[200px]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader className={cn(
      'animate-spin text-primary',
      sizeClasses[size],
      className
    )} />
  );
};

interface PageLoadingProps {
  text?: string;
}

export const PageLoading = ({ text = "Đang tải trang..." }: PageLoadingProps) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
};

interface InlineLoadingProps {
  text?: string;
  className?: string;
}

export const InlineLoading = ({ text = "Đang tải...", className }: InlineLoadingProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <LoadingSpinner size="sm" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

// Enhanced loading with type variations
interface EnhancedLoadingProps {
  type?: 'page' | 'table' | 'card' | 'form' | 'chart' | 'list';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  animated?: boolean;
}

export const EnhancedLoading = ({ 
  type = 'page', 
  size = 'md', 
  text, 
  className,
  animated = true 
}: EnhancedLoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  if (type === 'table') {
    return <TableLoadingSkeleton />;
  }

  if (type === 'card') {
    return <CardLoadingSkeleton />;
  }

  if (type === 'form') {
    return <FormLoadingSkeleton />;
  }

  if (type === 'chart') {
    return <ChartLoadingSkeleton />;
  }

  if (type === 'list') {
    return <ListLoadingSkeleton />;
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 space-y-4',
      className
    )}>
      <div className="relative">
        <Loader className={cn(
          sizeClasses[size],
          'text-blue-500',
          animated && 'animate-spin'
        )} />
        {animated && (
          <div className={cn(
            'absolute inset-0 border-2 border-blue-200 rounded-full',
            'animate-pulse'
          )} />
        )}
      </div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Skeleton loading components - consolidated from enhanced-loading.tsx
export const TableLoadingSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="flex space-x-4 p-4 bg-gray-50 border-b">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
          ))}
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4 p-4 border-b border-gray-100">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                {colIndex === 0 ? (
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                )}
              </div>
            ))}
            <div className="flex space-x-1">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const CardLoadingSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
            <div className="flex justify-between">
              <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const FormLoadingSkeleton = ({ fields = 4 }: { fields?: number }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          {i % 3 === 0 && <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />}
        </div>
      ))}
      
      <div className="flex space-x-4 pt-4">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

export const ChartLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      
      <div className="relative h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
        <div className="text-center space-y-2">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ListLoadingSkeleton = ({ items = 5 }: { items?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
          <ChartLoadingSkeleton />
        </div>
        <div className="border rounded-lg p-6 space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
          <ListLoadingSkeleton items={4} />
        </div>
      </div>
    </div>
  );
};

// Loading states with contextual icons and messages
export const ModuleLoadingState = ({ 
  module, 
  message 
}: { 
  module: 'users' | 'vouchers' | 'analytics' | 'settings'; 
  message?: string; 
}) => {
  const moduleConfig = {
    users: {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      defaultMessage: 'Đang tải danh sách người dùng...'
    },
    vouchers: {
      icon: <Database className="w-8 h-8 text-green-500" />,
      defaultMessage: 'Đang tải dữ liệu voucher...'
    },
    analytics: {
      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
      defaultMessage: 'Đang phân tích dữ liệu...'
    },
    settings: {
      icon: <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />,
      defaultMessage: 'Đang cập nhật cài đặt...'
    }
  };

  const config = moduleConfig[module];

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative">
        {config.icon}
        <div className="absolute inset-0 border-2 border-current rounded-full animate-ping opacity-20" />
      </div>
      <p className="text-sm text-gray-600 animate-pulse">
        {message || config.defaultMessage}
      </p>
    </div>
  );
};
