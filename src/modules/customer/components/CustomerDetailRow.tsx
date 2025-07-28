
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerInfoTab } from './detail-tabs/CustomerInfoTab';
import { CustomerSalesHistoryTab } from './detail-tabs/CustomerSalesHistoryTab';
import { CustomerDebtTab } from './detail-tabs/CustomerDebtTab';
import { CustomerPointsHistoryTab } from './detail-tabs/CustomerPointsHistoryTab';
import { CustomerVoucherHistoryTab } from './detail-tabs/CustomerVoucherHistoryTab';
import { CustomerInteractionHistoryTab } from './detail-tabs/CustomerInteractionHistoryTab';
import { CustomerImagesTab } from './detail-tabs/CustomerImagesTab';

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
  gender: string; // Thêm trường giới tính
  images?: any[]; // Thêm mảng hình ảnh
}

interface CustomerDetailRowProps {
  customer: Customer;
  visibleColumnsCount: number;
}

export function CustomerDetailRow({ customer, visibleColumnsCount }: CustomerDetailRowProps) {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={visibleColumnsCount + 2} className="p-0">
        <div className="border-2 border-solid theme-border-primary bg-white/80 rounded-lg mx-2 my-1 shadow-sm">
          <div className="p-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-7 max-w-5xl mb-6">
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
                <TabsTrigger 
                  value="voucher-history"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Lịch sử voucher
                </TabsTrigger>
                <TabsTrigger 
                  value="interaction-history"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Lịch sử tương tác
                </TabsTrigger>
                <TabsTrigger 
                  value="images"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Hình ảnh
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-0">
                <CustomerInfoTab customer={customer} />
              </TabsContent>

              <TabsContent value="sales-history" className="mt-0">
                <CustomerSalesHistoryTab customerId={customer.id} />
              </TabsContent>

              <TabsContent value="debt" className="mt-0">
                <CustomerDebtTab customerId={customer.id} />
              </TabsContent>

              <TabsContent value="points-history" className="mt-0">
                <CustomerPointsHistoryTab customerId={customer.id} />
              </TabsContent>

              <TabsContent value="voucher-history" className="mt-0">
                <CustomerVoucherHistoryTab customerId={customer.id} />
              </TabsContent>

              <TabsContent value="interaction-history" className="mt-0">
                <CustomerInteractionHistoryTab customerId={customer.id} />
              </TabsContent>

              <TabsContent value="images" className="mt-0">
                <CustomerImagesTab 
                  customerId={customer.id} 
                  images={customer.images || []} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </td>
    </tr>
  );
}
