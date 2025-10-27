import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignSettings } from './settings/CampaignSettings';

export function VoucherSettingsTab() {
  return (
    <Tabs defaultValue="campaigns" className="w-full">
      <TabsList>
        <TabsTrigger value="campaigns">Chiến dịch</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="customer-types">Loại khách hàng</TabsTrigger>
        <TabsTrigger value="sources">Nguồn khách hàng</TabsTrigger>
      </TabsList>

      <TabsContent value="campaigns">
        <CampaignSettings />
      </TabsContent>

      <TabsContent value="templates">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý Template Voucher</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chức năng đang phát triển...</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="customer-types">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý Loại khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chức năng đang phát triển...</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sources">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý Nguồn khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chức năng đang phát triển...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
