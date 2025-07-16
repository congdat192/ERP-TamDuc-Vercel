import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Save, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBusiness } from '@/contexts/BusinessContext';
import { updateBusiness, uploadBusinessLogo } from '@/services/businessService';
import { BusinessLogoUpload } from '@/components/ui/business-logo-upload';
import { LoadingSpinner } from '@/components/ui/loading';

interface FormData {
  name: string;
  description: string;
  address: string;
  phone_number: string;
  email_address: string;
  website_url: string;
  tax_number: string;
}

export function GeneralSettings() {
  const { toast } = useToast();
  const { currentBusiness, refreshCurrentBusiness } = useBusiness();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    phone_number: '',
    email_address: '',
    website_url: '',
    tax_number: ''
  });

  // Load current business data
  useEffect(() => {
    if (currentBusiness) {
      setFormData({
        name: currentBusiness.name || '',
        description: currentBusiness.description || '',
        address: currentBusiness.address || '',
        phone_number: currentBusiness.phone_number || '',
        email_address: currentBusiness.email_address || '',
        website_url: currentBusiness.website_url || '',
        tax_number: currentBusiness.tax_number || ''
      });
    }
  }, [currentBusiness]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (file: File) => {
    setSelectedLogoFile(file);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Tên doanh nghiệp là bắt buộc',
        variant: 'destructive'
      });
      return false;
    }

    if (formData.email_address && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)) {
      toast({
        title: 'Lỗi',
        description: 'Email không đúng định dạng',
        variant: 'destructive'
      });
      return false;
    }

    if (formData.website_url && !/^https?:\/\/.+/.test(formData.website_url)) {
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
    if (!currentBusiness) {
      toast({
        title: 'Lỗi',
        description: 'Không tìm thấy thông tin doanh nghiệp',
        variant: 'destructive'
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let logoPath = currentBusiness.logo_path;

      // Upload logo first if there's a new one
      if (selectedLogoFile) {
        setIsUploadingLogo(true);
        const logoResponse = await uploadBusinessLogo(currentBusiness.id, selectedLogoFile);
        logoPath = logoResponse.logo_path;
        setIsUploadingLogo(false);
      }

      // Update business information
      await updateBusiness(currentBusiness.id, {
        ...formData,
        logo_path: logoPath
      });

      // Refresh business data
      await refreshCurrentBusiness();

      // Reset selected logo file
      setSelectedLogoFile(null);

      toast({
        title: 'Đã lưu thành công',
        description: 'Thông tin doanh nghiệp đã được cập nhật.'
      });
    } catch (error) {
      console.error('Error updating business:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsUploadingLogo(false);
    }
  };

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 theme-text">Đang tải thông tin doanh nghiệp...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold theme-text">Thông Tin Chung</h3>
          <p className="theme-text-muted">Cấu hình thông tin cơ bản của doanh nghiệp</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || isUploadingLogo}
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

      {/* Business Information */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Thông Tin Doanh Nghiệp</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Section */}
          <div className="space-y-4">
            <Label className="theme-text">Logo Doanh Nghiệp</Label>
            <BusinessLogoUpload
              currentLogoPath={currentBusiness.logo_path}
              businessName={currentBusiness.name}
              onLogoChange={handleLogoChange}
              isUploading={isUploadingLogo}
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="theme-text">
                Tên Doanh Nghiệp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên doanh nghiệp"
                className="voucher-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxNumber" className="theme-text">Mã Số Thuế</Label>
              <Input
                id="taxNumber"
                value={formData.tax_number}
                onChange={(e) => handleInputChange('tax_number', e.target.value)}
                placeholder="Nhập mã số thuế"
                className="voucher-input"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="theme-text">Số Điện Thoại</Label>
              <Input
                id="phoneNumber"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                placeholder="Nhập số điện thoại"
                className="voucher-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAddress" className="theme-text">Email</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.email_address}
                onChange={(e) => handleInputChange('email_address', e.target.value)}
                placeholder="Nhập email doanh nghiệp"
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
                placeholder="Nhập địa chỉ doanh nghiệp"
                className="voucher-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="websiteUrl" className="theme-text">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="websiteUrl"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
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
                placeholder="Mô tả về doanh nghiệp..."
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
