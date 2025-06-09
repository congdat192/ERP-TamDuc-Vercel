
import { THEME_PRESETS } from '@/types/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function PresetColorPicker() {
  const { theme, setThemePreset } = useTheme();

  // Split presets into 2 rows of 4 for Berry-like layout
  const firstRow = THEME_PRESETS.slice(0, 4);
  const secondRow = THEME_PRESETS.slice(4, 8);

  const PresetRow = ({ presets }: { presets: typeof THEME_PRESETS }) => (
    <div className="flex justify-between gap-2">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => setThemePreset(preset.id)}
          className={cn(
            "relative w-12 h-12 rounded-lg overflow-hidden flex-1",
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
              <Check className="w-4 h-4 text-white drop-shadow-lg" />
            </div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Color Presets</h3>
        <div className="space-y-3">
          <PresetRow presets={firstRow} />
          <PresetRow presets={secondRow} />
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
