import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Save, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';

interface FormData {
  companyName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxNumber: string;
}

export function GeneralSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    companyName: 'Hệ Thống ERP',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    taxNumber: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.companyName.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Tên công ty là bắt buộc',
        variant: 'destructive'
      });
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: 'Lỗi',
        description: 'Email không đúng định dạng',
        variant: 'destructive'
      });
      return false;
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      toast({
        title: 'Lỗi',
        description: 'Website URL phải bắt đầu bằng http:// hoặc https://',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Save settings to local storage for single-tenant
      localStorage.setItem('company_settings', JSON.stringify(formData));

      toast({
        title: 'Đã lưu thành công',
        description: 'Thông tin công ty đã được cập nhật.'
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold theme-text">Thông Tin Chung</h3>
          <p className="theme-text-muted">Cấu hình thông tin cơ bản của công ty</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="theme-bg-primary text-white hover:opacity-90"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu Thay Đổi
            </>
          )}
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
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="theme-text">
                Tên Công Ty <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Nhập tên công ty"
                className="voucher-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxNumber" className="theme-text">Mã Số Thuế</Label>
              <Input
                id="taxNumber"
                value={formData.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                placeholder="Nhập mã số thuế"
                className="voucher-input"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="theme-text">Số Điện Thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                className="voucher-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="theme-text">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập email công ty"
                className="voucher-input"
              />
            </div>
          </div>

          {/* Address and Website */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="theme-text">Địa Chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Nhập địa chỉ công ty"
                className="voucher-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="theme-text">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.example.com"
                  className="voucher-input pl-10"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
