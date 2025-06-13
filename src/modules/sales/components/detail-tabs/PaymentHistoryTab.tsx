
import { Badge } from '@/components/ui/badge';

interface PaymentHistoryTabProps {
  invoice: any;
}

export function PaymentHistoryTab({ invoice }: PaymentHistoryTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  // Mock payment history data
  const paymentHistory = [
    {
      id: '1',
      date: invoice.date,
      method: 'Tiền mặt',
      amount: invoice.paidAmount,
      status: 'Hoàn thành',
      note: 'Thanh toán đầy đủ'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Summary */}
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Tổng quan thanh toán</h3>
          <div className="space-y-3 p-4 theme-card rounded-lg border theme-border-primary">
            <div className="flex justify-between">
              <span className="theme-text-muted">Tổng tiền hàng:</span>
              <span className="theme-text font-medium">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-text-muted">Giảm giá:</span>
              <span className="sales-amount-negative font-medium">
                {invoice.discount > 0 ? formatCurrency(invoice.discount) : '0 ₫'}
              </span>
            </div>
            <div className="flex justify-between border-t theme-border-primary/20 pt-2">
              <span className="theme-text font-medium">Khách cần trả:</span>
              <span className="theme-text-primary font-semibold">{formatCurrency(invoice.needToPay)}</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-text font-medium">Khách đã trả:</span>
              <span className="sales-amount-positive font-semibold">{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="flex justify-between border-t theme-border-primary/20 pt-2">
              <span className="theme-text font-medium">Còn lại:</span>
              <span className="theme-text font-semibold">
                {formatCurrency(invoice.needToPay - invoice.paidAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Trạng thái thanh toán</h3>
          <div className="p-4 theme-card rounded-lg border theme-border-primary">
            <div className="text-center">
              <Badge 
                variant={invoice.paidAmount >= invoice.needToPay ? 'success' : 'destructive'}
                className="text-sm px-3 py-1"
              >
                {invoice.paidAmount >= invoice.needToPay ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Badge>
              <p className="theme-text-muted text-sm mt-2">
                Cập nhật lần cuối: {invoice.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div>
        <h3 className="font-semibold theme-text text-lg mb-4">Lịch sử giao dịch</h3>
        <div className="border theme-border-primary rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Thời gian</th>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Phương thức</th>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Số tiền</th>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-t theme-border-primary/10">
                  <td className="px-4 py-3 text-sm theme-text">{payment.date}</td>
                  <td className="px-4 py-3 text-sm theme-text">{payment.method}</td>
                  <td className="px-4 py-3 text-sm theme-text font-medium">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="success" className="sales-status-completed">
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm theme-text-muted">{payment.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
