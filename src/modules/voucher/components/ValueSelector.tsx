
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VoucherType } from '../types/campaign';

interface ValueSelectorProps {
  voucherType: VoucherType;
  value: number;
  valueType: 'fixed' | 'percentage';
  onChange: (value: number, valueType: 'fixed' | 'percentage') => void;
}

export function ValueSelector({ voucherType, value, valueType, onChange }: ValueSelectorProps) {
  const isVoucher = voucherType === 'voucher';
  
  const handleValueChange = (newValue: string) => {
    const numericValue = parseFloat(newValue) || 0;
    onChange(numericValue, valueType);
  };

  const handleTypeChange = (newType: 'fixed' | 'percentage') => {
    onChange(value, newType);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Giá Trị</h3>
      <Card>
        <CardContent className="p-6 space-y-4">
          {!isVoucher && (
            <div className="space-y-2">
              <Label htmlFor="valueType">Loại Giá Trị</Label>
              <Select value={valueType} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại giá trị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Số Tiền Cố Định</SelectItem>
                  <SelectItem value="percentage">Phần Trăm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="value">
              {isVoucher 
                ? 'Mệnh Giá (VNĐ)' 
                : valueType === 'fixed' 
                  ? 'Số Tiền (VNĐ)' 
                  : 'Phần Trăm (%)'
              }
            </Label>
            <div className="relative">
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder={isVoucher ? 'Nhập mệnh giá' : valueType === 'fixed' ? 'Nhập số tiền' : 'Nhập phần trăm'}
                className="pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {isVoucher ? 'VNĐ' : valueType === 'fixed' ? 'VNĐ' : '%'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
