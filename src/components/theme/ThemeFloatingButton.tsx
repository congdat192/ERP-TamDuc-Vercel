
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeFloatingButtonProps {
  onClick: () => void;
}

export function ThemeFloatingButton({ onClick }: ThemeFloatingButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    setIsSpinning(true);
    onClick();
    
    // Stop spinning after animation completes
    setTimeout(() => {
      setIsSpinning(false);
    }, 800);
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-50",
        "w-12 h-12 rounded-full shadow-lg",
        "theme-bg-primary hover:theme-bg-secondary",
        "text-white hover:text-white",
        "border-2 border-white/20",
        "transition-all duration-300 ease-in-out",
        "hover:scale-110 hover:shadow-xl",
        "md:right-8 lg:right-12"
      )}
      size="icon"
    >
      <Settings 
        className={cn(
          "w-5 h-5 transition-transform duration-300",
          isSpinning && "theme-spin"
        )} 
      />
    </Button>
  );
}
