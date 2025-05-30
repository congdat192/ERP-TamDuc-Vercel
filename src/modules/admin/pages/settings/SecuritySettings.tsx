
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Save, Shield, Key, Clock } from 'lucide-react';
import { SecuritySettings as SecuritySettingsType } from '../../types/settings';

export function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettingsType>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    },
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    autoLogout: true
  });

  const handleSave = () => {
    toast({
      title: "Đã Lưu Thành Công",
      description: "Cài đặt bảo mật đã được cập nhật.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cài Đặt Bảo Mật</h2>
        <p className="text-gray-600">Quản lý chính sách bảo mật và xác thực</p>
      </div>

      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Chính Sách Mật Khẩu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minLength">Độ Dài Tối Thiểu</Label>
              <Input
                id="minLength"
                type="number"
                min="6"
                max="20"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    minLength: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Yêu Cầu Chữ Hoa</h4>
                <p className="text-sm text-gray-600">Mật khẩu phải có ít nhất 1 chữ hoa</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireUppercase}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    requireUppercase: checked
                  }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Yêu Cầu Số</h4>
                <p className="text-sm text-gray-600">Mật khẩu phải có ít nhất 1 số</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireNumbers}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    requireNumbers: checked
                  }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Yêu Cầu Ký Tự Đặc Biệt</h4>
                <p className="text-sm text-gray-600">Mật khẩu phải có ký tự đặc biệt (@, #, $, ...)</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireSpecialChars}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    requireSpecialChars: checked
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Xác Thực & Phiên Đăng Nhập</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Thời Gian Hết Phiên (phút)</Label>
              <Select 
                value={settings.sessionTimeout.toString()} 
                onValueChange={(value) => setSettings({
                  ...settings,
                  sessionTimeout: parseInt(value)
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 phút</SelectItem>
                  <SelectItem value="30">30 phút</SelectItem>
                  <SelectItem value="60">1 giờ</SelectItem>
                  <SelectItem value="120">2 giờ</SelectItem>
                  <SelectItem value="480">8 giờ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Số Lần Đăng Nhập Sai Tối Đa</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="3"
                max="10"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({
                  ...settings,
                  maxLoginAttempts: parseInt(e.target.value)
                })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Xác Thực Hai Bước (2FA)</h4>
                <p className="text-sm text-gray-600">Yêu cầu mã xác thực từ điện thoại</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  twoFactorAuth: checked
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Tự Động Đăng Xuất</h4>
                <p className="text-sm text-gray-600">Đăng xuất khi không hoạt động</p>
              </div>
              <Switch
                checked={settings.autoLogout}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  autoLogout: checked
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Cài Đặt
        </Button>
      </div>
    </div>
  );
}
