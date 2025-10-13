import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Clock } from 'lucide-react';
import { AvailableCampaign } from '../../services/voucherService';

interface AvailableCampaignCardProps {
  campaign: AvailableCampaign;
  onClaim: () => void;
  isLoading?: boolean;
}

export function AvailableCampaignCard({ campaign, onClaim, isLoading }: AvailableCampaignCardProps) {
  const formatDate = (dateString: string) => {
    try {
      // API trả về: "2025-01-15" hoặc "2025-01-15 14:30:00"
      // Chuyển sang: "15/01/2025"
      const datePart = dateString.split(' ')[0];
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Gift className="w-6 h-6 theme-text-primary" />
          </div>
          <div className="flex-1">
            <Badge variant="secondary" className="mb-1">
              {campaign.discount_type === 'voucher' ? 'Voucher' : 'Coupon'}
            </Badge>
            <h3 className="font-semibold text-lg theme-text line-clamp-2">
              {campaign.campaign_name}
            </h3>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm theme-text-muted">Giá trị:</span>
            <span className="font-bold text-xl theme-text-primary">
              {campaign.discount_display}
            </span>
          </div>

          {campaign.min_purchase > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm theme-text-muted">Đơn tối thiểu:</span>
              <span className="text-sm font-medium theme-text">
                {formatCurrency(campaign.min_purchase)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm theme-text-muted pt-2 border-t">
            <Clock className="w-4 h-4" />
            <span>HSD: {formatDate(campaign.expires_at)}</span>
          </div>
        </div>

        <Button 
          onClick={onClaim}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Đang xử lý...' : 'Nhận Voucher'}
        </Button>
      </CardContent>
    </Card>
  );
}
