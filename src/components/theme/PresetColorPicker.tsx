
import { THEME_PRESETS } from '@/types/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function PresetColorPicker() {
  const { theme, setThemePreset } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Color Presets</h3>
        <div className="flex justify-center gap-4">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setThemePreset(preset.id)}
              className={cn(
                "relative w-16 h-16 rounded-lg overflow-hidden",
                "border-2 transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                theme.preset === preset.id 
                  ? "border-white shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background" 
                  : "border-border hover:border-border"
              )}
              title={preset.name}
            >
              {/* Primary color half */}
              <div 
                className="absolute inset-0 w-1/2"
                style={{ backgroundColor: preset.primary }}
              />
              {/* Secondary color half */}
              <div 
                className="absolute inset-0 left-1/2 w-1/2"
                style={{ backgroundColor: preset.secondary }}
              />
              
              {theme.preset === preset.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Current preset name */}
      <div className="text-center">
        <div className="text-xs font-medium text-muted-foreground">
          Current: {THEME_PRESETS.find(p => p.id === theme.preset)?.name}
        </div>
      </div>
    </div>
  );
}
