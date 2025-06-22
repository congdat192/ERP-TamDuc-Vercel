
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { StaffType } from '../types/campaign';

// Use consistent staff data with StaffManager
const STAFF_OPTIONS = [
  { value: 'cskh' as StaffType, label: 'CSKH', staff: ['Bảo Trâm', 'Anh Thy'] },
  { value: 'telesales' as StaffType, label: 'Telesales', staff: ['Nguyễn Liễu'] },
  { value: 'sales' as StaffType, label: 'Bán hàng', staff: [] },
  { value: 'admin' as StaffType, label: 'Quản lý', staff: [] }
];

interface StaffTypeSelectorProps {
  value: StaffType[];
  onChange: (types: StaffType[]) => void;
}

export function StaffTypeSelector({ value, onChange }: StaffTypeSelectorProps) {
  const handleStaffTypeChange = (staffType: StaffType, checked: boolean) => {
    if (checked) {
      onChange([...value, staffType]);
    } else {
      onChange(value.filter(type => type !== staffType));
    }
  };

  return (
    <Card className="voucher-card">
      <CardHeader>
        <CardTitle className="text-sm theme-text flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>Chọn Loại Nhân Viên</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {STAFF_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <Checkbox
                id={`staff-${option.value}`}
                checked={value.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleStaffTypeChange(option.value, checked as boolean)
                }
              />
              <div className="flex-1 space-y-1">
                <label 
                  htmlFor={`staff-${option.value}`}
                  className="text-sm font-medium theme-text cursor-pointer"
                >
                  {option.label}
                </label>
                {option.staff.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {option.staff.map((staffName) => (
                      <Badge 
                        key={staffName} 
                        variant="secondary" 
                        className="text-xs theme-badge-secondary"
                      >
                        {staffName}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
