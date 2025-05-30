
import { Loader } from 'lucide-react';
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
