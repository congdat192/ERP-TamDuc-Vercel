
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  message: string;
  className?: string;
}

export const FormError = ({ message, className }: FormErrorProps) => {
  return (
    <Alert variant="destructive" className={cn("mb-4", className)}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

interface FormSuccessProps {
  message: string;
  className?: string;
}

export const FormSuccess = ({ message, className }: FormSuccessProps) => {
  return (
    <Alert className={cn("mb-4 border-green-200 bg-green-50 text-green-800", className)}>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

interface FormInfoProps {
  message: string;
  className?: string;
}

export const FormInfo = ({ message, className }: FormInfoProps) => {
  return (
    <Alert className={cn("mb-4 border-blue-200 bg-blue-50 text-blue-800", className)}>
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

interface FieldErrorProps {
  error?: string;
  className?: string;
}

export const FieldError = ({ error, className }: FieldErrorProps) => {
  if (!error) return null;
  
  return (
    <p className={cn("text-sm text-red-600 mt-1", className)}>
      {error}
    </p>
  );
};

interface ValidationSummaryProps {
  errors: string[];
  onDismiss?: () => void;
  className?: string;
}

export const ValidationSummary = ({ errors, onDismiss, className }: ValidationSummaryProps) => {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive" className={cn("mb-4", className)}>
      <AlertTriangle className="h-4 w-4" />
      <div className="flex justify-between items-start">
        <div>
          <AlertDescription className="font-medium mb-2">
            Vui lòng sửa các lỗi sau:
          </AlertDescription>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-auto p-1 text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
};

interface FormLoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const FormLoadingState = ({ 
  isLoading, 
  loadingText = "Đang xử lý...", 
  children 
}: FormLoadingStateProps) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">{loadingText}</span>
          </div>
        </div>
      )}
    </div>
  );
};
