import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AvailableCampaign } from '../../services/voucherService';
import { Badge } from '@/components/ui/badge';
import { Clock, Gift } from 'lucide-react';

interface ClaimVoucherDialogProps {
  campaign: AvailableCampaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ClaimVoucherDialog({
  campaign,
  open,
  onOpenChange,
  onConfirm,
  isLoading
}: ClaimVoucherDialogProps) {
  if (!campaign) return null;

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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 theme-text-primary" />
            Xác nhận nhận voucher
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {campaign.discount_type === 'voucher' ? 'Voucher' : 'Coupon'}
                  </Badge>
                  <h4 className="font-semibold text-base theme-text">
                    {campaign.campaign_name}
                  </h4>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm theme-text-muted">Giá trị:</span>
                    <span className="font-bold text-lg theme-text-primary">
                      {campaign.discount_display}
                    </span>
                  </div>

                  {campaign.min_purchase > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm theme-text-muted">Đơn tối thiểu:</span>
                      <span className="text-sm font-medium theme-text">
                        {formatCurrency(campaign.min_purchase)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm theme-text-muted pt-2 border-t">
                    <Clock className="w-4 h-4" />
                    <span>Hạn sử dụng: {formatDate(campaign.expires_at)}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm theme-text">
                Bạn có chắc chắn muốn nhận voucher này cho khách hàng không?
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
