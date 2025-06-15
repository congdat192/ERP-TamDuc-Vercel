
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, MessageSquare, AlertTriangle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function NotificationsSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    systemAlerts: true,
    marketingEmails: false,
    frequency: 'immediate'
  });

  const handleSave = () => {
    toast({
      title: 'Đã lưu thành công',
      description: 'Cài đặt thông báo đã được cập nhật.'
    });
  };

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold theme-text">Cài Đặt Thông Báo</h3>
          <p className="theme-text-muted">Quản lý các thông báo của hệ thống</p>
        </div>
        <Button onClick={handleSave} className="theme-bg-primary text-white hover:opacity-90">
          <Save className="w-4 h-4 mr-2" />
          Lưu Thay Đổi
        </Button>
      </div>

      {/* Email Notifications */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Thông Báo Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="theme-text font-medium">Kích hoạt Email</Label>
              <p className="text-sm theme-text-muted">Nhận thông báo qua email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="theme-text font-medium">Email Marketing</Label>
              <p className="text-sm theme-text-muted">Nhận email khuyến mãi và tin tức</p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => handleToggle('marketingEmails', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="theme-text">Tần Suất Gửi Email</Label>
            <Select value={settings.frequency} onValueChange={(value) => setSettings(prev => ({ ...prev, frequency: value }))}>
              <SelectTrigger className="voucher-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Ngay lập tức</SelectItem>
                <SelectItem value="hourly">Mỗi giờ</SelectItem>
                <SelectItem value="daily">Hàng ngày</SelectItem>
                <SelectItem value="weekly">Hàng tuần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 theme-text-secondary" />
            <span className="theme-text">Thông Báo Push</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="theme-text font-medium">Push Notifications</Label>
              <p className="text-sm theme-text-muted">Thông báo trực tiếp trên trình duyệt</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="theme-text font-medium">SMS Notifications</Label>
              <p className="text-sm theme-text-muted">Thông báo qua tin nhắn SMS</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => handleToggle('smsNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 theme-text-warning" />
            <span className="theme-text">Cảnh Báo Hệ Thống</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="theme-text font-medium">Cảnh Báo Hệ Thống</Label>
              <p className="text-sm theme-text-muted">Thông báo về lỗi và sự cố hệ thống</p>
            </div>
            <Switch
              checked={settings.systemAlerts}
              onCheckedChange={(checked) => handleToggle('systemAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
