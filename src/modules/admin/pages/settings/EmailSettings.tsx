
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Save, Mail, Send, TestTube } from 'lucide-react';
import { EmailSettings as EmailSettingsType } from '../../types/settings';

export function EmailSettings() {
  const [settings, setSettings] = useState<EmailSettingsType>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@company.com',
    fromName: 'VoucherCRM',
    notifications: {
      enabled: true,
      voucherExpiry: true,
      newCustomer: false,
      systemAlerts: true
    }
  });

  const handleSave = () => {
    toast({
      title: "Đã Lưu Thành Công",
      description: "Cài đặt email đã được cập nhật.",
    });
  };

  const handleTestEmail = () => {
    toast({
      title: "Email Test Đã Gửi",
      description: "Vui lòng kiểm tra hộp thư đến của bạn.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cài Đặt Email</h2>
        <p className="text-gray-600">Quản lý cấu hình SMTP và thông báo email</p>
      </div>

      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Cấu Hình SMTP</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={settings.smtpPort}
                onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
                placeholder="587"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={settings.smtpUser}
                onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                placeholder="your-email@gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email Gửi</Label>
              <Input
                id="fromEmail"
                value={settings.fromEmail}
                onChange={(e) => setSettings({...settings, fromEmail: e.target.value})}
                placeholder="noreply@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fromName">Tên Người Gửi</Label>
              <Input
                id="fromName"
                value={settings.fromName}
                onChange={(e) => setSettings({...settings, fromName: e.target.value})}
                placeholder="VoucherCRM"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleTestEmail} variant="outline">
              <TestTube className="w-4 h-4 mr-2" />
              Gửi Email Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Thông Báo Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Kích Hoạt Thông Báo Email</h4>
              <p className="text-sm text-gray-600">Bật/tắt tất cả thông báo email</p>
            </div>
            <Switch
              checked={settings.notifications.enabled}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings, 
                  notifications: {...settings.notifications, enabled: checked}
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Cảnh Báo Voucher Hết Hạn</h4>
              <p className="text-sm text-gray-600">Thông báo khi voucher sắp hết hạn</p>
            </div>
            <Switch
              checked={settings.notifications.voucherExpiry}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings, 
                  notifications: {...settings.notifications, voucherExpiry: checked}
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Khách Hàng Mới</h4>
              <p className="text-sm text-gray-600">Thông báo khi có khách hàng mới</p>
            </div>
            <Switch
              checked={settings.notifications.newCustomer}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings, 
                  notifications: {...settings.notifications, newCustomer: checked}
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Cảnh Báo Hệ Thống</h4>
              <p className="text-sm text-gray-600">Thông báo lỗi và cảnh báo hệ thống</p>
            </div>
            <Switch
              checked={settings.notifications.systemAlerts}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings, 
                  notifications: {...settings.notifications, systemAlerts: checked}
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Mẫu Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voucherTemplate">Mẫu Email Phát Hành Voucher</Label>
            <Textarea
              id="voucherTemplate"
              placeholder="Chào [CUSTOMER_NAME], bạn đã nhận được voucher..."
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiryTemplate">Mẫu Email Cảnh Báo Hết Hạn</Label>
            <Textarea
              id="expiryTemplate"
              placeholder="Voucher của bạn sắp hết hạn..."
              rows={4}
            />
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
