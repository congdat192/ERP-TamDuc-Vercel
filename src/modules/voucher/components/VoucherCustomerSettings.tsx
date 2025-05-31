
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield } from 'lucide-react';

interface VoucherCustomerSettingsProps {
  onSettingsChange?: (settings: {
    expiryCheck: boolean;
    eligibilityCondition: string;
    customerStatus: string;
    preventDuplicates: boolean;
  }) => void;
}

export function VoucherCustomerSettings({ onSettingsChange }: VoucherCustomerSettingsProps) {
  const [expiryCheck, setExpiryCheck] = useState(true);
  const [eligibilityCondition, setEligibilityCondition] = useState('all');
  const [customerStatus, setCustomerStatus] = useState('all');
  const [preventDuplicates, setPreventDuplicates] = useState(true);

  const handleChange = (field: string, value: boolean | string) => {
    const newSettings = {
      expiryCheck: field === 'expiryCheck' ? Boolean(value) : expiryCheck,
      eligibilityCondition: field === 'eligibilityCondition' ? String(value) : eligibilityCondition,
      customerStatus: field === 'customerStatus' ? String(value) : customerStatus,
      preventDuplicates: field === 'preventDuplicates' ? Boolean(value) : preventDuplicates
    };

    if (field === 'expiryCheck') setExpiryCheck(Boolean(value));
    if (field === 'eligibilityCondition') setEligibilityCondition(String(value));
    if (field === 'customerStatus') setCustomerStatus(String(value));
    if (field === 'preventDuplicates') setPreventDuplicates(Boolean(value));

    onSettingsChange?.(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Voucher Customer Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="expiry-check">Kiểm tra hạn sử dụng</Label>
              <p className="text-sm text-gray-600">Chỉ phát hành voucher còn hiệu lực</p>
            </div>
            <Switch 
              id="expiry-check" 
              checked={expiryCheck}
              onCheckedChange={(checked) => handleChange('expiryCheck', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="prevent-duplicates">Ngăn chặn trùng lặp</Label>
              <p className="text-sm text-gray-600">Khách hàng chỉ nhận voucher này một lần</p>
            </div>
            <Switch 
              id="prevent-duplicates" 
              checked={preventDuplicates}
              onCheckedChange={(checked) => handleChange('preventDuplicates', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eligibility-condition">Điều kiện khách hàng</Label>
            <Select value={eligibilityCondition} onValueChange={(value) => handleChange('eligibilityCondition', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn điều kiện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khách hàng</SelectItem>
                <SelectItem value="new">Chỉ khách hàng mới</SelectItem>
                <SelectItem value="returning">Khách hàng quay lại</SelectItem>
                <SelectItem value="vip">Khách hàng VIP</SelectItem>
                <SelectItem value="birthday">Sinh nhật khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customer-status">Trạng thái khách hàng</Label>
            <Select value={customerStatus} onValueChange={(value) => handleChange('customerStatus', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="loyal">Khách hàng thân thiết</SelectItem>
                <SelectItem value="premium">Khách hàng cao cấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Lưu ý điều kiện phát hành</p>
              <p className="text-xs text-amber-700 mt-1">
                Các điều kiện này sẽ được kiểm tra trước khi phát hành voucher cho khách hàng.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
