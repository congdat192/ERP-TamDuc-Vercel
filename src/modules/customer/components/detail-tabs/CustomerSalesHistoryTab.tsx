import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Building2, DollarSign, ChevronRight } from 'lucide-react';
import { InvoiceDetailDialog } from '../InvoiceDetailDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CustomerSalesHistoryTabProps {
  invoices: Invoice[] | null;
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

interface InvoiceDetail {
  productcode: string;
  productname: string;
  quantity: number;
  price: number;
  discount: number;
  discountratio: number;
  subtotal: number;
  final_price: number;
  total_price: number;
}

interface Invoice {
  code: string;
  createddate: string;
  soldbyname: string;
  branchname: string;
  total: number;
  totalpayment: number;
  status: number;
  statusvalue: string;
  description?: string;
  eye_prescription?: string;
  details: InvoiceDetail[];
}

interface Customer {
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export function CustomerSalesHistoryTab({ invoices, customer, isLoading, error }: CustomerSalesHistoryTabProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (statusvalue: string) => {
    switch (statusvalue) {
      case 'Completed':
      case 'Hoàn thành':
        return <Badge className="theme-badge-success">{statusvalue}</Badge>;
      case 'Đang xử lý':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{statusvalue}</Badge>;
      case 'Đã hủy':
        return <Badge className="berry-error-light">{statusvalue}</Badge>;
      default:
        return <Badge variant="secondary">{statusvalue}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="w-8 h-8 animate-spin theme-text-primary" />
        <span className="text-sm theme-text-muted">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-red-600 mb-2">{error}</p>
        <p className="text-sm theme-text-muted">Vui lòng thử lại sau</p>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="theme-text-muted mb-2">Chưa có giao dịch nào</p>
        <p className="text-sm theme-text-muted">Lịch sử mua hàng sẽ xuất hiện ở đây</p>
      </div>
    );
  }

  const totalSpent = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.totalpayment, 0);
  const totalDebt = totalSpent - totalPaid;

  return (
    <>
      <InvoiceDetailDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        invoice={selectedInvoice}
        customer={customer}
      />
      
      <div className="space-y-4 font-sans">
        {/* Summary Stats Cards */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2 min-[400px]:grid-cols-3" : "grid-cols-3"
        )}>
          <div className="theme-card rounded-lg border theme-border-primary p-3 sm:p-4">
            <div className={cn(
              "font-bold theme-text-primary",
              isMobile ? "text-xl" : "text-2xl"
            )}>
              {invoices.length}
            </div>
            <div className="text-xs theme-text-muted mt-1">Tổng đơn hàng</div>
          </div>
          <div className="theme-card rounded-lg border theme-border-primary p-3 sm:p-4">
            <div className={cn(
              "font-bold text-green-600",
              isMobile ? "text-xl" : "text-2xl"
            )}>
              {formatCurrency(totalPaid)}
            </div>
            <div className="text-xs theme-text-muted mt-1">Đã thanh toán</div>
          </div>
          <div className={cn(
            "theme-card rounded-lg border theme-border-primary p-3 sm:p-4",
            isMobile && "col-span-2 min-[400px]:col-span-1"
          )}>
            <div className={cn(
              "font-bold text-red-600",
              isMobile ? "text-xl" : "text-2xl"
            )}>
              {formatCurrency(totalDebt)}
            </div>
            <div className="text-xs theme-text-muted mt-1">Công nợ</div>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <h4 className="text-base sm:text-lg font-semibold theme-text font-sans">Danh sách giao dịch</h4>
          <div className="text-sm theme-text-muted font-sans">
            {invoices.length} giao dịch
          </div>
        </div>

      {isMobile ? (
        // Mobile: Card-based layout
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.code}
              className="bg-white rounded-xl border theme-border-primary shadow-sm p-4 hover:shadow-md transition-all active:scale-[0.99]"
              onClick={() => handleInvoiceClick(invoice)}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-base text-gray-900">
                  {invoice.code}
                </div>
                {getStatusBadge(invoice.statusvalue)}
              </div>

              {/* Card Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    Ngày
                  </span>
                  <span className="font-semibold text-gray-900 text-right">
                    {formatDate(invoice.createddate)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    Chi nhánh
                  </span>
                  <span className="font-semibold text-gray-900 text-right">
                    {invoice.branchname}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    Tổng tiền
                  </span>
                  <span className="font-bold text-primary text-base">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop: Table layout
        <div className="theme-card rounded-lg border theme-border-primary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-sans">
              <thead className="bg-gray-50 border-b theme-border-primary/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                    Mã hóa đơn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                    Ngày bán
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                    Chi nhánh
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                    Nhân viên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                    Thanh toán
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border-primary/10">
                {invoices.map((invoice) => (
                  <tr key={invoice.code} className="hover:theme-bg-primary/5">
                    <td className="px-4 py-3 text-sm font-sans">
                      <button
                        onClick={() => handleInvoiceClick(invoice)}
                        className="theme-text-primary font-medium hover:underline cursor-pointer"
                      >
                        {invoice.code}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm theme-text-muted font-sans">
                      {formatDate(invoice.createddate || (invoice as any).created_at_vn)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text font-sans">
                      {invoice.branchname}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text font-sans">
                      {invoice.soldbyname}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text font-medium font-sans">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text font-medium font-sans">
                      {formatCurrency(invoice.totalpayment)}
                    </td>
                    <td className="px-4 py-3 text-sm font-sans">
                      {getStatusBadge(invoice.statusvalue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
