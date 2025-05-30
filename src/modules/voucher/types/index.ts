
export interface Voucher {
  id: string;
  code: string;
  value: string;
  customerName: string;
  customerPhone: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  usedDate?: string;
  notes?: string;
}

export interface VoucherIssueRequest {
  customerPhone: string;
  customerSource: string;
  customerType: string;
  voucherValue: string;
  notes?: string;
}

export interface VoucherReissueRequest {
  customerPhone: string;
  reason: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  lastVoucher?: string;
  totalVouchers: number;
  type: 'VIP' | 'Premium' | 'Regular';
}
