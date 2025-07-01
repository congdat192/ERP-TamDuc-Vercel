
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Lock, Key, AlertTriangle, Save, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SecuritySettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: false,
    auditLog: true,
    encryptionLevel: 'high'
  });

  const handleSave = () => {
    toast({
      title: 'Đã lưu thành công',
      description: 'Cài đặt bảo mật đã được cập nhật.'
    });
  };

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold theme-text">Cài Đặt Bảo Mật</h3>
          <p className="theme-text-muted">Quản lý các cài đặt bảo mật và quyền truy cập</p>
        </div>
        <Button onClick={handleSave} className="voucher-button-primary">
          <Save className="w-4 h-4 mr-2" />
          Lưu Thay Đổi
        </Button>
      </div>

      {/* Authentication Settings */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Xác Thực & Đăng Nhập</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="theme-text font-medium">Xác thực 2 yếu tố (2FA)</Label>
              <p className="text-sm theme-text-muted">Bắt buộc xác thực 2 yếu tố cho tất cả người dùng</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => handleToggle('twoFactorAuth', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="theme-text">Thời gian hết hạn mật khẩu (ngày)</Label>
              <Input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                className="voucher-input"
              />
            </div>
            <div className="space-y-2">
              <Label className="theme-text">Số lần đăng nhập sai tối đa</Label>
              <Input
                type="number"
                value={settings.loginAttempts}
                onChange={(e) => setSettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                className="voucher-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 theme-text-secondary" />
            <span className="theme-text">Kiểm Soát Truy Cập</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="theme-text font-medium">Whitelist IP</Label>
              <p className="text-sm theme-text-muted">Chỉ cho phép truy cập từ IP được phép</p>
            </div>
            <Switch
              checked={settings.ipWhitelist}
              onCheckedChange={(checked) => handleToggle('ipWhitelist', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 theme-text-success" />
            <span className="theme-text">Bảo Vệ Dữ Liệu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="theme-text font-medium">Audit Log</Label>
              <p className="text-sm theme-text-muted">Ghi lại tất cả hoạt động của người dùng</p>
            </div>
            <Switch
              checked={settings.auditLog}
              onCheckedChange={(checked) => handleToggle('auditLog', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="theme-text">Mức độ mã hóa</Label>
            <Select value={settings.encryptionLevel} onValueChange={(value) => setSettings(prev => ({ ...prev, encryptionLevel: value }))}>
              <SelectTrigger className="voucher-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (AES-128)</SelectItem>
                <SelectItem value="high">High (AES-256)</SelectItem>
                <SelectItem value="enterprise">Enterprise (AES-256 + HSM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Alert */}
      <Card className="theme-card border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800">Khuyến nghị bảo mật</h4>
              <p className="text-sm text-orange-700 mt-1">
                Để đảm bảo bảo mật tốt nhất, hãy bật xác thực 2 yếu tố và cấu hình whitelist IP cho các tài khoản quan trọng.
              </p>
              <Button variant="outline" size="sm" className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-100">
                Xem hướng dẫn bảo mật
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
