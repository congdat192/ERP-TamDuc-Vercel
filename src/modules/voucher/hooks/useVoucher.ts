
import { useState } from 'react';
import { Voucher, VoucherIssueRequest, VoucherReissueRequest } from '../types';

export function useVoucher() {
  const [isLoading, setIsLoading] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const issueVoucher = async (request: VoucherIssueRequest) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newVoucher: Voucher = {
        id: `voucher-${Date.now()}`,
        code: `VCH-${Date.now()}`,
        value: request.voucherValue,
        customerName: 'Khách Hàng Mới', // This would come from lookup
        customerPhone: request.customerPhone,
        status: 'active',
        issueDate: new Date().toLocaleDateString('vi-VN'),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        issuedBy: 'Current User', // This would come from auth context
        notes: request.notes
      };
      
      setVouchers(prev => [newVoucher, ...prev]);
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
      
      // This would involve looking up the customer and creating a new voucher
      const reissuedVoucher: Voucher = {
        id: `voucher-reissue-${Date.now()}`,
        code: `VCH-${Date.now()}`,
        value: '500.000đ', // Would come from original voucher or default
        customerName: 'Khách Hàng', // From lookup
        customerPhone: request.customerPhone,
        status: 'active',
        issueDate: new Date().toLocaleDateString('vi-VN'),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        issuedBy: 'Current User',
        notes: `Cấp lại: ${request.reason}`
      };
      
      setVouchers(prev => [reissuedVoucher, ...prev]);
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
