
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Key, AlertTriangle } from 'lucide-react';
import { User, UserSecuritySettings } from '@/types/auth';

interface UserSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSecurityUpdated: (userId: string, settings: UserSecuritySettings) => void;
}

export function UserSecurityModal({ isOpen, onClose, user, onSecurityUpdated }: UserSecurityModalProps) {
  const [settings, setSettings] = useState<UserSecuritySettings>({
    twoFactorEnabled: false,
    loginAttemptLimit: 3,
    passwordChangeRequired: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(user.securitySettings);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSecurityUpdated(user.id, settings);
    } catch (error) {
      console.error('Error updating security settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettingChange = (field: keyof UserSecuritySettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Cài Đặt Bảo Mật - {user.fullName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Xác Thực Hai Yếu Tố (2FA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="twoFactorEnabled"
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', !!checked)}
                />
                <Label htmlFor="twoFactorEnabled" className="text-sm">
                  Bật xác thực hai yếu tố cho tài khoản này
                </Label>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Khi bật, người dùng sẽ cần nhập mã xác thực từ ứng dụng authenticator khi đăng nhập.
              </p>
            </CardContent>
          </Card>

          {/* Login Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Bảo Mật Đăng Nhập
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginAttemptLimit">Giới hạn số lần đăng nhập sai</Label>
                <Select 
                  value={settings.loginAttemptLimit.toString()} 
                  onValueChange={(value) => handleSettingChange('loginAttemptLimit', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 lần</SelectItem>
                    <SelectItem value="5">5 lần</SelectItem>
                    <SelectItem value="7">7 lần</SelectItem>
                    <SelectItem value="10">10 lần</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  Tài khoản sẽ bị khóa tạm thời sau số lần đăng nhập sai này.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="passwordChangeRequired"
                  checked={settings.passwordChangeRequired}
                  onCheckedChange={(checked) => handleSettingChange('passwordChangeRequired', !!checked)}
                />
                <Label htmlFor="passwordChangeRequired" className="text-sm">
                  Yêu cầu thay đổi mật khẩu khi đăng nhập lần tiếp theo
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Security Warning */}
          {(settings.twoFactorEnabled !== user.securitySettings.twoFactorEnabled ||
            settings.loginAttemptLimit !== user.securitySettings.loginAttemptLimit ||
            settings.passwordChangeRequired !== user.securitySettings.passwordChangeRequired) && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Cảnh báo thay đổi bảo mật</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Những thay đổi này sẽ ảnh hưởng đến cách người dùng đăng nhập và sử dụng hệ thống. 
                      Vui lòng thông báo cho người dùng về các thay đổi này.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập Nhật Cài Đặt'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
