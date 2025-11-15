import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";
import { CustomerInfoTab } from "./detail-tabs/CustomerInfoTab";
import { CustomerSalesHistoryTab } from "./detail-tabs/CustomerSalesHistoryTab";
import { CustomerDebtTab } from "./detail-tabs/CustomerDebtTab";
import { CustomerPointsHistoryTab } from "./detail-tabs/CustomerPointsHistoryTab";
import { CustomerVoucherTab } from "./detail-tabs/CustomerVoucherTab";
import { CustomerInteractionHistoryTab } from "./detail-tabs/CustomerInteractionHistoryTab";
import { CustomerImagesTab } from "./detail-tabs/CustomerImagesTab";
import { CustomerRelatedTab } from "./detail-tabs/CustomerRelatedTab";

interface FullScreenCustomerDetailProps {
  customer: any;
  onClose: () => void;
}

type TabKey = 'info' | 'sales' | 'debt' | 'points' | 'voucher' | 'interaction' | 'images' | 'related';

interface TabConfig {
  key: TabKey;
  emoji: string;
  label: string;
  component: React.ComponentType<any>;
}

const TABS: TabConfig[] = [
  { key: 'info', emoji: '👤', label: 'Thông tin', component: CustomerInfoTab },
  { key: 'sales', emoji: '🛒', label: 'Lịch sử mua hàng', component: CustomerSalesHistoryTab },
  { key: 'debt', emoji: '💰', label: 'Công nợ', component: CustomerDebtTab },
  { key: 'points', emoji: '⭐', label: 'Lịch sử tích điểm', component: CustomerPointsHistoryTab },
  { key: 'voucher', emoji: '🎫', label: 'Voucher', component: CustomerVoucherTab },
  { key: 'interaction', emoji: '💬', label: 'Lịch sử tương tác', component: CustomerInteractionHistoryTab },
  { key: 'images', emoji: '🖼️', label: 'Hình ảnh', component: CustomerImagesTab },
  { key: 'related', emoji: '👥', label: 'Người thân', component: CustomerRelatedTab },
];

export function FullScreenCustomerDetail({ customer, onClose }: FullScreenCustomerDetailProps) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // API data
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [avatarHistory, setAvatarHistory] = useState<Array<{ avatar: string; createddate: string }>>([]);
  const [interactionHistory, setInteractionHistory] = useState<Array<any>>([]);
  const [voucherEligibilityData, setVoucherEligibilityData] = useState<any>(null);

  // Loading states
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  // Error states
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [vouchersError, setVouchersError] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Data fetching functions
  const fetchInvoicesData = async () => {
    if (!customer.phone) return;

    setIsLoadingInvoices(true);
    setInvoicesError(null);

    try {
      const { data, error } = await supabase.functions.invoke('get-invoices-by-phone', {
        body: { phone: customer.phone }
      });

      if (error) throw error;

      if (data?.data?.data) {
        setInvoicesData(data.data.data.invoices || []);
        setCustomerData(data.data.data.customer || null);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setInvoicesError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu hóa đơn');
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const fetchVoucherEligibility = async () => {
    if (!customer.phone) return;

    setIsLoadingVouchers(true);
    setVouchersError(null);

    try {
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

      const customerData = data?.data?.data;
      if (customerData) {
        setAvatarHistory(customerData.avatar_history || []);
        setInteractionHistory(customerData.customer_interaction_history || []);
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
    }
  };

  const handleRefresh = () => {
    console.log('[FullScreenCustomerDetail] Refreshing tab:', activeTab);
    
    switch (activeTab) {
      case 'sales':
      case 'images':
        // Sales và Images tab dùng chung invoices data
        fetchInvoicesData();
        break;
        
      case 'voucher':
        fetchVoucherEligibility();
        break;
        
      case 'related':
        // Related tab sẽ refresh via trigger
        setRefreshTrigger(prev => prev + 1);
        break;
        
      case 'info':
      case 'interaction':
        // Info và Interaction tab dùng customer data
        fetchCustomerData();
        break;
        
      case 'debt':
      case 'points':
        // Các tabs này load data từ DB trực tiếp, không cần refresh
        break;
        
      default:
        // Fallback: refresh all data
        fetchInvoicesData();
        fetchVoucherEligibility();
        fetchCustomerData();
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchInvoicesData();
    fetchVoucherEligibility();
    fetchCustomerData();
  }, [customer.phone]);

  const handleBack = () => {
    if (activeTab) {
      setActiveTab(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header with Gradient */}
      <div className="flex-shrink-0 bg-gradient-to-r from-[hsl(var(--berry-primary-500))] to-[hsl(var(--berry-primary-700))] text-primary-foreground">
        {/* Compact Header (when showing tab content) */}
        {activeTab ? (
          <div className="px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary-foreground/20 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-primary-foreground">
              <AvatarFallback className="text-sm font-semibold bg-primary-foreground text-primary">
                {getInitials(customer.customerName || "KH")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{customer.customerName}</div>
              <div className="text-xs opacity-90 truncate">{customer.customerCode} • 📱 {customer.phone}</div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="text-primary-foreground hover:bg-primary-foreground/20 flex-shrink-0"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          // Full Header (when showing tabs list)
          <div className="px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary-foreground/20 mb-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="w-14 h-14 border-2 border-primary-foreground shadow-lg">
                <AvatarFallback className="text-lg font-bold bg-primary-foreground text-primary">
                  {getInitials(customer.customerName || "KH")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-xl font-bold mb-1">{customer.customerName}</h1>
                <p className="text-sm opacity-90">{customer.customerCode} • 📱 {customer.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab ? (
          // Tab Content View
          <div className="p-4">
            {activeTab === 'info' && (
              <CustomerInfoTab customer={customer} />
            )}
            
            {activeTab === 'sales' && (
              <CustomerSalesHistoryTab 
                invoices={invoicesData}
                customer={customerData}
                isLoading={isLoadingInvoices}
                error={invoicesError}
              />
            )}
            
            {activeTab === 'debt' && (
              <CustomerDebtTab 
                customerId={customer.id}
                customerDebt={customer.totalDebt}
              />
            )}
            
            {activeTab === 'points' && (
              <CustomerPointsHistoryTab 
                customerId={customer.id}
                currentPoints={customer.points}
                totalPoints={customer.totalPoints}
              />
            )}
            
            {activeTab === 'voucher' && (
              <CustomerVoucherTab 
                customerPhone={customer.phone}
                voucherData={voucherEligibilityData}
                isLoading={isLoadingVouchers}
                error={vouchersError}
                onRefresh={fetchVoucherEligibility}
              />
            )}
            
            {activeTab === 'interaction' && (
              <CustomerInteractionHistoryTab 
                customerId={customer.id}
                interactionHistory={interactionHistory}
              />
            )}
            
            {activeTab === 'images' && (
              <CustomerImagesTab 
                invoices={invoicesData}
                avatarHistory={avatarHistory}
                isLoading={isLoadingInvoices}
              />
            )}
            
            {activeTab === 'related' && (
              <CustomerRelatedTab 
                customer={customer}
                currentUser={currentUser}
                refreshTrigger={refreshTrigger}
              />
            )}
          </div>
        ) : (
          // Tabs List View
          <div className="p-4 space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="w-full flex items-center gap-4 p-4 bg-card hover:bg-accent border border-border rounded-lg transition-all duration-200 active:scale-[0.98] min-h-[56px]"
              >
                <span className="text-2xl flex-shrink-0">{tab.emoji}</span>
                <span className="flex-1 text-left font-medium text-foreground">{tab.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
