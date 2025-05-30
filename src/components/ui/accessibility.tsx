
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AccessibilityAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export const AccessibilityAnnouncement = ({ 
  message, 
  priority = 'polite' 
}: AccessibilityAnnouncementProps) => {
  return (
    <div
      className="sr-only"
      aria-live={priority}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

export const SkipLink = ({ targetId, children }: SkipLinkProps) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
    >
      {children}
    </a>
  );
};

interface FocusTrapProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const FocusTrap = ({ children, enabled = true }: FocusTrapProps) => {
  useEffect(() => {
    if (!enabled) return;

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('[role="dialog"]');
    
    if (!modal) return;

    const focusableContent = modal.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0] as HTMLElement;
    const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstFocusableElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled]);

  return <>{children}</>;
};

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

export const VisuallyHidden = ({ children, className }: VisuallyHiddenProps) => {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  );
};

// High contrast mode support
export const useHighContrast = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Initial check
    if (mediaQuery.matches) {
      document.documentElement.classList.add('high-contrast');
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
};

// Reduced motion support
export const useReducedMotion = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Initial check
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion');
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
};

// ARIA helpers
export const generateAriaLabel = (base: string, context?: string) => {
  return context ? `${base} - ${context}` : base;
};

export const generateAriaDescribedBy = (ids: string[]) => {
  return ids.filter(Boolean).join(' ');
};
