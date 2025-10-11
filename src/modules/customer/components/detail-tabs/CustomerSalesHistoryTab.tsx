import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { InvoiceDetailDialog } from '../InvoiceDetailDialog';

interface CustomerSalesHistoryTabProps {
  customerId: string;
  customerPhone?: string;
  customerCode?: string;
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

export function CustomerSalesHistoryTab({ customerId, customerPhone, customerCode }: CustomerSalesHistoryTabProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!customerPhone) {
        console.warn('[CustomerSalesHistoryTab] No phone number provided');
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log('[CustomerSalesHistoryTab] Fetching invoices for phone:', customerPhone);
        
        const { data, error } = await supabase.functions.invoke('get-invoices-by-phone', {
          body: { phone: customerPhone }
        });

        if (error) {
          console.error('[CustomerSalesHistoryTab] Error:', error);
          setError('Không thể tải lịch sử hóa đơn');
          return;
        }

        if (data?.success && data?.data?.data?.invoices) {
          setInvoices(data.data.data.invoices);
          setCustomer(data.data.data.customer);
          console.log('[CustomerSalesHistoryTab] Loaded invoices:', data.data.data.invoices.length);
        } else {
          setInvoices([]);
          setCustomer(null);
        }
      } catch (err) {
        console.error('[CustomerSalesHistoryTab] Exception:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [customerPhone]);

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
      return new Date(dateString).toLocaleString('vi-VN');
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
            Tổng {invoices.length} giao dịch
          </div>
        </div>

      {invoices.length === 0 ? (
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
                    Sản phẩm
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
                    <td className="px-4 py-3 text-sm theme-text font-sans">
                      <div className="space-y-1">
                        {invoice.details.slice(0, 2).map((detail, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="text-xs theme-text-primary font-medium">{detail.productcode}</span>
                            <span className="text-xs theme-text-muted">- {detail.productname}</span>
                          </div>
                        ))}
                        {invoice.details.length > 2 && (
                          <div className="text-xs theme-text-muted font-sans">
                            +{invoice.details.length - 2} sản phẩm khác
                          </div>
                        )}
                      </div>
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
