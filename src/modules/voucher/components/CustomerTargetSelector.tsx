
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomerTargetType, CUSTOMER_TARGET_LABELS } from '../types/campaign';

interface CustomerTargetSelectorProps {
  value: CustomerTargetType[];
  onChange: (value: CustomerTargetType[]) => void;
}

export function CustomerTargetSelector({ value, onChange }: CustomerTargetSelectorProps) {
  const customerTargets: CustomerTargetType[] = ['new', 'existing', 'vip', 'regular', 'all'];

  const handleToggle = (target: CustomerTargetType) => {
    if (value.includes(target)) {
      onChange(value.filter(t => t !== target));
    } else {
      onChange([...value, target]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold theme-text">Đối Tượng Khách Hàng</h3>
      <div className="grid grid-cols-2 gap-3">
        {customerTargets.map((target) => (
          <Card 
            key={target}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value.includes(target)
                ? 'voucher-alert-success border-2' 
                : 'voucher-card hover:theme-border-primary/30'
            }`}
            onClick={() => handleToggle(target)}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={value.includes(target)}
                  onChange={() => handleToggle(target)}
                  className="theme-border-primary"
                />
                <span className="text-sm font-medium theme-text">
                  {CUSTOMER_TARGET_LABELS[target]}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
