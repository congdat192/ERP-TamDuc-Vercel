import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RelatedCustomer } from '../../types/relatedCustomer.types';
import { FamilyMemberService, APIResponse } from '../../services/familyMemberService';
import { fetchInvoicesByPhone, Invoice } from '@/modules/sales/services/invoiceService';
import { toast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

interface AssignInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  related: RelatedCustomer;
  customer: any;
  currentUser: any;
  onSuccess: () => void;
}

export function AssignInvoiceModal({ 
  open, 
  onOpenChange, 
  related,
  customer,
  currentUser,
  onSuccess 
}: AssignInvoiceModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]); // ✅ Use IDs (numbers)
  const [isLoading, setIsLoading] = useState(false);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [availableInvoices, setAvailableInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  // Load invoices when modal opens
  useEffect(() => {
    if (open && customer?.phone) {
      loadInvoices();
    }
  }, [open, customer?.phone]);

  const loadInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      // 1. Fetch all invoices from customer's history
      const response = await fetchInvoicesByPhone(customer.phone);
      if (!response?.data?.invoices) {
        setAllInvoices([]);
        setAvailableInvoices([]);
        return;
      }

      const invoices = response.data.invoices;
      setAllInvoices(invoices);

      // 2. Get list of all assigned bill codes from ANY family member
      const assignedBillCodes = (customer.familyMembers || [])
        .flatMap((fm: any) => (fm.bills || []).map((bill: any) => bill.invoice_code || bill.code));

      console.log('[AssignInvoiceModal] Assigned bill codes:', assignedBillCodes);

      // 3. Filter: Only show invoices NOT YET assigned
      const available = invoices.filter((inv: Invoice) => !assignedBillCodes.includes(inv.code));
      setAvailableInvoices(available);

      console.log('[AssignInvoiceModal] Available invoices:', available.length, '/', invoices.length);
    } catch (error: any) {
      console.error('[AssignInvoiceModal] Error loading invoices:', error);
      console.error('[AssignInvoiceModal] Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });

      toast({
        title: '❌ Lỗi',
        description: error?.message || 'Không thể tải danh sách hóa đơn. Vui lòng thử lại.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const filteredInvoices = availableInvoices.filter(invoice => 
    invoice.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.branchname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.details.some(d => d.productname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleInvoice = (id: number) => {
    setSelectedInvoiceIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
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
    if (selectedInvoiceIds.length === 0) {
      toast({
        title: '⚠️ Chưa chọn hóa đơn',
        description: 'Vui lòng chọn ít nhất 1 hóa đơn',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Call API with array of invoice IDs (numbers)
      const response: APIResponse = await FamilyMemberService.assignBills(
        customer.phone,
        related.related_name,
        selectedInvoiceIds
      );

      // ✅ CHECK response.success FIELD FIRST
      if (!response.success) {
        console.error('[AssignInvoiceModal] Assign bills failed:', response);
        console.error('[AssignInvoiceModal] Request ID:', response.meta.request_id);

        toast({
          title: '❌ Lỗi',
          description: response.error_description,
          variant: 'destructive',
          duration: 5000
        });
        return;
      }

      // ✅ SUCCESS: Display message NGUYÊN VĂN
      console.log('[AssignInvoiceModal] Success:', response);
      console.log('[AssignInvoiceModal] Request ID:', response.meta.request_id);

      toast({
        title: '✅ Thành công',
        description: response.message
      });

      // Reset form
      setSelectedInvoiceIds([]);
      setSearchTerm('');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      // Network error hoặc unexpected error
      console.error('[AssignInvoiceModal] Unexpected error:', error);

      toast({
        title: '❌ Lỗi',
        description: 'Không thể kết nối đến server. Vui lòng thử lại.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalSelected = allInvoices
    .filter(inv => selectedInvoiceIds.includes(inv.id))
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
            {isLoadingInvoices ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm 
                  ? 'Không tìm thấy hóa đơn nào' 
                  : 'Tất cả hóa đơn đã được gán cho người thân'}
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => toggleInvoice(invoice.id)}
                >
                  <Checkbox
                    checked={selectedInvoiceIds.includes(invoice.id)}
                    onCheckedChange={() => toggleInvoice(invoice.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{invoice.code}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(invoice.createddate)} • {formatCurrency(invoice.total)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      🏪 {invoice.branchname} • 👤 {invoice.soldbyname}
                    </div>
                    {invoice.details.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        📦 {invoice.details.slice(0, 2).map(d => d.productname).join(', ')}
                        {invoice.details.length > 2 && ` +${invoice.details.length - 2} sản phẩm`}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {selectedInvoiceIds.length > 0 && (
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Đã chọn:</span>
                <span className="font-medium">{selectedInvoiceIds.length} hóa đơn</span>
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
            disabled={isLoading || selectedInvoiceIds.length === 0}
          >
            {isLoading ? 'Đang gán...' : `💾 Gán ${selectedInvoiceIds.length} hóa đơn`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
