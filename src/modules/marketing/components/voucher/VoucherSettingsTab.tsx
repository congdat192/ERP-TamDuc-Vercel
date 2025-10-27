import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampaignSettings } from './settings/CampaignSettings';
import { TemplateSettings } from './settings/TemplateSettings';
import { CustomerTypeSettings } from './settings/CustomerTypeSettings';
import { SourceSettings } from './settings/SourceSettings';

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
        <TemplateSettings />
      </TabsContent>

      <TabsContent value="customer-types">
        <CustomerTypeSettings />
      </TabsContent>

      <TabsContent value="sources">
        <SourceSettings />
      </TabsContent>
    </Tabs>
  );
}
