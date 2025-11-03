
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerInfoTab } from './detail-tabs/CustomerInfoTab';
import { CustomerSalesHistoryTab } from './detail-tabs/CustomerSalesHistoryTab';
import { CustomerDebtTab } from './detail-tabs/CustomerDebtTab';
import { CustomerPointsHistoryTab } from './detail-tabs/CustomerPointsHistoryTab';
import { CustomerVoucherTab } from './detail-tabs/CustomerVoucherTab';
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
  totalPoints?: number;
  totalSpent: number;
  totalDebt: number;
  status: string;
  gender: string;
  avatarUrl?: string;
  images?: any[];
  customerCode?: string;
}

interface CustomerDetailRowProps {
  customer: Customer;
  visibleColumnsCount: number;
}

export function CustomerDetailRow({ customer, visibleColumnsCount }: CustomerDetailRowProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [avatarHistory, setAvatarHistory] = useState<Array<{ avatar: string; createddate: string }>>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [voucherEligibilityData, setVoucherEligibilityData] = useState<any>(null);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [vouchersError, setVouchersError] = useState<string | null>(null);

  const fetchInvoicesData = async () => {
    if (!customer.phone) return;

    setIsLoadingInvoices(true);
    setInvoicesError(null);

    try {
      const { data, error } = await supabase.functions.invoke('get-invoices-by-phone', {
        body: { phone: customer.phone }
      });

      if (error) throw error;

      // Parse nested structure: data.data.data
      if (data?.data?.data) {
        setInvoicesData(data.data.data.invoices || []);
        setCustomerData(data.data.data.customer || null);
      } else {
        console.warn('[fetchInvoicesData] Unexpected response structure:', data);
        setInvoicesData([]);
        setCustomerData(null);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setInvoicesError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu hóa đơn');
      setInvoicesData([]);
      setCustomerData(null);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const fetchVoucherEligibility = async () => {
    if (!customer.phone) return;

    setIsLoadingVouchers(true);
    setVouchersError(null);

    try {
      // Use query params instead of body for GET request
      const params = new URLSearchParams({ phone: customer.phone });
      const { data, error } = await supabase.functions.invoke(
        `check-voucher-eligibility?${params.toString()}`
      );

      if (error) throw error;

      setVoucherEligibilityData(data);
    } catch (err) {
      console.error('Error fetching voucher eligibility:', err);
      setVouchersError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu voucher');
    } finally {
      setIsLoadingVouchers(false);
    }
  };

  const fetchCustomerData = async () => {
    if (!customer.phone) return;

    try {
      const { data, error } = await supabase.functions.invoke('get-customer-by-phone', {
        body: { phone: customer.phone }
      });

      if (error) throw error;

      // Parse nested structure: data.data.data.avatar_history
      if (data?.data?.data?.avatar_history) {
        setAvatarHistory(data.data.data.avatar_history);
      }
    } catch (err) {
      console.error('Error fetching customer avatar history:', err);
      setAvatarHistory([]);
    }
  };

  useEffect(() => {
    fetchInvoicesData();
    fetchVoucherEligibility();
    fetchCustomerData();
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
                  Lịch sử
                </TabsTrigger>
                <TabsTrigger 
                  value="debt"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Nợ cần thu
                </TabsTrigger>
                <TabsTrigger 
                  value="points-history"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Lịch sử tích điểm
                </TabsTrigger>
                <TabsTrigger 
                  value="voucher"
                  className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                >
                  Voucher
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
                  totalPoints={customer.totalPoints}
                />
              </TabsContent>

              <TabsContent value="voucher" className="mt-0">
                <CustomerVoucherTab 
                  customerPhone={customer.phone}
                  voucherData={voucherEligibilityData}
                  isLoading={isLoadingVouchers}
                  error={vouchersError}
                  onRefresh={fetchVoucherEligibility}
                />
              </TabsContent>

              <TabsContent value="interaction-history" className="mt-0">
                <CustomerInteractionHistoryTab customerId={customer.id} />
              </TabsContent>

              <TabsContent value="images" className="mt-0">
                <CustomerImagesTab 
                  invoices={invoicesData}
                  avatarHistory={avatarHistory}
                  isLoading={isLoadingInvoices}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </td>
    </tr>
  );
}
