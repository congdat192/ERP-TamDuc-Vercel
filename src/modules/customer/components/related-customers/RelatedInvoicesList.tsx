import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, FileText } from 'lucide-react';
import { RelatedInvoice } from '../../types/relatedCustomer.types';
import { RelatedCustomerService } from '../../services/relatedCustomerService';
import { toast } from '@/components/ui/use-toast';

interface RelatedInvoicesListProps {
  relatedId: string;
  onUpdate?: () => void;
}

export function RelatedInvoicesList({ relatedId, onUpdate }: RelatedInvoicesListProps) {
  const [invoices, setInvoices] = useState<RelatedInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, [relatedId]);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await RelatedCustomerService.getInvoices(relatedId);
      setInvoices(data);
    } catch (error: any) {
      console.error('Load invoices error:', error);
      toast({
        title: '❌ Lỗi',
        description: 'Không thể tải danh sách hóa đơn',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassign = async (invoiceCode: string) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn bỏ gán hóa đơn "${invoiceCode}"?`
    );
    if (!confirmed) return;

    try {
      await RelatedCustomerService.unassignInvoice(relatedId, invoiceCode);
      toast({
        title: '✅ Thành công',
        description: 'Đã bỏ gán hóa đơn'
      });
      loadInvoices();
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <div className="text-lg font-medium mb-2">Chưa có hóa đơn nào</div>
            <div className="text-sm text-muted-foreground">
              Nhấn "Gán hóa đơn mới" để thêm hóa đơn cho người thân này
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Invoice List */}
      <div className="space-y-2">
        {invoices.map((invoice, index) => (
          <Card key={invoice.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="font-semibold text-lg">{invoice.invoice_code}</div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Ngày HĐ:</span>{' '}
                      <span className="font-medium">{formatDate(invoice.invoice_date)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Giá trị:</span>{' '}
                      <span className="font-semibold text-primary">
                        {formatCurrency(invoice.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {invoice.notes && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      💬 {invoice.notes}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-muted-foreground">
                    Gán lúc: {new Date(invoice.assigned_at).toLocaleString('vi-VN')}
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnassign(invoice.invoice_code)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="font-semibold">Tổng cộng:</div>
            <div className="space-y-1 text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(totalAmount)}
              </div>
              <div className="text-sm text-muted-foreground">
                {invoices.length} hóa đơn
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
