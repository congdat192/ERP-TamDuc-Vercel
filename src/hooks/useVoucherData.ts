import { useState, useCallback } from 'react';
import { customerApi } from '@/lib/api/customer-api';
import type { VoucherEligibility } from '@/types/customer.types';
import { useToast } from '@/hooks/use-toast';

export function useVoucherData() {
  const [voucherData, setVoucherData] = useState<VoucherEligibility | null>(null);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const { toast } = useToast();

  const checkEligibility = useCallback(async (phone: string) => {
    if (!phone) return;
    
    setLoading(true);
    try {
      const data = await customerApi.checkVoucherEligibility(phone);
      setVoucherData(data);
    } catch (error) {
      console.error('Voucher eligibility error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể kiểm tra voucher",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const claimVoucher = useCallback(async (phone: string, campaignId: string) => {
    setClaiming(true);
    try {
      await customerApi.claimVoucher(phone, campaignId);
      toast({
        title: "Thành công",
        description: "Đã nhận voucher thành công!",
      });
      await checkEligibility(phone);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể nhận voucher",
        variant: "destructive"
      });
    } finally {
      setClaiming(false);
    }
  }, [toast, checkEligibility]);

  const clearVoucherData = useCallback(() => {
    setVoucherData(null);
  }, []);

  return { voucherData, loading, claiming, checkEligibility, claimVoucher, clearVoucherData };
}
