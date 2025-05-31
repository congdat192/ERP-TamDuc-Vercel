
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface VoucherCodeCustomizationProps {
  onSettingsChange?: (settings: {
    codeLength: number;
    prefix: string;
    suffix: string;
  }) => void;
}

export function VoucherCodeCustomization({ onSettingsChange }: VoucherCodeCustomizationProps) {
  const [codeLength, setCodeLength] = useState(8);
  const [prefix, setPrefix] = useState('VCH');
  const [suffix, setSuffix] = useState('');

  const handleChange = (field: string, value: string | number) => {
    const newSettings = {
      codeLength: field === 'codeLength' ? Number(value) : codeLength,
      prefix: field === 'prefix' ? String(value) : prefix,
      suffix: field === 'suffix' ? String(value) : suffix
    };

    if (field === 'codeLength') setCodeLength(Number(value));
    if (field === 'prefix') setPrefix(String(value));
    if (field === 'suffix') setSuffix(String(value));

    onSettingsChange?.(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Giao diện Mã Voucher</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="code-length">Độ dài mã voucher</Label>
            <Input
              id="code-length"
              type="number"
              min="4"
              max="20"
              value={codeLength}
              onChange={(e) => handleChange('codeLength', e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Từ 4-20 ký tự</p>
          </div>

          <div>
            <Label htmlFor="prefix">Ký tự đầu</Label>
            <Input
              id="prefix"
              type="text"
              placeholder="VCH"
              value={prefix}
              onChange={(e) => handleChange('prefix', e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Tiền tố mã voucher</p>
          </div>

          <div>
            <Label htmlFor="suffix">Ký tự cuối</Label>
            <Input
              id="suffix"
              type="text"
              placeholder="Tùy chọn"
              value={suffix}
              onChange={(e) => handleChange('suffix', e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Hậu tố mã voucher (tùy chọn)</p>
          </div>
        </div>

        <div className="p-3 bg-gray-50 border rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Ví dụ mã voucher:</span>{' '}
            <code className="bg-white px-2 py-1 rounded text-blue-600">
              {prefix}{"X".repeat(Math.max(1, codeLength - prefix.length - suffix.length))}{suffix}
            </code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
