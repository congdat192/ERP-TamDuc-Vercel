
export interface ReferrerAccount {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  referralCode: string;
  status: 'active' | 'inactive' | 'suspended';
  totalVouchersIssued: number;
  totalCommissionEarned: number;
  totalReferrals: number;
  createdAt: string;
  lastActivity?: string;
  kiotVietConfig?: {
    retailerId: string;
    isConnected: boolean;
    lastSync?: string;
  };
}

export interface AffiliateVoucher {
  id: string;
  referrerId: string;
  referrerName: string;
  voucherCode: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  status: 'active' | 'used' | 'expired';
  issuedAt: string;
  usedAt?: string;
  expiresAt: string;
  customerPhone?: string;
  orderId?: string;
  orderValue?: number;
  commissionAmount?: number;
  kiotVietVoucherId?: string;
}

export interface CommissionRecord {
  id: string;
  referrerId: string;
  referrerName: string;
  voucherId: string;
  voucherCode: string;
  orderId: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  customerInfo: {
    phone: string;
    name?: string;
  };
}

export interface AffiliateStats {
  totalReferrers: number;
  activeReferrers: number;
  totalVouchersIssued: number;
  totalVouchersUsed: number;
  totalCommissionPaid: number;
  totalSalesGenerated: number;
  conversionRate: number;
  averageOrderValue: number;
}

export interface AffiliateFilters {
  status: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  searchTerm: string;
  sortBy: 'name' | 'createdAt' | 'totalCommission' | 'totalVouchers';
  sortDirection: 'asc' | 'desc';
}
