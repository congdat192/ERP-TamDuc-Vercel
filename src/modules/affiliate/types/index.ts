
export interface F0User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  totalF1: number;
  totalCommission: number;
  totalVouchers: number;
}

export interface F1User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  f0Id: string;
  f0Name: string;
  firstOrderDate?: string;
  totalOrders: number;
  totalOrderValue: number;
  status: 'active' | 'inactive';
}

export interface Commission {
  id: string;
  f0Id: string;
  f0Name: string;
  f1Id: string;
  f1Name: string;
  orderId: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdDate: string;
  approvedDate?: string;
  paidDate?: string;
}

export interface WithdrawalRequest {
  id: string;
  f0Id: string;
  f0Name: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  processedDate?: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface AffiliateVoucher {
  id: string;
  code: string;
  f0Id: string;
  f0Name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  createdDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userType: 'f0' | 'f1' | 'admin';
  action: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AffiliateStats {
  totalF0Registered: number;
  totalF1Invited: number;
  totalSuccessfulReferrals: number;
  totalCommissionPaid: number;
  totalCommissionPending: number;
  totalVouchersIssued: number;
  newF0Today: number;
  newF1Today: number;
  newF0ThisMonth: number;
  newF1ThisMonth: number;
}

export interface ChartData {
  date: string;
  referrals: number;
  successful: number;
  commission: number;
}

export interface AlertNotification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
