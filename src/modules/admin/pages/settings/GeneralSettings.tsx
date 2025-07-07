
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Globe, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GeneralSettings() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    currency: 'VND',
    taxCode: '',
    description: ''
  });

  const handleSave = () => {
    toast({
      title: 'Đã lưu thành công',
      description: 'Thông tin chung đã được cập nhật.'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold theme-text">Thông Tin Chung</h3>
          <p className="theme-text-muted">Cấu hình thông tin cơ bản của công ty và hệ thống</p>
        </div>
        <Button onClick={handleSave} className="theme-bg-primary text-white hover:opacity-90">
          <Save className="w-4 h-4 mr-2" />
          Lưu Thay Đổi
        </Button>
      </div>

      {/* Company Information */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Thông Tin Công Ty</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="theme-text">Tên Công Ty</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Nhập tên công ty"
                className="voucher-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCode" className="theme-text">Mã Số Thuế</Label>
              <Input
                id="taxCode"
                value={formData.taxCode}
                onChange={(e) => handleInputChange('taxCode', e.target.value)}
                placeholder="Nhập mã số thuế"
                className="voucher-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress" className="theme-text">Địa Chỉ</Label>
            <Input
              id="companyAddress"
              value={formData.companyAddress}
              onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              placeholder="Nhập địa chỉ công ty"
              className="voucher-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyPhone" className="theme-text">Số Điện Thoại</Label>
              <Input
                id="companyPhone"
                value={formData.companyPhone}
                onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                placeholder="Nhập số điện thoại"
                className="voucher-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail" className="theme-text">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                placeholder="Nhập email công ty"
                className="voucher-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="theme-text">Mô Tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả về công ty..."
              rows={3}
              className="voucher-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 theme-text-success" />
            <span className="theme-text">Cấu Hình Hệ Thống</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="theme-text">Múi Giờ</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger className="voucher-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</SelectItem>
                  <SelectItem value="Asia/Bangkok">Thái Lan (UTC+7)</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore (UTC+8)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="theme-text">Ngôn Ngữ</Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger className="voucher-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="theme-text">Đơn Vị Tiền Tệ</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger className="voucher-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
