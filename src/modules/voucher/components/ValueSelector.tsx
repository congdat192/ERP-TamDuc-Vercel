
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VoucherType } from '../types/campaign';

interface ValueSelectorProps {
  voucherType: VoucherType;
  value: number;
  valueType: 'fixed' | 'percentage';
  onChange: (value: number, valueType: 'fixed' | 'percentage') => void;
}

export function ValueSelector({ voucherType, value, valueType, onChange }: ValueSelectorProps) {
  const isVoucher = voucherType === 'voucher';
  
  // Enforce business logic: Voucher = fixed amount, Coupon = percentage
  const enforceValueType = isVoucher ? 'fixed' : 'percentage';
  
  const handleValueChange = (newValue: string) => {
    const numericValue = parseFloat(newValue) || 0;
    onChange(numericValue, enforceValueType);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Giá Trị</h3>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">
              {isVoucher 
                ? 'Mệnh Giá (VNĐ)' 
                : 'Phần Trăm Giảm Giá (%)'
              }
            </Label>
            <div className="relative">
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder={isVoucher ? 'Nhập mệnh giá voucher' : 'Nhập phần trăm giảm giá'}
                className="pr-12"
                min={isVoucher ? 1000 : 1}
                max={isVoucher ? undefined : 100}
                step={isVoucher ? 1000 : 1}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {isVoucher ? 'VNĐ' : '%'}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {isVoucher 
                ? 'Voucher sử dụng mệnh giá cố định (VNĐ)'
                : 'Coupon sử dụng tỷ lệ phần trăm giảm giá'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
