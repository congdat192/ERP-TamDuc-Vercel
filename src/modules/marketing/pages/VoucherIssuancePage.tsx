import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoucherIssueTab } from '../components/voucher/VoucherIssueTab';
import { VoucherSettingsTab } from '../components/voucher/VoucherSettingsTab';
import { VoucherHistoryTab } from '../components/voucher/VoucherHistoryTab';

export function VoucherIssuancePage() {
  const [activeTab, setActiveTab] = useState('issue');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý Voucher</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="issue">Phát hành</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="issue" className="mt-6">
          <VoucherIssueTab />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <VoucherSettingsTab />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <VoucherHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
