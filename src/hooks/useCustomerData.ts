import { useState, useCallback } from 'react';
import { customerApi } from '@/lib/api/customer-api';
import type { Customer } from '@/types/customer.types';
import { useToast } from '@/hooks/use-toast';

export function useCustomerData() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchByPhone = useCallback(async (phone: string) => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại hợp lệ",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const data = await customerApi.getByPhone(phone);
      setCustomer(data);
      toast({
        title: "Thành công",
        description: `Tìm thấy khách hàng: ${data.name}`,
      });
      return data;
    } catch (error) {
      toast({
        title: "Không tìm thấy",
        description: "Không tìm thấy khách hàng với số điện thoại này",
        variant: "destructive"
      });
      setCustomer(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearCustomer = useCallback(() => {
    setCustomer(null);
  }, []);

  return { customer, loading, searchByPhone, clearCustomer };
}
