import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, Lock, UserCheck, AlertTriangle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SecuritySettings() {
  const { toast } = useToast();
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiration: 90,
    preventPasswordReuse: 5
  });

  const [loginSettings, setLoginSettings] = useState({
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 60,
    requireMFA: false,
    allowRememberMe: true,
    allowMultipleSessions: false
  });

  const [ipRestrictions, setIpRestrictions] = useState({
    enableIpRestriction: false,
    allowedIps: '192.168.1.1, 10.0.0.1',
    blockForeignIps: true
  });

  const handleSavePasswordPolicy = () => {
    toast({
      title: 'Đã lưu thành công',
      description: 'Chính sách mật khẩu đã được cập nhật.'
    });
  };

  const handleSaveLoginSettings = () => {
    toast({
      title: 'Đã lưu thành công',
      description: 'Cài đặt đăng nhập đã được cập nhật.'
    });
  };

  const handleSaveIpRestrictions = () => {
    toast({
      title: 'Đã lưu thành công',
      description: 'Giới hạn IP đã được cập nhật.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Cài Đặt Bảo Mật</h3>
          <p className="text-gray-600">Quản lý các cài đặt bảo mật và quyền truy cập hệ thống</p>
        </div>
      </div>

      <Tabs defaultValue="password-policy">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="password-policy">Chính Sách Mật Khẩu</TabsTrigger>
          <TabsTrigger value="login-settings">Cài Đặt Đăng Nhập</TabsTrigger>
          <TabsTrigger value="ip-restrictions">Giới Hạn IP</TabsTrigger>
        </TabsList>

        {/* Password Policy Tab */}
        <TabsContent value="password-policy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-blue-600" />
                <span>Chính Sách Mật Khẩu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minLength">Độ dài tối thiểu</Label>
                  <Input
                    id="minLength"
                    type="number"
                    min={6}
                    max={20}
                    value={passwordPolicy.minLength}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, minLength: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500">Số ký tự tối thiểu cho mật khẩu</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiration">Thời hạn mật khẩu (ngày)</Label>
                  <Input
                    id="passwordExpiration"
                    type="number"
                    min={0}
                    max={365}
                    value={passwordPolicy.passwordExpiration}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, passwordExpiration: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500">0 = không hết hạn</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preventPasswordReuse">Không cho phép sử dụng lại</Label>
                  <Input
                    id="preventPasswordReuse"
                    type="number"
                    min={0}
                    max={10}
                    value={passwordPolicy.preventPasswordReuse}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, preventPasswordReuse: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500">Số lượng mật khẩu cũ không được sử dụng lại</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Yêu cầu độ phức tạp</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase" className="cursor-pointer">Chữ hoa (A-Z)</Label>
                    <Switch
                      id="requireUppercase"
                      checked={passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => setPasswordPolicy(prev => ({ ...prev, requireUppercase: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireLowercase" className="cursor-pointer">Chữ thường (a-z)</Label>
                    <Switch
                      id="requireLowercase"
                      checked={passwordPolicy.requireLowercase}
                      onCheckedChange={(checked) => setPasswordPolicy(prev => ({ ...prev, requireLowercase: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers" className="cursor-pointer">Số (0-9)</Label>
                    <Switch
                      id="requireNumbers"
                      checked={passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => setPasswordPolicy(prev => ({ ...prev, requireNumbers: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars" className="cursor-pointer">Ký tự đặc biệt (!@#$%^&*)</Label>
                    <Switch
                      id="requireSpecialChars"
                      checked={passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => setPasswordPolicy(prev => ({ ...prev, requireSpecialChars: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSavePasswordPolicy} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Chính Sách
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login Settings Tab */}
        <TabsContent value="login-settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>Cài Đặt Đăng Nhập</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min={1}
                    max={10}
                    value={loginSettings.maxLoginAttempts}
                    onChange={(e) => setLoginSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500">Số lần thử đăng nhập trước khi khóa tài khoản</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Thời gian khóa (phút)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    min={5}
                    max={1440}
                    value={loginSettings.lockoutDuration}
                    onChange={(e) => setLoginSettings(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500">Thời gian khóa tài khoản sau khi đăng nhập sai nhiều lần</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min={5}
                    max={1440}
                    value={loginSettings.sessionTimeout}
                    onChange={(e) => setLoginSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-500">Thời gian không hoạt động trước khi đăng xuất tự động</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Tùy chọn xác thực</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireMFA" className="cursor-pointer">Yêu cầu xác thực 2 lớp (MFA)</Label>
                    <Switch
                      id="requireMFA"
                      checked={loginSettings.requireMFA}
                      onCheckedChange={(checked) => setLoginSettings(prev => ({ ...prev, requireMFA: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowRememberMe" className="cursor-pointer">Cho phép "Ghi nhớ đăng nhập"</Label>
                    <Switch
                      id="allowRememberMe"
                      checked={loginSettings.allowRememberMe}
                      onCheckedChange={(checked) => setLoginSettings(prev => ({ ...prev, allowRememberMe: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowMultipleSessions" className="cursor-pointer">Cho phép nhiều phiên đăng nhập</Label>
                    <Switch
                      id="allowMultipleSessions"
                      checked={loginSettings.allowMultipleSessions}
                      onCheckedChange={(checked) => setLoginSettings(prev => ({ ...prev, allowMultipleSessions: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveLoginSettings} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IP Restrictions Tab */}
        <TabsContent value="ip-restrictions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Giới Hạn IP</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableIpRestriction"
                  checked={ipRestrictions.enableIpRestriction}
                  onCheckedChange={(checked) => setIpRestrictions(prev => ({ ...prev, enableIpRestriction: checked }))}
                />
                <Label htmlFor="enableIpRestriction" className="font-medium">Bật giới hạn IP</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedIps">Danh sách IP được phép</Label>
                <Input
                  id="allowedIps"
                  placeholder="Nhập các địa chỉ IP, phân cách bằng dấu phẩy"
                  value={ipRestrictions.allowedIps}
                  onChange={(e) => setIpRestrictions(prev => ({ ...prev, allowedIps: e.target.value }))}
                  disabled={!ipRestrictions.enableIpRestriction}
                />
                <p className="text-xs text-gray-500">Nhập các địa chỉ IP hoặc dải IP được phép truy cập (ví dụ: 192.168.1.1, 10.0.0.0/24)</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="blockForeignIps"
                  checked={ipRestrictions.blockForeignIps}
                  onCheckedChange={(checked) => setIpRestrictions(prev => ({ ...prev, blockForeignIps: checked }))}
                  disabled={!ipRestrictions.enableIpRestriction}
                />
                <Label htmlFor="blockForeignIps">Chặn IP nước ngoài</Label>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Lưu ý quan trọng</h4>
                    <p className="text-sm text-yellow-700">
                      Cấu hình giới hạn IP không chính xác có thể khiến bạn bị khóa khỏi hệ thống. 
                      Đảm bảo bạn đã thêm IP hiện tại của mình vào danh sách được phép.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveIpRestrictions} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
