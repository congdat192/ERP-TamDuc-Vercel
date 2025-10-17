
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeModeToggle() {
  const { theme, setThemeMode } = useTheme();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Theme Mode</h3>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setThemeMode('light')}
          className={cn(
            "flex-1 flex items-center justify-center space-x-2 h-10 transition-all duration-200",
            theme.mode === 'light' 
              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
              : "border-border text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Sun className="w-4 h-4" />
          <span>Light</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setThemeMode('dark')}
          className={cn(
            "flex-1 flex items-center justify-center space-x-2 h-10 transition-all duration-200",
            theme.mode === 'dark' 
              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
              : "border-border text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Moon className="w-4 h-4" />
          <span>Dark</span>
        </Button>
      </div>
    </div>
  );
}
