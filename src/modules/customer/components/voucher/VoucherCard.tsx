import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Clock, CheckCircle } from "lucide-react";
import { ReceivedVoucher } from "../../services/voucherService";

interface VoucherCardProps {
  voucher: ReceivedVoucher;
  onClick: () => void;
}

export function VoucherCard({ voucher, onClick }: VoucherCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "da_kich_hoat":
        return "default";
      case "da_su_dung":
        return "secondary";
      case "het_han":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "da_kich_hoat":
        return "Đã kích hoạt";
      case "da_su_dung":
        return "Đã sử dụng";
      case "het_han":
        return "Hết hạn";
      case "da_huy":
        return "Đã hủy";
      default:
        return status;
    }
  };

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

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/20" onClick={onClick}>
      <CardContent className="p-3 space-y-2">
        {/* Status badge và QR icon */}
        <div className="flex items-center justify-between">
          <Badge variant={getStatusVariant(voucher.status)} className="text-xs">
            {getStatusText(voucher.status)}
          </Badge>
          <QrCode className="w-4 h-4 theme-text-muted" />
        </div>

        {/* Campaign name */}
        <h3 className="font-semibold text-sm theme-text line-clamp-2 min-h-[2.5rem]">{voucher.campaign_name}</h3>

        {/* Voucher code */}
        <div className="flex items-center justify-between">
          <span className="text-xs theme-text-muted">Mã:</span>
          <span className="font-mono font-bold text-xs theme-text">{voucher.voucher_code}</span>
        </div>

        {/* Value */}
        <div className="flex items-center justify-between">
          <span className="text-xs theme-text-muted">Giá trị:</span>
          <span className="font-bold text-base theme-text-primary">{voucher.discount_display}</span>
        </div>

        {/* Expiry */}
        <div className="flex items-center gap-1 text-xs theme-text-muted pt-1">
          <Clock className="w-3 h-3" />
          <span>HSD: {formatDate(voucher.expires_at)}</span>
        </div>

        {/* Used date if applicable */}
        {voucher.used_at && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>Đã dùng: {formatDate(voucher.used_at)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
