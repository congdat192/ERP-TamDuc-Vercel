
import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  type?: 'fade' | 'slide' | 'scale' | 'none';
}

export const PageTransition = ({ 
  children, 
  isLoading = false, 
  className,
  type = 'fade' 
}: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isLoading]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-out';
    
    if (!isVisible) {
      switch (type) {
        case 'slide':
          return `${baseClasses} opacity-0 transform translate-y-4`;
        case 'scale':
          return `${baseClasses} opacity-0 transform scale-95`;
        case 'fade':
          return `${baseClasses} opacity-0`;
        default:
          return '';
      }
    }

    return `${baseClasses} opacity-100 transform translate-y-0 scale-100`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(getTransitionClasses(), className)}>
      {children}
    </div>
  );
};

interface StaggeredListProps {
  children: ReactNode[];
  delay?: number;
  className?: string;
}

export const StaggeredList = ({ children, delay = 100, className }: StaggeredListProps) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(children.length).fill(false));

  useEffect(() => {
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * delay);
    });
  }, [children.length, delay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all duration-300 ease-out',
            visibleItems[index] 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInSection = ({ children, delay = 0, className }: FadeInSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-6',
        className
      )}
    >
      {children}
    </div>
  );
};
