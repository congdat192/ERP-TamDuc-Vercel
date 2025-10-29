
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import { CustomerListTab } from '../components/tabs/CustomerListTab';
import { CustomerFilterTab } from '../components/tabs/CustomerFilterTab';
import { SavedFiltersTab } from '../components/tabs/SavedFiltersTab';
import { MarketingCampaignsTab } from '../components/tabs/MarketingCampaignsTab';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';

export function MarketingDashboard() {
  const navigate = useNavigate();
  const { hasFeatureAccess, hasFullAccess } = usePermissions();
  const [activeTab, setActiveTab] = useState('customers');
  
  // PHASE 4: TAB-LEVEL PERMISSIONS - Check features thay vì modules
  const canViewCustomers = hasFullAccess() || hasFeatureAccess('view_customers');
  const canViewFilters = hasFullAccess() || hasFeatureAccess('view_customer_filters');
  const canViewCampaigns = hasFullAccess() || hasFeatureAccess('view_campaigns');
  const hasVoucherAccess = hasFullAccess() || hasFeatureAccess('view_vouchers');
  
  // Calculate visible tabs count for grid-cols
  const visibleTabsCount = [
    canViewCustomers,
    canViewFilters,
    canViewFilters, // saved filters
    canViewCampaigns
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold theme-text">Marketing</h1>
        {hasVoucherAccess && (
          <Button 
            onClick={() => navigate('/ERP/Marketing/voucher')}
            variant="outline"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Quản lý Voucher
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn(
          "grid w-full max-w-4xl",
          visibleTabsCount === 4 && "grid-cols-4",
          visibleTabsCount === 3 && "grid-cols-3",
          visibleTabsCount === 2 && "grid-cols-2",
          visibleTabsCount === 1 && "grid-cols-1"
        )}>
          {canViewCustomers && (
            <TabsTrigger 
              value="customers"
              className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
            >
              Khách hàng
            </TabsTrigger>
          )}
          {canViewFilters && (
            <>
              <TabsTrigger 
                value="filters"
                className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
              >
                Bộ lọc khách hàng
              </TabsTrigger>
              <TabsTrigger 
                value="saved-filters"
                className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
              >
                Bộ lọc đã lưu
              </TabsTrigger>
            </>
          )}
          {canViewCampaigns && (
            <TabsTrigger 
              value="campaigns"
              className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
            >
              Chiến dịch Marketing
            </TabsTrigger>
          )}
        </TabsList>

        {canViewCustomers && (
          <TabsContent value="customers" className="mt-6">
            <CustomerListTab />
          </TabsContent>
        )}

        {canViewFilters && (
          <>
            <TabsContent value="filters" className="mt-6">
              <CustomerFilterTab />
            </TabsContent>

            <TabsContent value="saved-filters" className="mt-6">
              <SavedFiltersTab />
            </TabsContent>
          </>
        )}

        {canViewCampaigns && (
          <TabsContent value="campaigns" className="mt-6">
            <MarketingCampaignsTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
