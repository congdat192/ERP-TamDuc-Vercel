
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { StaffType, STAFF_TYPE_LABELS } from '../types/campaign';

interface StaffTypeSelectorProps {
  value: StaffType[];
  onChange: (value: StaffType[]) => void;
}

export function StaffTypeSelector({ value, onChange }: StaffTypeSelectorProps) {
  const staffTypes: StaffType[] = ['cskh', 'telesale'];

  const handleToggle = (staffType: StaffType) => {
    if (value.includes(staffType)) {
      onChange(value.filter(t => t !== staffType));
    } else {
      onChange([...value, staffType]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Loại Nhân Viên</h3>
      <div className="grid grid-cols-2 gap-4">
        {staffTypes.map((type) => (
          <Card 
            key={type}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value.includes(type)
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleToggle(type)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  checked={value.includes(type)}
                  onChange={() => handleToggle(type)}
                />
                <span className="font-medium text-gray-900">
                  {STAFF_TYPE_LABELS[type]}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
