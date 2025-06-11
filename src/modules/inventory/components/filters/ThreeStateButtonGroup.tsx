
import { Button } from '@/components/ui/button';

interface ThreeStateButtonGroupProps {
  label: string;
  value: 'all' | 'yes' | 'no';
  onChange: (value: 'all' | 'yes' | 'no') => void;
}

export function ThreeStateButtonGroup({ label, value, onChange }: ThreeStateButtonGroupProps) {
  const options = [
    { value: 'all' as const, label: 'Tất cả' },
    { value: 'yes' as const, label: 'Có' },
    { value: 'no' as const, label: 'Không' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium theme-text">{label}</label>
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
            className={`text-xs h-8 rounded-md ${
              value === option.value 
                ? "voucher-button-primary" 
                : "theme-border-primary hover:theme-bg-primary/10"
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
