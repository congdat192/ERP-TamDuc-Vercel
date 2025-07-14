
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Lock, Shield, Bell, Activity, Key, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { NotificationSettings } from '@/components/profile/NotificationSettings';
import { AccountPermissionsTab } from '@/components/profile/AccountPermissionsTab';
import { AuditTrailTab } from '@/components/profile/AuditTrailTab';

export function UserProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không thể tải thông tin người dùng</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Quay Lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay Lại</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Cá Nhân</h1>
            <p className="text-gray-600">Quản lý thông tin tài khoản và cài đặt của bạn</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Thông Tin</span>
            </TabsTrigger>
            <TabsTrigger value="account-permissions" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Phân Quyền</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Mật Khẩu</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Bảo Mật</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Thông Báo</span>
            </TabsTrigger>
            <TabsTrigger value="audit-trail" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Lịch Sử</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <UserProfileForm user={currentUser} />
          </TabsContent>

          <TabsContent value="account-permissions">
            <AccountPermissionsTab user={currentUser} isOwnProfile={true} />
          </TabsContent>

          <TabsContent value="password">
            <ChangePasswordForm />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings user={currentUser} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings user={currentUser} />
          </TabsContent>

          <TabsContent value="audit-trail">
            <AuditTrailTab user={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
