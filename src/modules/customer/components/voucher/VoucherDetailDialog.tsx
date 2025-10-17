import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download } from 'lucide-react';
import { ReceivedVoucher } from '../../services/voucherService';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface VoucherDetailDialogProps {
  voucher: ReceivedVoucher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VoucherDetailDialog({ voucher, open, onOpenChange }: VoucherDetailDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (voucher && open && canvasRef.current && !qrGenerated) {
      QRCode.toCanvas(
        canvasRef.current,
        voucher.voucher_code,
        {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) {
            console.error('QR Code generation error:', error);
            toast.error('Không thể tạo mã QR');
          } else {
            setQrGenerated(true);
          }
        }
      );
    }

    if (!open) {
      setQrGenerated(false);
    }
  }, [voucher, open, qrGenerated]);

  const handleCopyCode = () => {
    if (voucher) {
      navigator.clipboard.writeText(voucher.voucher_code);
      toast.success('Đã sao chép mã voucher');
    }
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `voucher-${voucher?.voucher_code}.png`;
      link.click();
      toast.success('Đã tải mã QR');
    }
  };

  if (!voucher) return null;

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
      
      // Nếu có giờ phút giây (ISO format)
      if (dateString.includes('T')) {
        return date.toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Chỉ có ngày
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi Tiết Voucher</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <canvas ref={canvasRef} className="border-4 border-background rounded-lg" />
            <div className="flex items-center gap-2">
              <code className="px-3 py-1 bg-background rounded font-mono font-bold text-lg">
                {voucher.voucher_code}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyCode}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadQR}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Tải mã QR
            </Button>
          </div>

          {/* Campaign Info */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Chiến dịch:</label>
              <p className="font-semibold theme-text">{voucher.campaign_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium theme-text-muted">Trạng thái:</label>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(voucher.status)}>
                    {getStatusText(voucher.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium theme-text-muted">Giá trị:</label>
                <p className="font-bold text-xl theme-text-primary">{voucher.discount_display}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium theme-text-muted">Ngày nhận:</label>
                <p className="theme-text">{formatDate(voucher.received_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium theme-text-muted">Hạn sử dụng:</label>
                <p className="theme-text">{formatDate(voucher.expires_at)}</p>
              </div>
            </div>

            {voucher.activated_at && (
              <div>
                <label className="text-sm font-medium theme-text-muted">Ngày kích hoạt:</label>
                <p className="theme-text">{formatDate(voucher.activated_at)}</p>
              </div>
            )}

            {voucher.used_at && (
              <div>
                <label className="text-sm font-medium theme-text-muted">Ngày sử dụng:</label>
                <p className="theme-text">{formatDate(voucher.used_at)}</p>
              </div>
            )}

            {voucher.invoice_used_voucher && (
              <div>
                <label className="text-sm font-medium theme-text-muted">Hóa đơn sử dụng:</label>
                <p className="font-semibold text-primary">{voucher.invoice_used_voucher}</p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {(voucher.info_1 || voucher.info_2 || voucher.info_3) && (
            <div className="border-t pt-4 space-y-2">
              <label className="text-sm font-medium theme-text-muted">Thông tin thêm:</label>
              {voucher.info_1 && <p className="text-sm theme-text">• {voucher.info_1}</p>}
              {voucher.info_2 && <p className="text-sm theme-text">• {voucher.info_2}</p>}
              {voucher.info_3 && <p className="text-sm theme-text">• {voucher.info_3}</p>}
            </div>
          )}

          {/* Customer Info */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium theme-text-muted">Thông tin khách hàng:</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-sm theme-text-muted">Tên:</span>
                <p className="font-medium theme-text">{voucher.customer_name}</p>
              </div>
              <div>
                <span className="text-sm theme-text-muted">Mã KH:</span>
                <p className="font-medium theme-text">{voucher.customer_code}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
