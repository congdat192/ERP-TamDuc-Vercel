import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBack = () => {
    if (activeTab) {
      setActiveTab(null);
    } else {
      onClose();
    }
  };

  const activeTabConfig = TABS.find(t => t.key === activeTab);
  const ActiveTabComponent = activeTabConfig?.component;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header with Gradient */}
      <div className="flex-shrink-0 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
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
              <div className="text-xs opacity-90 truncate">{customer.customerCode}</div>
            </div>
          </div>
        ) : (
          // Full Header (when showing tabs list)
          <div className="px-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary-foreground/20 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-4 mb-3">
              <Avatar className="w-16 h-16 border-3 border-primary-foreground shadow-lg">
                <AvatarFallback className="text-xl font-bold bg-primary-foreground text-primary">
                  {getInitials(customer.customerName || "KH")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{customer.customerName}</h1>
                <p className="text-sm opacity-90">{customer.customerCode}</p>
              </div>
            </div>
            
            <div className="text-sm opacity-90 flex items-center gap-2">
              <span>📱</span>
              <span>{customer.phone}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab && ActiveTabComponent ? (
          // Tab Content View
          <div className="p-4">
            <ActiveTabComponent customer={customer} />
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
