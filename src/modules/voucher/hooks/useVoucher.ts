
import { useState, useEffect } from 'react';
import { Voucher, VoucherIssueRequest, VoucherReissueRequest } from '../types';
import { voucherService } from '@/services/localStorage/voucherService';

export function useVoucher() {
  const [isLoading, setIsLoading] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  // Load vouchers from localStorage
  useEffect(() => {
    const loadVouchers = () => {
      const data = voucherService.getAll();
      setVouchers(data);
    };

    loadVouchers();

    // Listen for data changes
    const handleDataChange = (event: CustomEvent) => {
      if (event.detail.storageKey === 'erp_vouchers') {
        loadVouchers();
      }
    };

    window.addEventListener('erp-data-changed', handleDataChange as EventListener);
    return () => {
      window.removeEventListener('erp-data-changed', handleDataChange as EventListener);
    };
  }, []);

  const issueVoucher = async (request: VoucherIssueRequest) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newVoucher = voucherService.create({
        code: `VCH-${Date.now()}`,
        value: request.voucherValue,
        customerName: 'Khách Hàng Mới', // This would come from lookup
        customerPhone: request.customerPhone,
        status: 'active',
        issueDate: new Date().toLocaleDateString('vi-VN'),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        issuedBy: 'Current User', // This would come from auth context
        notes: request.notes
      });
      
      return newVoucher;
    } finally {
      setIsLoading(false);
    }
  };

  const reissueVoucher = async (request: VoucherReissueRequest) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reissuedVoucher = voucherService.create({
        code: `VCH-${Date.now()}`,
        value: '500.000đ', // Would come from original voucher or default
        customerName: 'Khách Hàng', // From lookup
        customerPhone: request.customerPhone,
        status: 'active',
        issueDate: new Date().toLocaleDateString('vi-VN'),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        issuedBy: 'Current User',
        notes: `Cấp lại: ${request.reason}`
      });
      
      return reissuedVoucher;
    } finally {
      setIsLoading(false);
    }
  };

  const getVouchersByUser = (userId: string) => {
    return vouchers.filter(voucher => voucher.issuedBy === userId);
  };

  return {
    vouchers,
    isLoading,
    issueVoucher,
    reissueVoucher,
    getVouchersByUser
  };
}
