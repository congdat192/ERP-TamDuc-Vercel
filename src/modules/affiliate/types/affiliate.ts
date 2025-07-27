
export interface F0User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  approvalDate?: string;
  totalReferrals: number;
  totalCommissions: number;
  availableBalance: number;
  cccdId?: string;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  address?: string;
  notes?: string;
  createdBy?: string;
  lastLogin?: string;
}

export interface F1Customer {
  id: string;
  phone: string;
  fullName?: string;
  email?: string;
  referredBy: string; // F0 ID
  referredDate: string;
  voucherCode?: string;
  voucherStatus: 'sent' | 'used' | 'expired' | 'pending';
  purchaseAmount?: number;
  commissionAmount?: number;
  commissionStatus: 'pending' | 'paid' | 'cancelled';
  invoiceNumber?: string;
  purchaseDate?: string;
}

export interface Referral {
  id: string;
  f0Id: string;
  f0Name: string;
  f1Phone: string;
  f1Name?: string;
  referralDate: string;
  voucherCode?: string;
  voucherStatus: 'sent' | 'used' | 'expired' | 'pending';
  commissionAmount?: number;
  commissionStatus: 'pending' | 'paid' | 'cancelled';
  invoiceNumber?: string;
  purchaseDate?: string;
  notes?: string;
}

export interface WithdrawalRequest {
  id: string;
  f0Id: string;
  f0Name: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  processedDate?: string;
  processedBy?: string;
  notes?: string;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
}

export interface Commission {
  id: string;
  f0Id: string;
  f1Phone: string;
  amount: number;
  referralId: string;
  invoiceNumber: string;
  earnedDate: string;
  status: 'pending' | 'paid' | 'cancelled';
  paidDate?: string;
  notes?: string;
}

export interface SystemSettings {
  dailyReferralLimit: number;
  inviteDelayMinutes: number;
  minimumWithdrawal: number;
  voucherValidityDays: number;
  commissionRate: number;
  autoApproveF0: boolean;
  autoApproveWithdrawal: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
}

export interface AffiliateStats {
  totalF0s: number;
  activeF0s: number;
  pendingF0s: number;
  totalF1s: number;
  successfulReferrals: number;
  totalCommissionsPaid: number;
  pendingCommissions: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  conversionRate: number;
  averageCommissionPerF0: number;
  topPerformers: Array<{
    f0Id: string;
    f0Name: string;
    totalReferrals: number;
    totalCommissions: number;
  }>;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'f0' | 'f1' | 'referral' | 'withdrawal' | 'system';
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

// Form interfaces
export interface F0RegistrationForm {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface F0LoginForm {
  phoneOrEmail: string;
  password: string;
}

export interface F1ReferralForm {
  f1Phone: string;
}

export interface WithdrawalForm {
  amount: number;
  bankAccount: string;
  bankName: string;
  bankBranch: string;
  notes?: string;
}

export interface F0ProfileForm {
  fullName: string;
  phone: string;
  email: string;
  cccdId: string;
  bankAccount: string;
  bankName: string;
  bankBranch: string;
  address: string;
}

// Filter interfaces
export interface F0Filter {
  status?: string;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  search?: string;
}

export interface ReferralFilter {
  f0Id?: string;
  voucherStatus?: string;
  commissionStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface WithdrawalFilter {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
