import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode, Clock, CheckCircle } from 'lucide-react';
import { ReceivedVoucher } from '../../services/voucherService';

interface VoucherCardProps {
  voucher: ReceivedVoucher;
  onClick: () => void;
}

export function VoucherCard({ voucher, onClick }: VoucherCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'da_kich_hoat':
        return 'default';
      case 'da_su_dung':
        return 'secondary';
      case 'het_han':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'da_kich_hoat':
        return 'Đã kích hoạt';
      case 'da_su_dung':
        return 'Đã sử dụng';
      case 'het_han':
        return 'Hết hạn';
      case 'da_huy':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <Badge 
              variant={getStatusVariant(voucher.status)}
              className="mb-2"
            >
              {getStatusText(voucher.status)}
            </Badge>
            <h3 className="font-semibold text-lg theme-text line-clamp-1">
              {voucher.campaign_name}
            </h3>
          </div>
          <QrCode className="w-5 h-5 theme-text-muted ml-2 flex-shrink-0" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm theme-text-muted">Mã voucher:</span>
            <span className="font-mono font-bold theme-text">{voucher.voucher_code}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm theme-text-muted">Giá trị:</span>
            <span className="font-bold text-lg theme-text-primary">
              {voucher.discount_display}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm theme-text-muted pt-2 border-t">
            <Clock className="w-4 h-4" />
            <span>HSD: {formatDate(voucher.expires_at)}</span>
          </div>

          {voucher.used_at && (
            <div className="flex items-center gap-2 text-sm text-green-600 pt-1">
              <CheckCircle className="w-4 h-4" />
              <span>Đã dùng: {formatDate(voucher.used_at)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
