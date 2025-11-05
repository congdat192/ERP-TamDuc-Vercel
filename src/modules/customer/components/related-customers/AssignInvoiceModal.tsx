import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RelatedCustomer } from '../../types/relatedCustomer.types';
import { RelatedCustomerService } from '../../services/relatedCustomerService';
import { toast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';

interface AssignInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  related: RelatedCustomer;
  customer: any;
  currentUser: any;
  onSuccess: () => void;
}

// Mock invoice data - will be replaced with real KiotViet API
interface MockInvoice {
  code: string;
  date: string;
  total: number;
  items: string;
}

const MOCK_INVOICES: MockInvoice[] = [
  { code: 'HD001', date: '2024-01-15', total: 1500000, items: 'Gọng kính Rayban RB001' },
  { code: 'HD002', date: '2024-02-20', total: 2800000, items: 'Tròng kính chống ánh sáng xanh' },
  { code: 'HD003', date: '2024-03-10', total: 950000, items: 'Kính mát UV400' },
  { code: 'HD004', date: '2024-04-05', total: 3200000, items: 'Gọng kính Gucci GG001' },
  { code: 'HD005', date: '2024-05-12', total: 1200000, items: 'Dung dịch ngâm kính' },
];

export function AssignInvoiceModal({ 
  open, 
  onOpenChange, 
  related,
  customer,
  currentUser,
  onSuccess 
}: AssignInvoiceModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invoices] = useState<MockInvoice[]>(MOCK_INVOICES);

  const filteredInvoices = invoices.filter(invoice => 
    invoice.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.items.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleInvoice = (code: string) => {
    setSelectedInvoices(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
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

  const handleAssign = async () => {
    if (selectedInvoices.length === 0) {
      toast({
        title: '⚠️ Chưa chọn hóa đơn',
        description: 'Vui lòng chọn ít nhất 1 hóa đơn',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      for (const invoiceCode of selectedInvoices) {
        const invoice = invoices.find(inv => inv.code === invoiceCode);
        if (!invoice) continue;

        await RelatedCustomerService.assignInvoice(related.id, {
          invoice_code: invoiceCode,
          invoice_date: invoice.date,
          total_amount: invoice.total,
          assigned_by: currentUser?.id || 'current-user-id',
          notes: notes.trim() || undefined
        });
      }

      toast({
        title: '✅ Thành công',
        description: `Đã gán ${selectedInvoices.length} hóa đơn cho ${related.related_name}`
      });

      // Reset form
      setSelectedInvoices([]);
      setNotes('');
      onSuccess();
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalSelected = invoices
    .filter(inv => selectedInvoices.includes(inv.code))
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>🛒 Gán hóa đơn cho: {related.related_name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã hóa đơn hoặc sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Invoice List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto border rounded-lg p-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không tìm thấy hóa đơn nào
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div 
                  key={invoice.code}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => toggleInvoice(invoice.code)}
                >
                  <Checkbox 
                    checked={selectedInvoices.includes(invoice.code)}
                    onCheckedChange={() => toggleInvoice(invoice.code)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{invoice.code}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(invoice.date)} • {formatCurrency(invoice.total)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {invoice.items}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
            <Textarea
              placeholder="Ghi chú về việc gán hóa đơn..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedInvoices.length > 0 && (
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Đã chọn:</span>
                <span className="font-medium">{selectedInvoices.length} hóa đơn</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tổng giá trị:</span>
                <span className="font-semibold text-primary">{formatCurrency(totalSelected)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={isLoading || selectedInvoices.length === 0}
          >
            {isLoading ? 'Đang gán...' : `💾 Gán ${selectedInvoices.length} hóa đơn`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
