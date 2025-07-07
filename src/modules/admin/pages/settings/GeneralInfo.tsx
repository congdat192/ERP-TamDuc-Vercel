
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Save, Upload, Building2 } from 'lucide-react';
import { CompanySettings } from '../../types/settings';

export function GeneralInfo() {
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    slogan: '',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    currency: 'VND',
    dateFormat: 'dd/MM/yyyy'
  });

  const handleSave = () => {
    toast({
      title: "Đã Lưu Thành Công",
      description: "Thông tin công ty đã được cập nhật.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Thông Tin Chung</h2>
        <p className="text-gray-600">Quản lý thông tin cơ bản của công ty và hệ thống</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Thông Tin Công Ty</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Section */}
          <div className="space-y-4">
            <Label>Logo Công Ty</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                  {settings.name ? settings.name.charAt(0) : 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Tải Lên Logo
                </Button>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 2MB</p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Tên Công Ty</Label>
              <Input
                id="companyName"
                value={settings.name}
                onChange={(e) => setSettings({...settings, name: e.target.value})}
                placeholder="Nhập tên công ty"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan</Label>
              <Input
                id="slogan"
                value={settings.slogan}
                onChange={(e) => setSettings({...settings, slogan: e.target.value})}
                placeholder="Nhập slogan công ty"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Múi Giờ</Label>
              <Select value={settings.timezone} onValueChange={(value) => 
                setSettings({...settings, timezone: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</SelectItem>
                  <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Ngôn Ngữ</Label>
              <Select value={settings.language} onValueChange={(value) => 
                setSettings({...settings, language: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Đơn Vị Tiền Tệ</Label>
              <Select value={settings.currency} onValueChange={(value) => 
                setSettings({...settings, currency: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND (đ)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Định Dạng Ngày</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => 
                setSettings({...settings, dateFormat: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Lưu Thay Đổi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
