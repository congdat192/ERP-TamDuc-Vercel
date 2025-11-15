import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoucherIssueTab } from '../components/voucher/VoucherIssueTab';
import { VoucherReissueTab } from '../components/voucher/VoucherReissueTab';
import { VoucherSettingsTab } from '../components/voucher/VoucherSettingsTab';
import { VoucherHistoryTab } from '../components/voucher/VoucherHistoryTab';
import { CSKHReportTab } from '../components/voucher/CSKHReportTab';
import { usePermissions } from '@/hooks/usePermissions';

export function VoucherIssuancePage() {
  const [activeTab, setActiveTab] = useState('issue');
  const { hasFeatureAccess } = usePermissions();
  
  // Check permissions for each main tab
  const canIssueVouchers = hasFeatureAccess('issue_vouchers');
  const canReissueVouchers = hasFeatureAccess('view_reissue_vouchers') || 
                            hasFeatureAccess('create_reissue_vouchers');
  const canViewHistory = hasFeatureAccess('view_voucher_history');
  const canAccessSettings = hasFeatureAccess('manage_campaigns') ||
                            hasFeatureAccess('manage_voucher_images') ||
                            hasFeatureAccess('manage_voucher_templates') ||
                            hasFeatureAccess('manage_customer_types') ||
                            hasFeatureAccess('manage_voucher_sources');
  
  // Count visible tabs to set grid-cols dynamically
  const visibleTabs = [canIssueVouchers, canReissueVouchers, canAccessSettings, canViewHistory, true].filter(Boolean).length;

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-3xl" style={{ gridTemplateColumns: `repeat(${visibleTabs}, 1fr)` }}>
          {canIssueVouchers && <TabsTrigger value="issue">Phát hành</TabsTrigger>}
          {canReissueVouchers && <TabsTrigger value="reissue">Cấp lại</TabsTrigger>}
          {canAccessSettings && <TabsTrigger value="settings">Cài đặt</TabsTrigger>}
          {canViewHistory && <TabsTrigger value="history">Lịch sử</TabsTrigger>}
          <TabsTrigger value="report">Báo cáo</TabsTrigger>
        </TabsList>

        {canIssueVouchers && (
          <TabsContent value="issue" className="mt-3">
            <VoucherIssueTab />
          </TabsContent>
        )}

        {canReissueVouchers && (
          <TabsContent value="reissue" className="mt-3">
            <VoucherReissueTab />
          </TabsContent>
        )}

        {canAccessSettings && (
          <TabsContent value="settings" className="mt-3">
            <VoucherSettingsTab />
          </TabsContent>
        )}

        {canViewHistory && (
          <TabsContent value="history" className="mt-3">
            <VoucherHistoryTab />
          </TabsContent>
        )}

        <TabsContent value="report" className="mt-3">
          <CSKHReportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
