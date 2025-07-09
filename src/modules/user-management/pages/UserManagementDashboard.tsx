
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Shield, UserCog } from 'lucide-react';
import { MembersTab } from '../components/members/MembersTab';
import { DepartmentsTab } from '../components/departments/DepartmentsTab';
import { RolesTab } from '../components/roles/RolesTab';
import { GroupsTab } from '../components/groups/GroupsTab';

export function UserManagementDashboard() {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="space-y-6">
      {/* Page Header - Updated to use theme gradient */}
      <div className="theme-gradient rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản Lý Người Dùng</h1>
            <p className="text-white/90">
              Quản lý thành viên, phòng ban, vai trò và nhóm người dùng trong hệ thống ERP
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Overview - Updated to use theme colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Thành Viên</CardTitle>
            <Users className="w-4 h-4 theme-text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phòng Ban</CardTitle>
            <Building2 className="w-4 h-4 theme-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vai Trò</CardTitle>
            <Shield className="w-4 h-4 theme-text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhóm Người Dùng</CardTitle>
            <UserCog className="w-4 h-4 theme-text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs - Updated to use theme tab styling */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members" className="voucher-tabs-trigger flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Thành Viên</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="voucher-tabs-trigger flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Phòng Ban</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="voucher-tabs-trigger flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Vai Trò</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="voucher-tabs-trigger flex items-center space-x-2">
            <UserCog className="w-4 h-4" />
            <span>Nhóm</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersTab />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>

        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
