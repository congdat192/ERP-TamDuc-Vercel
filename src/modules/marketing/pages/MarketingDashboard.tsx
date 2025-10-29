
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import { CustomerListTab } from '../components/tabs/CustomerListTab';
import { CustomerFilterTab } from '../components/tabs/CustomerFilterTab';
import { SavedFiltersTab } from '../components/tabs/SavedFiltersTab';
import { MarketingCampaignsTab } from '../components/tabs/MarketingCampaignsTab';
import { useAuth } from '@/components/auth/AuthContext';

export function MarketingDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('customers');
  
  const hasVoucherModule = currentUser?.permissions.modules.includes('voucher');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold theme-text">Marketing</h1>
        {hasVoucherModule && (
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
        <TabsList className="grid w-full grid-cols-4 max-w-4xl">
          <TabsTrigger 
            value="customers"
            className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
          >
            Khách hàng
          </TabsTrigger>
          <TabsTrigger 
            value="filter"
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
          <TabsTrigger 
            value="campaigns"
            className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
          >
            Chiến dịch Marketing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="mt-6">
          <CustomerListTab />
        </TabsContent>

        <TabsContent value="filter" className="mt-6">
          <CustomerFilterTab />
        </TabsContent>

        <TabsContent value="saved-filters" className="mt-6">
          <SavedFiltersTab />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <MarketingCampaignsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
