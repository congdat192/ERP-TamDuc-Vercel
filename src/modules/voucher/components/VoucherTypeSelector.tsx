
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
      <h3 className="text-lg font-semibold theme-text">Loại Voucher/Coupon</h3>
      <div className="grid grid-cols-2 gap-4">
        {voucherTypes.map((type) => (
          <Card 
            key={type}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value === type 
                ? 'berry-primary-light border-2 theme-border-primary' 
                : 'voucher-card hover:theme-border-primary/30'
            }`}
            onClick={() => onChange(type)}
          >
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <h4 className="font-medium theme-text">{VOUCHER_TYPE_LABELS[type]}</h4>
                {value === type && (
                  <Badge variant="secondary" className="theme-badge-primary">
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
