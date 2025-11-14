
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerInfoTab } from './detail-tabs/CustomerInfoTab';
import { CustomerSalesHistoryTab } from './detail-tabs/CustomerSalesHistoryTab';
import { CustomerDebtTab } from './detail-tabs/CustomerDebtTab';
import { CustomerPointsHistoryTab } from './detail-tabs/CustomerPointsHistoryTab';
import { CustomerVoucherTab } from './detail-tabs/CustomerVoucherTab';
import { CustomerInteractionHistoryTab } from './detail-tabs/CustomerInteractionHistoryTab';
import { CustomerImagesTab } from './detail-tabs/CustomerImagesTab';
import { CustomerRelatedTab } from './detail-tabs/CustomerRelatedTab';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, User, ShoppingCart, Wallet, Star, Ticket, MessageSquare, Image, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('info');
  const [showTabsList, setShowTabsList] = useState(true);
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [avatarHistory, setAvatarHistory] = useState<Array<{ avatar: string; createddate: string }>>([]);
  const [interactionHistory, setInteractionHistory] = useState<Array<any>>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [voucherEligibilityData, setVoucherEligibilityData] = useState<any>(null);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [vouchersError, setVouchersError] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (isMobile) {
      setShowTabsList(false);
    }
  };

  const handleBackToList = () => {
    setShowTabsList(true);
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'NA';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const tabs = [
    { value: 'info', label: 'Thông tin', icon: User },
    { value: 'sales-history', label: 'Lịch sử mua hàng', icon: ShoppingCart },
    { value: 'debt', label: 'Công nợ', icon: Wallet },
    { value: 'points-history', label: 'Lịch sử tích điểm', icon: Star },
    { value: 'voucher', label: 'Voucher', icon: Ticket },
    { value: 'interaction-history', label: 'Lịch sử tương tác', icon: MessageSquare },
    { value: 'images', label: 'Hình ảnh', icon: Image },
    { value: 'related', label: 'Người thân', icon: Users },
  ];

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

      // Parse nested structure
      const customerData = data?.data?.data;
      if (customerData) {
        setAvatarHistory(customerData.avatar_history || []);
        setInteractionHistory(customerData.customer_interaction_history || []);
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setAvatarHistory([]);
      setInteractionHistory([]);
    }
  };

  useEffect(() => {
    fetchInvoicesData();
    fetchVoucherEligibility();
    fetchCustomerData();
  }, [customer.phone]);

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={visibleColumnsCount + 2} className={cn(
        "p-0",
        isMobile && "!block !w-screen !max-w-full overflow-x-hidden"
      )}>
        <div className={cn(
          "border-2 border-solid theme-border-primary bg-white/80 rounded-lg shadow-sm",
          isMobile ? "mx-0 my-1 max-w-full" : "mx-2 my-1"
        )}>
          {/* Mobile Header - Compact when viewing tab detail */}
          {isMobile && !showTabsList && (
            <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleBackToList}
                  className="text-white hover:bg-white/20 h-10 w-10 flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="w-12 h-12 border-2 border-white shadow-md flex-shrink-0">
                  <AvatarImage src={customer.avatarUrl} />
                  <AvatarFallback className="bg-white/20 text-white text-sm">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">{customer.name}</h3>
                  <p className="text-xs opacity-90 truncate">{customer.customerCode || customer.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Header - Full when viewing tabs list */}
          {isMobile && showTabsList && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg rounded-t-lg">
              <div className="flex items-center gap-3">
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg flex-shrink-0">
                  <AvatarImage src={customer.avatarUrl} />
                  <AvatarFallback className="bg-white/20 text-white text-lg">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{customer.name}</h3>
                  <p className="text-sm opacity-90 truncate">{customer.customerCode || customer.id}</p>
                  <p className="text-sm opacity-90 truncate">{customer.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold theme-text">Chi tiết khách hàng</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchInvoicesData}
                  disabled={isLoadingInvoices}
                  className="gap-2"
                >
                  <RefreshCw className={cn("w-4 h-4", isLoadingInvoices && "animate-spin")} />
                  Làm mới
                </Button>
              </div>
            </div>
          )}

          <div className={cn("p-0", !isMobile && "px-6 pb-6")}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              {isMobile && showTabsList ? (
                // Mobile: Vertical list navigation
                <div className="space-y-2 p-4 bg-gray-50">
                  {tabs.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleTabChange(value)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all min-h-[56px]",
                        activeTab === value
                          ? "bg-white border-l-4 border-l-primary shadow-md"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn(
                          "w-5 h-5 flex-shrink-0",
                          activeTab === value ? "text-primary" : "text-gray-600"
                        )} />
                        <span className={cn(
                          "text-base text-left",
                          activeTab === value ? "font-semibold text-primary" : "font-medium text-gray-700"
                        )}>
                          {label}
                        </span>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 flex-shrink-0",
                        activeTab === value ? "text-primary" : "text-gray-400"
                      )} />
                    </button>
                  ))}
                </div>
              ) : !isMobile ? (
                // Desktop: Horizontal tabs
                <TabsList className="grid w-full grid-cols-8 max-w-6xl mb-6">
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
                  <TabsTrigger 
                    value="related"
                    className="data-[state=active]:theme-bg-primary data-[state=active]:text-white"
                  >
                    Người thân
                  </TabsTrigger>
                </TabsList>
              ) : null}

              {(!isMobile || !showTabsList) && (
                <>
                  <TabsContent value="info" className="mt-0 sm:mt-0 p-4 sm:p-0">
                    <CustomerInfoTab customer={customer} />
                  </TabsContent>

                  <TabsContent value="sales-history" className="mt-0 sm:mt-0 p-4 sm:p-0">
                    <CustomerSalesHistoryTab 
                      invoices={invoicesData}
                      customer={customerData}
                      isLoading={isLoadingInvoices}
                      error={invoicesError}
                    />
                  </TabsContent>

                  <TabsContent value="debt" className="mt-0 sm:mt-0 p-4 sm:p-0">
                    <CustomerDebtTab 
                      customerId={customer.id}
                      customerDebt={customer.totalDebt}
                    />
                  </TabsContent>

                  <TabsContent value="points-history" className="mt-0 sm:mt-0 p-4 sm:p-0">
                    <CustomerPointsHistoryTab 
                      customerId={customer.id}
                      currentPoints={customer.points}
                      totalPoints={customer.totalPoints}
                    />
                  </TabsContent>

                  <TabsContent value="voucher" className="mt-0 sm:mt-0 p-4 sm:p-0">
                    <CustomerVoucherTab 
                      customerPhone={customer.phone}
                      voucherData={voucherEligibilityData}
                      isLoading={isLoadingVouchers}
                      error={vouchersError}
                      onRefresh={fetchVoucherEligibility}
                    />
                  </TabsContent>

                  <TabsContent value="interaction-history" className="mt-0 sm:mt-0 p-4 sm:p-0">
                    <CustomerInteractionHistoryTab 
                      customerId={customer.id}
                      interactionHistory={interactionHistory}
                    />
                  </TabsContent>

                  <TabsContent value="images" className="mt-0 sm:mt-0 p-4 sm:p-0">
                    <CustomerImagesTab 
                      invoices={invoicesData}
                      avatarHistory={avatarHistory}
                      isLoading={isLoadingInvoices}
                    />
                  </TabsContent>

                  <TabsContent value="related" className="mt-0 sm:mt-0 p-4 sm:p-0">
                    <CustomerRelatedTab 
                      customer={customer}
                      currentUser={currentUser}
                    />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </td>
    </tr>
  );
}
