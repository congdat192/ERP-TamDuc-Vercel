import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampaignSettings } from './settings/CampaignSettings';
import { TemplateSettings } from './settings/TemplateSettings';
import { CustomerTypeSettings } from './settings/CustomerTypeSettings';
import { SourceSettings } from './settings/SourceSettings';
import { VoucherImageSettings } from './settings/VoucherImageSettings';

export function VoucherSettingsTab() {
  return (
    <Tabs defaultValue="campaigns" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="campaigns">Chiến dịch</TabsTrigger>
        <TabsTrigger value="voucher-images">Ảnh Voucher</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="customer-types">Loại KH</TabsTrigger>
        <TabsTrigger value="sources">Nguồn</TabsTrigger>
      </TabsList>

      <TabsContent value="campaigns">
        <CampaignSettings />
      </TabsContent>

      <TabsContent value="voucher-images">
        <VoucherImageSettings />
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
