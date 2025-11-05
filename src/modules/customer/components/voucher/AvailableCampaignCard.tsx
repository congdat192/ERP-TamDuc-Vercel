import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock } from "lucide-react";
import { AvailableCampaign } from "../../services/voucherService";

interface AvailableCampaignCardProps {
  campaign: AvailableCampaign;
  onClaim: () => void;
  isLoading?: boolean;
}

export function AvailableCampaignCard({ campaign, onClaim, isLoading }: AvailableCampaignCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-primary/20">
      <CardContent className="p-3 space-y-2">
        {/* Header với Badge và Icon */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Gift className="w-4 h-4 theme-text-primary" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {campaign.discount_type === "voucher" ? "Voucher" : "Coupon"}
          </Badge>
        </div>

        {/* Tên campaign */}
        <h3 className="font-semibold text-sm theme-text line-clamp-2 min-h-[2.5rem]">{campaign.campaign_name}</h3>

        {/* Thông tin chính */}
        <div className="space-y-1.5">
          {/* Giá trị */}
          <div className="flex items-baseline justify-between">
            <span className="text-xs theme-text-muted">Giá trị:</span>
            <span className="font-bold text-base theme-text-primary">{campaign.discount_display}</span>
          </div>

          {/* Đơn tối thiểu (nếu có) */}
          {campaign.min_purchase > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs theme-text-muted">Đơn tối thiểu:</span>
              <span className="text-xs font-medium theme-text">{formatCurrency(campaign.min_purchase)}</span>
            </div>
          )}

          {/* HSD */}
          <div className="flex items-center gap-1 text-xs theme-text-muted pt-1">
            <Clock className="w-3 h-3" />
            <span>HSD: {formatDate(campaign.expires_at)}</span>
          </div>
        </div>

        {/* Nút Nhận */}
        <Button onClick={onClaim} disabled={isLoading} className="w-full h-8 text-xs font-medium">
          {isLoading ? "Đang xử lý..." : "Nhận Voucher"}
        </Button>
      </CardContent>
    </Card>
  );
}
