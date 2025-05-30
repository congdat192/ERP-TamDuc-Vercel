
import { useState } from 'react';
import { Shield, Clock, AlertTriangle, Monitor, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SessionTimeoutDialog } from '@/components/ui/session-timeout-dialog';
import { TwoFactorAuthManager } from '@/components/ui/two-factor-auth';
import { SecurityAlerts } from '@/components/ui/security-alerts';
import { LoginHistory } from '@/components/ui/login-history';
import { SessionManager } from '@/components/ui/session-manager';
import { useSecurity, useSessionTimeout } from '@/hooks/useSecurity';
import { User } from '@/types/auth';

interface SecuritySettingsProps {
  currentUser: User;
  onLogout: () => void;
}

export const SecuritySettings = ({ currentUser, onLogout }: SecuritySettingsProps) => {
  const {
    sessions,
    loginAttempts,
    securityAlerts,
    twoFactorAuth,
    terminateSession,
    markAlertAsRead,
    enable2FA,
    disable2FA,
    generateNewBackupCodes
  } = useSecurity();

  const { sessionState, resetSession } = useSessionTimeout(
    currentUser.securitySettings.sessionTimeoutMinutes
  );

  const unreadAlertsCount = securityAlerts.filter(alert => !alert.isRead).length;
  const recentFailedAttempts = loginAttempts.filter(
    attempt => !attempt.success && 
    new Date().getTime() - attempt.timestamp.getTime() < 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cài Đặt Bảo Mật</h1>
          <p className="text-gray-600 mt-2">
            Quản lý bảo mật tài khoản và giám sát hoạt động đăng nhập
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadAlertsCount > 0 && (
            <Badge variant="destructive">
              {unreadAlertsCount} cảnh báo mới
            </Badge>
          )}
          {recentFailedAttempts > 0 && (
            <Badge variant="secondary">
              {recentFailedAttempts} lần thất bại 24h
            </Badge>
          )}
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${
                twoFactorAuth.enabled ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Shield className={`w-5 h-5 ${
                  twoFactorAuth.enabled ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium">Xác Thực 2 Bước</p>
                <p className={`text-xs ${
                  twoFactorAuth.enabled ? 'text-green-600' : 'text-red-600'
                }`}>
                  {twoFactorAuth.enabled ? 'Đã Kích Hoạt' : 'Chưa Kích Hoạt'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-blue-100">
                <Monitor className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Phiên Hoạt Động</p>
                <p className="text-xs text-blue-600">
                  {sessions.filter(s => new Date() < s.expiresAt).length} phiên
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${
                unreadAlertsCount > 0 ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  unreadAlertsCount > 0 ? 'text-orange-600' : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium">Cảnh Báo</p>
                <p className={`text-xs ${
                  unreadAlertsCount > 0 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {unreadAlertsCount > 0 ? `${unreadAlertsCount} mới` : 'Không có'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${
                recentFailedAttempts > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <History className={`w-5 h-5 ${
                  recentFailedAttempts > 0 ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium">Đăng Nhập Thất Bại</p>
                <p className={`text-xs ${
                  recentFailedAttempts > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {recentFailedAttempts > 0 ? `${recentFailedAttempts} lần 24h` : 'Không có'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="2fa" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="2fa">Xác Thực 2 Bước</TabsTrigger>
          <TabsTrigger value="sessions">Quản Lý Phiên</TabsTrigger>
          <TabsTrigger value="alerts">Cảnh Báo</TabsTrigger>
          <TabsTrigger value="history">Lịch Sử</TabsTrigger>
          <TabsTrigger value="settings">Cài Đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="2fa" className="space-y-6">
          <TwoFactorAuthManager
            twoFactorAuth={twoFactorAuth}
            onEnable2FA={enable2FA}
            onDisable2FA={disable2FA}
            onGenerateNewCodes={generateNewBackupCodes}
          />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <SessionManager
            sessions={sessions}
            onTerminateSession={terminateSession}
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <SecurityAlerts
            alerts={securityAlerts}
            onMarkAsRead={markAlertAsRead}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <LoginHistory attempts={loginAttempts} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Cài Đặt Phiên</span>
              </CardTitle>
              <CardDescription>
                Cấu hình thời gian hết hạn phiên và các tùy chọn bảo mật khác
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Thời Gian Hết Hạn Phiên:</span>
                    <p>{currentUser.securitySettings.sessionTimeoutMinutes} phút</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Giới Hạn Đăng Nhập Thất Bại:</span>
                    <p>{currentUser.securitySettings.loginAttemptLimit} lần</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Xác Thực 2 Bước:</span>
                    <p>{currentUser.securitySettings.twoFactorEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Yêu Cầu Đổi Mật Khẩu:</span>
                    <p>{currentUser.securitySettings.passwordChangeRequired ? 'Có' : 'Không'}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Khuyến Nghị Bảo Mật</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Kích hoạt xác thực 2 bước để tăng cường bảo mật</li>
                    <li>• Sử dụng mật khẩu mạnh và duy nhất</li>
                    <li>• Đăng xuất khỏi các thiết bị không sử dụng</li>
                    <li>• Kiểm tra định kỳ lịch sử đăng nhập</li>
                    <li>• Cập nhật thông tin liên hệ để nhận cảnh báo bảo mật</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Session Timeout Dialog */}
      <SessionTimeoutDialog
        sessionState={sessionState}
        onExtendSession={resetSession}
        onLogout={onLogout}
      />
    </div>
  );
};
