
import { THEME_PRESETS } from '@/types/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function PresetColorPicker() {
  const { theme, setThemePreset } = useTheme();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Color Presets</h3>
      <div className="grid grid-cols-4 gap-3">
        {THEME_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setThemePreset(preset.id)}
            className={cn(
              "relative w-12 h-12 rounded-full overflow-hidden",
              "border-2 transition-all duration-200",
              "hover:scale-110 hover:shadow-lg",
              theme.preset === preset.id 
                ? "border-white shadow-lg ring-2 ring-blue-500 ring-offset-2" 
                : "border-gray-200 hover:border-gray-300"
            )}
            style={{ background: preset.gradient }}
            title={preset.name}
          >
            {theme.preset === preset.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground text-center">
        {THEME_PRESETS.find(p => p.id === theme.preset)?.name}
      </div>
    </div>
  );
}
