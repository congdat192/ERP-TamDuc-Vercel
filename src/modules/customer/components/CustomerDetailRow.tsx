
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerInfoTab } from './detail-tabs/CustomerInfoTab';
import { CustomerSalesHistoryTab } from './detail-tabs/CustomerSalesHistoryTab';
import { CustomerDebtTab } from './detail-tabs/CustomerDebtTab';
import { CustomerPointsHistoryTab } from './detail-tabs/CustomerPointsHistoryTab';

interface Customer {
  id: string;
  name: string;
  phone: string;
  group: string;
  birthday: string;
  creator: string;
  createdDate: string;
  note: string;
  email: string;
  facebook: string;
  company: string;
  taxCode: string;
  address: string;
  deliveryArea: string;
  points: number;
  totalSpent: number;
  totalDebt: number;
  status: string;
}

interface CustomerDetailRowProps {
  customer: Customer;
  visibleColumnsCount: number;
}

export function CustomerDetailRow({ customer, visibleColumnsCount }: CustomerDetailRowProps) {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <tr>
      <td colSpan={visibleColumnsCount + 2} className="p-0">
        <div className="border-t theme-border-primary/20">
          <div className="p-6 theme-background">
            {/* Simplified Header - only customer name and actions */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold theme-text">{customer.name}</h3>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="theme-border-primary hover:theme-bg-primary/10"
                >
                  Chỉnh sửa
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Ngừng hoạt động
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 theme-background">
                <TabsTrigger 
                  value="info"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Thông tin
                </TabsTrigger>
                <TabsTrigger 
                  value="sales-history"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Lịch sử bán/trả hàng
                </TabsTrigger>
                <TabsTrigger 
                  value="debt"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Nợ cần thu từ khách
                </TabsTrigger>
                <TabsTrigger 
                  value="points-history"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Lịch sử tích điểm
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-6">
                <CustomerInfoTab customer={customer} />
              </TabsContent>

              <TabsContent value="sales-history" className="mt-6">
                <CustomerSalesHistoryTab customerId={customer.id} />
              </TabsContent>

              <TabsContent value="debt" className="mt-6">
                <CustomerDebtTab customerId={customer.id} />
              </TabsContent>

              <TabsContent value="points-history" className="mt-6">
                <CustomerPointsHistoryTab customerId={customer.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </td>
    </tr>
  );
}
