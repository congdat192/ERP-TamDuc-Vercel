
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoucherType, VOUCHER_TYPE_LABELS } from '../types/campaign';

interface VoucherTypeSelectorProps {
  value: VoucherType;
  onChange: (value: VoucherType) => void;
}

export function VoucherTypeSelector({ value, onChange }: VoucherTypeSelectorProps) {
  const voucherTypes: VoucherType[] = ['voucher', 'coupon'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Loại Voucher/Coupon</h3>
      <div className="grid grid-cols-2 gap-4">
        {voucherTypes.map((type) => (
          <Card 
            key={type}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value === type 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onChange(type)}
          >
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">{VOUCHER_TYPE_LABELS[type]}</h4>
                {value === type && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Đã chọn
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
