
import { BaseLocalStorageService } from './baseService';
import { Voucher } from '@/modules/voucher/types';

class VoucherLocalStorageService extends BaseLocalStorageService<Voucher> {
  constructor() {
    super('erp_vouchers');
  }

  // Custom methods for voucher-specific operations
  public getByCustomerPhone(phone: string): Voucher[] {
    const vouchers = this.getFromStorage();
    return vouchers.filter(voucher => voucher.customerPhone === phone);
  }

  public getByStatus(status: Voucher['status']): Voucher[] {
    const vouchers = this.getFromStorage();
    return vouchers.filter(voucher => voucher.status === status);
  }

  public getByCode(code: string): Voucher | undefined {
    const vouchers = this.getFromStorage();
    return vouchers.find(voucher => voucher.code === code);
  }

  public getActiveVouchers(): Voucher[] {
    const vouchers = this.getFromStorage();
    const today = new Date();
    return vouchers.filter(voucher => {
      if (voucher.status !== 'active') return false;
      const expiryDate = new Date(voucher.expiryDate.split('/').reverse().join('-'));
      return expiryDate >= today;
    });
  }

  public getExpiredVouchers(): Voucher[] {
    const vouchers = this.getFromStorage();
    const today = new Date();
    return vouchers.filter(voucher => {
      const expiryDate = new Date(voucher.expiryDate.split('/').reverse().join('-'));
      return expiryDate < today && voucher.status === 'active';
    });
  }

  public useVoucher(voucherId: string): boolean {
    const voucher = this.getById(voucherId);
    if (!voucher || voucher.status !== 'active') return false;

    const updatedVoucher = this.update(voucherId, {
      status: 'used',
      usedDate: new Date().toLocaleDateString('vi-VN')
    });
    return !!updatedVoucher;
  }

  public cancelVoucher(voucherId: string): boolean {
    const voucher = this.getById(voucherId);
    if (!voucher) return false;

    const updatedVoucher = this.update(voucherId, {
      status: 'cancelled'
    });
    return !!updatedVoucher;
  }

  public getVouchersByIssuedBy(issuedBy: string): Voucher[] {
    const vouchers = this.getFromStorage();
    return vouchers.filter(voucher => voucher.issuedBy === issuedBy);
  }

  public searchByCustomerInfo(query: string): Voucher[] {
    const vouchers = this.getFromStorage();
    const lowerQuery = query.toLowerCase();
    return vouchers.filter(voucher => 
      voucher.customerName.toLowerCase().includes(lowerQuery) ||
      voucher.customerPhone.includes(query) ||
      voucher.code.toLowerCase().includes(lowerQuery)
    );
  }
}

export const voucherService = new VoucherLocalStorageService();
