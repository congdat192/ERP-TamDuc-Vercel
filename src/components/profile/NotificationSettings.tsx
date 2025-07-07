
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Phone, MessageSquare } from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface NotificationSettingsProps {
  user: UserType;
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [notifications, setNotifications] = useState({
    email: {
      marketing: true,
      security: true,
      voucher: true,
      system: true,
    },
    push: {
      marketing: false,
      security: true,
      voucher: true,
      system: true,
    },
    sms: {
      security: true,
      voucher: false,
      system: false,
    }
  });

  const handleToggle = (type: 'email' | 'push' | 'sms', category: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Thông Báo Email</span>
          </CardTitle>
          <CardDescription>
            Quản lý thông báo gửi qua email đến {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-marketing">Tin Tức & Khuyến Mãi</Label>
                <p className="text-sm text-gray-600">Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
              </div>
              <Switch
                id="email-marketing"
                checked={notifications.email.marketing}
                onCheckedChange={(value) => handleToggle('email', 'marketing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-security">Cảnh Báo Bảo Mật</Label>
                <p className="text-sm text-gray-600">Thông báo về hoạt động đăng nhập và thay đổi tài khoản</p>
              </div>
              <Switch
                id="email-security"
                checked={notifications.email.security}
                onCheckedChange={(value) => handleToggle('email', 'security', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-voucher">Voucher & Chiến Dịch</Label>
                <p className="text-sm text-gray-600">Cập nhật về voucher và các chiến dịch marketing</p>
              </div>
              <Switch
                id="email-voucher"
                checked={notifications.email.voucher}
                onCheckedChange={(value) => handleToggle('email', 'voucher', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-system">Thông Báo Hệ Thống</Label>
                <p className="text-sm text-gray-600">Cập nhật về bảo trì, sự cố và thay đổi hệ thống</p>
              </div>
              <Switch
                id="email-system"
                checked={notifications.email.system}
                onCheckedChange={(value) => handleToggle('email', 'system', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Thông Báo Đẩy</span>
          </CardTitle>
          <CardDescription>
            Quản lý thông báo đẩy trên trình duyệt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-marketing">Tin Tức & Khuyến Mãi</Label>
                <p className="text-sm text-gray-600">Thông báo về sản phẩm mới và ưu đãi</p>
              </div>
              <Switch
                id="push-marketing"
                checked={notifications.push.marketing}
                onCheckedChange={(value) => handleToggle('push', 'marketing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-security">Cảnh Báo Bảo Mật</Label>
                <p className="text-sm text-gray-600">Cảnh báo ngay lập tức về bảo mật</p>
              </div>
              <Switch
                id="push-security"
                checked={notifications.push.security}
                onCheckedChange={(value) => handleToggle('push', 'security', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-voucher">Voucher & Chiến Dịch</Label>
                <p className="text-sm text-gray-600">Thông báo về voucher mới và chiến dịch</p>
              </div>
              <Switch
                id="push-voucher"
                checked={notifications.push.voucher}
                onCheckedChange={(value) => handleToggle('push', 'voucher', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-system">Thông Báo Hệ Thống</Label>
                <p className="text-sm text-gray-600">Cập nhật hệ thống quan trọng</p>
              </div>
              <Switch
                id="push-system"
                checked={notifications.push.system}
                onCheckedChange={(value) => handleToggle('push', 'system', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Thông Báo SMS</span>
          </CardTitle>
          <CardDescription>
            Quản lý thông báo SMS {user.phone ? `đến ${user.phone}` : '(chưa có số điện thoại)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user.phone && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                Bạn cần cập nhật số điện thoại trong phần Thông Tin Cá Nhân để nhận SMS
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-security">Cảnh Báo Bảo Mật</Label>
                <p className="text-sm text-gray-600">SMS cảnh báo về hoạt động bất thường</p>
              </div>
              <Switch
                id="sms-security"
                checked={notifications.sms.security}
                onCheckedChange={(value) => handleToggle('sms', 'security', value)}
                disabled={!user.phone}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-voucher">Voucher Quan Trọng</Label>
                <p className="text-sm text-gray-600">SMS về voucher có giá trị cao</p>
              </div>
              <Switch
                id="sms-voucher"
                checked={notifications.sms.voucher}
                onCheckedChange={(value) => handleToggle('sms', 'voucher', value)}
                disabled={!user.phone}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-system">Sự Cố Hệ Thống</Label>
                <p className="text-sm text-gray-600">SMS về sự cố nghiêm trọng của hệ thống</p>
              </div>
              <Switch
                id="sms-system"
                checked={notifications.sms.system}
                onCheckedChange={(value) => handleToggle('sms', 'system', value)}
                disabled={!user.phone}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch Thông Báo</CardTitle>
          <CardDescription>
            Kiểm soát thời gian nhận thông báo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiet-hours">Giờ Yên Lặng</Label>
                <p className="text-sm text-gray-600">Không gửi thông báo từ 22:00 - 08:00</p>
              </div>
              <Switch id="quiet-hours" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekend-notifications">Thông Báo Cuối Tuần</Label>
                <p className="text-sm text-gray-600">Nhận thông báo vào thứ 7 và chủ nhật</p>
              </div>
              <Switch id="weekend-notifications" defaultChecked={false} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
