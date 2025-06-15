
import { useParams } from 'react-router-dom';
import { mockSales } from '@/data/mockData';
import { InvoiceDetailRow } from '@/modules/sales/components/InvoiceDetailRow';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();

  // Tìm hóa đơn theo ID
  const invoice = mockSales.find(sale => sale.id === invoiceId);

  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold theme-text mb-4">Không tìm thấy hóa đơn</h1>
        <p className="theme-text-muted mb-6">Hóa đơn với mã "{invoiceId}" không tồn tại trong hệ thống.</p>
        <Button onClick={() => navigate('/ERP/Invoices')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách hóa đơn
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate('/ERP/Invoices')} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold theme-text">Chi tiết hóa đơn {invoice.id}</h1>
            <p className="theme-text-muted">Xem thông tin chi tiết và lịch sử thanh toán</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="theme-card rounded-lg border theme-border-primary overflow-hidden">
        <table className="w-full">
          <tbody>
            <InvoiceDetailRow invoice={invoice} visibleColumnsCount={6} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
