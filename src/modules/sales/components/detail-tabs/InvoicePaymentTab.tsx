
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface InvoicePaymentTabProps {
  invoice: any;
}

export function InvoicePaymentTab({ invoice }: InvoicePaymentTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Payment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Chi tiết thanh toán</h3>
          <div className="space-y-3 p-4 theme-card rounded-lg border theme-border-primary">
            <div className="flex justify-between">
              <span className="theme-text-muted">Tổng tiền hàng:</span>
              <span className="theme-text font-medium">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-text-muted">Giảm giá hóa đơn:</span>
              <span className="sales-amount-negative font-medium">
                -{formatCurrency(invoice.discount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="theme-text-muted">Thuế:</span>
              <span className="theme-text">{formatCurrency(invoice.tax || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-text-muted">Chiết khấu thanh toán:</span>
              <span className="theme-text">{formatCurrency(invoice.paymentDiscount || 0)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span className="theme-text">Khách cần trả:</span>
              <span className="theme-text-primary text-lg">{formatCurrency(invoice.needToPay)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Trạng thái thanh toán</h3>
          <div className="space-y-4 p-4 theme-card rounded-lg border theme-border-primary">
            <div className="text-center">
              <Badge 
                variant={invoice.paidAmount >= invoice.needToPay ? 'success' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {invoice.paidAmount >= invoice.needToPay ? 'Đã thanh toán đầy đủ' : 'Chưa thanh toán'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="theme-text-muted">Đã thanh toán:</span>
                <span className="sales-amount-positive font-semibold">
                  {formatCurrency(invoice.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="theme-text-muted">Còn thiếu:</span>
                <span className="theme-text font-semibold">
                  {formatCurrency(Math.max(0, invoice.needToPay - invoice.paidAmount))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Methods */}
      <div>
        <h3 className="font-semibold theme-text text-lg mb-4">Phương thức thanh toán</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 theme-card rounded-lg border theme-border-primary">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium theme-text">Tiền mặt</span>
              <Badge variant="success" className="sales-status-completed">Đã thanh toán</Badge>
            </div>
            <div className="text-lg font-semibold theme-text-primary">
              {formatCurrency(invoice.paidAmount)}
            </div>
            <div className="text-sm theme-text-muted mt-1">
              Thanh toán lúc: {invoice.date}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Delivery Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Thông tin giao hàng</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Thời gian giao hàng</label>
              <p className="theme-text">{invoice.deliveryTime || 'Chưa xác định'}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Địa chỉ giao hàng</label>
              <p className="theme-text">{invoice.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Trạng thái giao hàng</label>
              <Badge variant="success" className="sales-status-completed">
                Đã giao
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Thông tin bổ sung</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Người tạo đơn</label>
              <p className="theme-text">{invoice.creator}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Thời gian tạo</label>
              <p className="theme-text">{invoice.createdTime}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Cập nhật cuối</label>
              <p className="theme-text">{invoice.lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
