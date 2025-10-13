import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { InvoiceDetailDialog } from '../InvoiceDetailDialog';

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
}

interface Invoice {
  code: string;
  created_at_vn: string;
  soldbyname: string;
  branchname: string;
  total: number;
  totalpayment: number;
  status: number;
  statusvalue: string;
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
      // API trả về: "2025-01-15 14:30:00" (giờ VN)
      // Chuyển sang: "15/01/2025 14:30"
      const parts = dateString.split(' ');
      if (parts.length !== 2) return dateString;
      
      const [datePart, timePart] = parts;
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      
      return `${day}/${month}/${year} ${hour}:${minute}`;
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin theme-text-primary" />
        <span className="ml-2 theme-text">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <InvoiceDetailDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        invoice={selectedInvoice}
        customer={customer}
      />
      
      <div className="space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold theme-text font-sans">Lịch sử bán hàng</h4>
          <div className="text-sm theme-text-muted font-sans">
            Tổng {invoices?.length || 0} giao dịch
          </div>
        </div>

      {!invoices || invoices.length === 0 ? (
        <div className="text-center py-12 theme-text-muted">
          Chưa có giao dịch nào
        </div>
      ) : (
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
                      {formatDate(invoice.created_at_vn)}
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
