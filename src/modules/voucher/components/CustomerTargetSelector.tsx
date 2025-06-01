
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
      <h3 className="text-lg font-semibold text-gray-900">Đối Tượng Khách Hàng</h3>
      <div className="grid grid-cols-2 gap-3">
        {customerTargets.map((target) => (
          <Card 
            key={target}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value.includes(target)
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleToggle(target)}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={value.includes(target)}
                  onChange={() => handleToggle(target)}
                />
                <span className="text-sm font-medium text-gray-900">
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
