import { useState } from 'react';
import { Check } from 'lucide-react';
import { AttributeOption } from '../../types/lens';
import { cn } from '@/lib/utils';

interface MegaMenuItemProps {
  option: AttributeOption;
  isChecked: boolean;
  onToggle: () => void;
}

export function MegaMenuItem({ option, isChecked, onToggle }: MegaMenuItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex flex-col items-center p-3 rounded-lg border-2 transition-all text-left",
        "hover:border-primary hover:bg-primary/5",
        isChecked 
          ? "border-green-600 bg-green-50 dark:bg-green-950/30 ring-2 ring-green-600/20" 
          : "border-border bg-background"
      )}
    >
      {/* Image */}
      {option.image_url && !imageError && (
        <div className="w-20 h-20 mb-2 rounded-md overflow-hidden border border-border bg-muted">
          <img
            src={option.image_url}
            alt={option.label}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}
      
      {/* Label */}
      <div className="text-sm font-medium text-center line-clamp-2 mb-1 w-full">
        {option.label}
      </div>
      
      {/* Short description */}
      {option.short_description && (
        <div className="text-xs text-muted-foreground text-center line-clamp-1 w-full">
          {option.short_description}
        </div>
      )}
      
      {/* Checkmark indicator */}
      {isChecked && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shadow-md">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}
