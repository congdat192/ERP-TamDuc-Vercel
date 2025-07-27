
export interface AffiliateF0 {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  totalF1Referrals: number;
  totalCommission: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  vouchersGenerated: number;
  vouchersUsed: number;
  registrationDate: string;
  approvalDate?: string;
  rejectionReason?: string;
}

export interface AffiliateF1 {
  id: string;
  name: string;
  email: string;
  phone: string;
  referredBy: string; // F0 ID
  registrationDate: string;
  firstOrderDate?: string;
  totalOrders: number;
  totalOrderValue: number;
  commissionGenerated: number;
  voucherUsed?: string;
}

export interface Commission {
  id: string;
  f0Id: string;
  f1Id: string;
  orderId: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'awaiting_payment' | 'paid';
  createdDate: string;
  approvedDate?: string;
  paidDate?: string;
  rejectionReason?: string;
}

export interface AffiliateVoucher {
  id: string;
  code: string;
  f0Id: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  isUsed: boolean;
  usedBy?: string; // F1 ID
  usedDate?: string;
  orderId?: string;
}

export interface WithdrawalRequest {
  id: string;
  f0Id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestDate: string;
  processedDate?: string;
  rejectionReason?: string;
  bankInfo: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    branchName: string;
  };
}

export interface AffiliateAlert {
  id: string;
  type: 'f0_pending' | 'commission_pending' | 'withdrawal_request' | 'system_error' | 'voucher_expiry';
  priority: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdDate: string;
  actionUrl?: string;
  actionText?: string;
}

export interface AffiliateDashboardStats {
  totalF0: number;
  totalF1: number;
  totalSuccessfulReferrals: number;
  totalCommissionPaid: number;
  totalCommissionPending: number;
  totalVouchersIssued: number;
  newF0Today: number;
  newF1Today: number;
  newF0ThisMonth: number;
  newF1ThisMonth: number;
}

export interface AffiliateChartData {
  date: string;
  referrals: number;
  successfulReferrals: number;
  commissionAmount: number;
}
