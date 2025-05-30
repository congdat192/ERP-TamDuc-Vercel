
import { useState } from 'react';
import { Bell, Mail, Smartphone, Monitor, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNotificationPreferences } from '@/hooks/useNotifications';
import { NotificationType } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';

const notificationTypes: { key: NotificationType; label: string; description: string }[] = [
  {
    key: 'system',
    label: 'Thông Báo Hệ Thống',
    description: 'Cập nhật hệ thống, bảo trì và thông báo quan trọng'
  },
  {
    key: 'user',
    label: 'Hoạt Động Người Dùng',
    description: 'Đăng ký mới, thay đổi thông tin người dùng'
  },
  {
    key: 'alert',
    label: 'Cảnh Báo',
    description: 'Cảnh báo về dung lượng, hiệu năng và các vấn đề khác'
  },
  {
    key: 'info',
    label: 'Thông Tin',
    description: 'Báo cáo, thống kê và thông tin chung'
  },
  {
    key: 'voucher',
    label: 'Voucher',
    description: 'Thông báo về việc tạo, sử dụng và quản lý voucher'
  },
  {
    key: 'security',
    label: 'Bảo Mật',
    description: 'Cảnh báo bảo mật, đăng nhập bất thường'
  }
];

export const NotificationPreferences = () => {
  const { preferences, updatePreferences } = useNotificationPreferences();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = (
    channel: 'emailNotifications' | 'pushNotifications' | 'inAppNotifications',
    type: NotificationType,
    enabled: boolean
  ) => {
    updatePreferences({
      [channel]: {
        ...preferences[channel],
        [type]: enabled
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    toast({
      title: "Cài Đặt Đã Được Lưu",
      description: "Tùy chọn thông báo của bạn đã được cập nhật thành công.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài Đặt Thông Báo</h2>
        <p className="text-muted-foreground">
          Quản lý cách bạn muốn nhận thông báo từ hệ thống.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Tùy Chọn Thông Báo</span>
          </CardTitle>
          <CardDescription>
            Chọn loại thông báo và kênh bạn muốn nhận thông tin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Channel Headers */}
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
            <div>Loại Thông Báo</div>
            <div className="flex items-center justify-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Smartphone className="w-4 h-4" />
              <span>Push</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Monitor className="w-4 h-4" />
              <span>Trong App</span>
            </div>
          </div>

          <Separator />

          {/* Notification Type Rows */}
          <div className="space-y-4">
            {notificationTypes.map((notType) => (
              <div key={notType.key} className="grid grid-cols-4 gap-4 items-center py-2">
                <div>
                  <Label htmlFor={`${notType.key}-label`} className="font-medium">
                    {notType.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{notType.description}</p>
                </div>
                
                <div className="flex justify-center">
                  <Switch
                    id={`${notType.key}-email`}
                    checked={preferences.emailNotifications[notType.key]}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange('emailNotifications', notType.key, checked)
                    }
                  />
                </div>
                
                <div className="flex justify-center">
                  <Switch
                    id={`${notType.key}-push`}
                    checked={preferences.pushNotifications[notType.key]}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange('pushNotifications', notType.key, checked)
                    }
                  />
                </div>
                
                <div className="flex justify-center">
                  <Switch
                    id={`${notType.key}-app`}
                    checked={preferences.inAppNotifications[notType.key]}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange('inAppNotifications', notType.key, checked)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Các thay đổi sẽ có hiệu lực ngay lập tức sau khi lưu.
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Đang Lưu...' : 'Lưu Cài Đặt'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hành Động Nhanh</CardTitle>
          <CardDescription>
            Các tùy chọn nhanh để quản lý thông báo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-sm font-medium">Tắt Tất Cả Email</Label>
              <p className="text-sm text-muted-foreground">Tạm thời tắt tất cả thông báo email</p>
            </div>
            <Switch
              checked={Object.values(preferences.emailNotifications).some(Boolean)}
              onCheckedChange={(checked) => {
                const newEmailPrefs = Object.keys(preferences.emailNotifications).reduce(
                  (acc, key) => ({ ...acc, [key]: checked }),
                  {}
                );
                updatePreferences({ emailNotifications: newEmailPrefs as any });
              }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-sm font-medium">Tắt Tất Cả Push</Label>
              <p className="text-sm text-muted-foreground">Tạm thời tắt tất cả thông báo push</p>
            </div>
            <Switch
              checked={Object.values(preferences.pushNotifications).some(Boolean)}
              onCheckedChange={(checked) => {
                const newPushPrefs = Object.keys(preferences.pushNotifications).reduce(
                  (acc, key) => ({ ...acc, [key]: checked }),
                  {}
                );
                updatePreferences({ pushNotifications: newPushPrefs as any });
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
