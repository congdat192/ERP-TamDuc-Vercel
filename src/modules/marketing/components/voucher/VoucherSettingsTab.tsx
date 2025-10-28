import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { CampaignSettings } from './settings/CampaignSettings';
import { TemplateSettings } from './settings/TemplateSettings';
import { CustomerTypeSettings } from './settings/CustomerTypeSettings';
import { SourceSettings } from './settings/SourceSettings';
import { VoucherImageSettings } from './settings/VoucherImageSettings';
import { usePermissions } from '@/hooks/usePermissions';

export function VoucherSettingsTab() {
  const { hasFeatureAccess } = usePermissions();
  
  // Check permissions for each sub-tab
  const canManageCampaigns = hasFeatureAccess('manage_campaigns');
  const canManageImages = hasFeatureAccess('manage_voucher_images');
  const canManageTemplates = hasFeatureAccess('manage_voucher_templates');
  const canManageCustomerTypes = hasFeatureAccess('manage_customer_types');
  const canManageSources = hasFeatureAccess('manage_voucher_sources');
  
  // Count visible sub-tabs
  const visibleSubTabs = [
    canManageCampaigns,
    canManageImages,
    canManageTemplates,
    canManageCustomerTypes,
    canManageSources
  ].filter(Boolean).length;
  
  // If no permissions, show message
  if (visibleSubTabs === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Bạn không có quyền truy cập tab Cài đặt.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Determine default tab (first available)
  const defaultTab = canManageCampaigns ? 'campaigns' :
                     canManageImages ? 'voucher-images' :
                     canManageTemplates ? 'templates' :
                     canManageCustomerTypes ? 'customer-types' : 'sources';
  
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className={`grid w-full grid-cols-${visibleSubTabs}`}>
        {canManageCampaigns && <TabsTrigger value="campaigns">Chiến dịch</TabsTrigger>}
        {canManageImages && <TabsTrigger value="voucher-images">Ảnh Voucher</TabsTrigger>}
        {canManageTemplates && <TabsTrigger value="templates">Templates</TabsTrigger>}
        {canManageCustomerTypes && <TabsTrigger value="customer-types">Loại KH</TabsTrigger>}
        {canManageSources && <TabsTrigger value="sources">Nguồn</TabsTrigger>}
      </TabsList>

      {canManageCampaigns && (
        <TabsContent value="campaigns">
          <CampaignSettings />
        </TabsContent>
      )}
      
      {canManageImages && (
        <TabsContent value="voucher-images">
          <VoucherImageSettings />
        </TabsContent>
      )}
      
      {canManageTemplates && (
        <TabsContent value="templates">
          <TemplateSettings />
        </TabsContent>
      )}
      
      {canManageCustomerTypes && (
        <TabsContent value="customer-types">
          <CustomerTypeSettings />
        </TabsContent>
      )}
      
      {canManageSources && (
        <TabsContent value="sources">
          <SourceSettings />
        </TabsContent>
      )}
    </Tabs>
  );
}
