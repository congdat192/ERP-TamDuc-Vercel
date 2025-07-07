
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Lock, Shield, Bell, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { NotificationSettings } from '@/components/profile/NotificationSettings';
import { ActivityHistory } from '@/components/profile/ActivityHistory';

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

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentUser.fullName}</CardTitle>
                <CardDescription className="text-base">
                  {currentUser.email} • {currentUser.role === 'erp-admin' ? 'Quản Trị ERP' : 'Người Dùng'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Thông Tin</span>
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
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Hoạt Động</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <UserProfileForm user={currentUser} />
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

          <TabsContent value="activity">
            <ActivityHistory user={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
