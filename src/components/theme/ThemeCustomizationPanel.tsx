
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
          "fixed right-0 top-0 h-full w-[400px] bg-card border-l shadow-xl z-50",
          "transform transition-transform duration-300 ease-out",
          "animate-slide-in-right",
          "max-w-full sm:w-[400px]"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-background">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 theme-bg-primary rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Theme Customization</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Theme Mode Section */}
            <div className="p-6 border-b bg-background">
              <ThemeModeToggle />
            </div>

            {/* Color Presets Section */}
            <div className="p-6 border-b bg-background">
              <PresetColorPicker />
            </div>

            {/* Preview Section */}
            <div className="p-6 bg-background">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Theme Preview</h3>
                <div className="p-4 rounded-lg border bg-card space-y-4">
                  {/* Gradient header */}
                  <div className="theme-gradient h-16 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Gradient Header</span>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex space-x-2">
                    <Button size="sm" className="theme-bg-primary text-white hover:opacity-90">
                      Primary
                    </Button>
                    <Button variant="outline" size="sm" className="theme-border-primary theme-text-primary hover:theme-bg-primary hover:text-white">
                      Secondary
                    </Button>
                  </div>
                  
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg theme-bg-primary/10 theme-border-primary/20 border">
                      <div className="text-xs text-muted-foreground">Total Users</div>
                      <div className="text-lg font-bold theme-text-primary">1,234</div>
                    </div>
                    <div className="p-3 rounded-lg theme-bg-secondary/10 theme-border-secondary/20 border">
                      <div className="text-xs text-muted-foreground">Revenue</div>
                      <div className="text-lg font-bold theme-text-secondary">$56.7k</div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    This preview shows how your selected theme will appear across the ERP system.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-background">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default</span>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Theme settings are automatically saved and will persist across sessions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
