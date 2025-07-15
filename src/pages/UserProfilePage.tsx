
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Lock, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { AccountPermissionsTab } from '@/components/profile/AccountPermissionsTab';

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
          <TabsList className="grid w-full grid-cols-3">
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
        </Tabs>
      </div>
    </div>
  );
}
