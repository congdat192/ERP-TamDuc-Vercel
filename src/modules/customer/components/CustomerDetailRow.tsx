
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerInfoTab } from './detail-tabs/CustomerInfoTab';
import { CustomerSalesHistoryTab } from './detail-tabs/CustomerSalesHistoryTab';
import { CustomerDebtTab } from './detail-tabs/CustomerDebtTab';
import { CustomerPointsHistoryTab } from './detail-tabs/CustomerPointsHistoryTab';
import { CustomerVoucherHistoryTab } from './detail-tabs/CustomerVoucherHistoryTab';
import { CustomerInteractionHistoryTab } from './detail-tabs/CustomerInteractionHistoryTab';
import { CustomerImagesTab } from './detail-tabs/CustomerImagesTab';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  gender: string;
  images?: any[];
  customerCode?: string; // Add this
}

interface CustomerDetailRowProps {
  customer: Customer;
  visibleColumnsCount: number;
}

export function CustomerDetailRow({ customer, visibleColumnsCount }: CustomerDetailRowProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);

  const fetchInvoicesData = async () => {
    if (!customer.phone) {
      console.warn('[CustomerDetailRow] No phone number provided');
      return;
    }

    setIsLoadingInvoices(true);
    setInvoicesError(null);
    
    try {
      console.log('[CustomerDetailRow] Fetching invoices for phone:', customer.phone);
      
      const { data, error } = await supabase.functions.invoke('get-invoices-by-phone', {
        body: { phone: customer.phone }
      });

      if (error) {
        console.error('[CustomerDetailRow] Error:', error);
        setInvoicesError('Không thể tải lịch sử hóa đơn');
        return;
      }

      if (data?.success && data?.data?.data?.invoices) {
        setInvoicesData(data.data.data.invoices);
        setCustomerData(data.data.data.customer);
        console.log('[CustomerDetailRow] Loaded invoices:', data.data.data.invoices.length);
      } else {
        setInvoicesData([]);
        setCustomerData(null);
      }
    } catch (err) {
      console.error('[CustomerDetailRow] Exception:', err);
      setInvoicesError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  useEffect(() => {
    fetchInvoicesData();
  }, [customer.phone]);

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={visibleColumnsCount + 2} className="p-0">
        <div className="border-2 border-solid theme-border-primary bg-white/80 rounded-lg mx-2 my-1 shadow-sm">
          <div className="p-6">
            {/* Header with refresh button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold theme-text">Chi tiết khách hàng</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInvoicesData}
                disabled={isLoadingInvoices}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingInvoices ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>

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
                <CustomerSalesHistoryTab 
                  invoices={invoicesData}
                  customer={customerData}
                  isLoading={isLoadingInvoices}
                  error={invoicesError}
                />
              </TabsContent>

              <TabsContent value="debt" className="mt-0">
                <CustomerDebtTab 
                  customerId={customer.id}
                  customerDebt={customer.totalDebt}
                />
              </TabsContent>

              <TabsContent value="points-history" className="mt-0">
                <CustomerPointsHistoryTab 
                  customerId={customer.id}
                  currentPoints={customer.points}
                />
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
