
import { Skeleton } from '@/components/ui/skeleton';
import { Loader, RefreshCw, Clock, Database, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export const TableLoadingSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header with search and actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Table Header */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex space-x-4 p-4 bg-gray-50 border-b">
          <Skeleton className="h-4 w-4" /> {/* Checkbox */}
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
          <Skeleton className="h-4 w-20" /> {/* Actions */}
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4 p-4 border-b border-gray-100 animate-pulse">
            <Skeleton className="h-4 w-4" />
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                {colIndex === 0 ? (
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </div>
            ))}
            <div className="flex space-x-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
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
        <div key={i} className="border rounded-lg p-6 space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const FormLoadingSkeleton = ({ fields = 4 }: { fields?: number }) => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
          {i % 3 === 0 && <Skeleton className="h-3 w-1/2" />}
        </div>
      ))}
      
      <div className="flex space-x-4 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

export const ChartLoadingSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      
      <div className="relative h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
        <div className="text-center space-y-2">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
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
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <ChartLoadingSkeleton />
        </div>
        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
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
