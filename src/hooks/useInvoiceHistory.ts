import { useState, useCallback } from 'react';
import { customerApi } from '@/lib/api/customer-api';
import { useToast } from '@/hooks/use-toast';

export function useInvoiceHistory() {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadInvoices = useCallback(async (phone: string) => {
    if (!phone) return;
    
    setLoading(true);
    try {
      const data = await customerApi.getInvoiceHistory(phone);
      setInvoiceData(data);
    } catch (error) {
      console.error('Invoice history error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch sử hóa đơn",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearInvoiceData = useCallback(() => {
    setInvoiceData(null);
  }, []);

  return { invoiceData, loading, loadInvoices, clearInvoiceData };
}
