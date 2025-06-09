
import { X, Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeModeToggle } from './ThemeModeToggle';
import { PresetColorPicker } from './PresetColorPicker';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeCustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCustomizationPanel({ isOpen, onClose }: ThemeCustomizationPanelProps) {
  const { resetTheme } = useTheme();

  const handleReset = () => {
    resetTheme();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-[375px] bg-background border-l shadow-xl z-50",
          "transform transition-transform duration-300 ease-out",
          "animate-slide-in-right",
          "max-w-full sm:w-[375px]"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 theme-text-primary" />
              <h2 className="text-lg font-semibold">Theme Customization</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Theme Mode */}
            <ThemeModeToggle />

            <Separator />

            {/* Color Presets */}
            <PresetColorPicker />

            <Separator />

            {/* Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Preview</h3>
              <div className="p-4 rounded-lg border bg-card">
                <div className="space-y-3">
                  <div className="theme-gradient h-20 rounded-lg"></div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="theme-bg-primary text-white">
                      Primary Button
                    </Button>
                    <Button variant="outline" size="sm" className="theme-border-primary theme-text-primary">
                      Outline Button
                    </Button>
                  </div>
                  <div className="p-3 rounded border theme-border-primary/20 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      This is how your theme will look across the ERP system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default</span>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Theme settings are saved automatically and persist across sessions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
