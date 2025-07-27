
import { 
  AffiliateF0, 
  AffiliateF1, 
  Commission, 
  AffiliateVoucher, 
  WithdrawalRequest, 
  AffiliateAlert, 
  AffiliateDashboardStats,
  AffiliateChartData
} from '../types';

export const mockF0Data: AffiliateF0[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an@example.com',
    phone: '0901234567',
    status: 'pending',
    totalF1Referrals: 0,
    totalCommission: 0,
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
    vouchersGenerated: 0,
    vouchersUsed: 0,
    registrationDate: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'binh@example.com',
    phone: '0912345678',
    status: 'approved',
    totalF1Referrals: 12,
    totalCommission: 2400000,
    pendingCommission: 800000,
    approvedCommission: 1200000,
    paidCommission: 400000,
    vouchersGenerated: 25,
    vouchersUsed: 18,
    registrationDate: '2024-01-10T09:30:00Z',
    approvalDate: '2024-01-12T14:00:00Z'
  },
  {
    id: '3',
    name: 'Lê Văn Cường',
    email: 'cuong@example.com',
    phone: '0923456789',
    status: 'approved',
    totalF1Referrals: 8,
    totalCommission: 1600000,
    pendingCommission: 400000,
    approvedCommission: 800000,
    paidCommission: 400000,
    vouchersGenerated: 15,
    vouchersUsed: 12,
    registrationDate: '2024-01-08T11:15:00Z',
    approvalDate: '2024-01-10T16:30:00Z'
  },
  {
    id: '4',
    name: 'Phạm Thị Dung',
    email: 'dung@example.com',
    phone: '0934567890',
    status: 'rejected',
    totalF1Referrals: 0,
    totalCommission: 0,
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
    vouchersGenerated: 0,
    vouchersUsed: 0,
    registrationDate: '2024-01-12T13:45:00Z',
    rejectionReason: 'Không đủ điều kiện tham gia chương trình'
  },
  {
    id: '5',
    name: 'Hoàng Văn Em',
    email: 'em@example.com',
    phone: '0945678901',
    status: 'approved',
    totalF1Referrals: 20,
    totalCommission: 4800000,
    pendingCommission: 1200000,
    approvedCommission: 2400000,
    paidCommission: 1200000,
    vouchersGenerated: 40,
    vouchersUsed: 35,
    registrationDate: '2024-01-05T08:20:00Z',
    approvalDate: '2024-01-07T10:00:00Z'
  }
];

export const mockCommissionData: Commission[] = [
  {
    id: '1',
    f0Id: '2',
    f1Id: 'f1_1',
    orderId: 'ORD001',
    orderValue: 2000000,
    commissionRate: 10,
    commissionAmount: 200000,
    status: 'pending',
    createdDate: '2024-01-16T14:30:00Z'
  },
  {
    id: '2',
    f0Id: '2',
    f1Id: 'f1_2',
    orderId: 'ORD002',
    orderValue: 1500000,
    commissionRate: 10,
    commissionAmount: 150000,
    status: 'approved',
    createdDate: '2024-01-15T10:15:00Z',
    approvedDate: '2024-01-16T09:00:00Z'
  },
  {
    id: '3',
    f0Id: '3',
    f1Id: 'f1_3',
    orderId: 'ORD003',
    orderValue: 3000000,
    commissionRate: 10,
    commissionAmount: 300000,
    status: 'paid',
    createdDate: '2024-01-14T16:45:00Z',
    approvedDate: '2024-01-15T11:30:00Z',
    paidDate: '2024-01-16T15:00:00Z'
  }
];

export const mockWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: '1',
    f0Id: '2',
    amount: 1000000,
    status: 'pending',
    requestDate: '2024-01-16T10:00:00Z',
    bankInfo: {
      accountNumber: '1234567890',
      accountName: 'Trần Thị Bình',
      bankName: 'Vietcombank',
      branchName: 'Chi nhánh Hà Nội'
    }
  },
  {
    id: '2',
    f0Id: '3',
    amount: 500000,
    status: 'approved',
    requestDate: '2024-01-15T14:30:00Z',
    bankInfo: {
      accountNumber: '0987654321',
      accountName: 'Lê Văn Cường',
      bankName: 'Techcombank',
      branchName: 'Chi nhánh TP.HCM'
    }
  }
];

export const mockAlertsData: AffiliateAlert[] = [
  {
    id: '1',
    type: 'f0_pending',
    priority: 'warning',
    title: 'F0 Chờ Duyệt',
    message: 'Có 3 F0 mới đang chờ duyệt tham gia chương trình',
    isRead: false,
    createdDate: '2024-01-16T09:00:00Z',
    actionUrl: '/affiliate/f0-approval',
    actionText: 'Xem Chi Tiết'
  },
  {
    id: '2',
    type: 'withdrawal_request',
    priority: 'critical',
    title: 'Yêu Cầu Rút Tiền Mới',
    message: 'Trần Thị Bình yêu cầu rút 1,000,000 VND',
    isRead: false,
    createdDate: '2024-01-16T10:30:00Z',
    actionUrl: '/affiliate/withdrawals',
    actionText: 'Xử Lý'
  },
  {
    id: '3',
    type: 'commission_pending',
    priority: 'info',
    title: 'Hoa Hồng Chờ Duyệt',
    message: '15 khoản hoa hồng đang chờ duyệt với tổng giá trị 3,500,000 VND',
    isRead: false,
    createdDate: '2024-01-16T11:00:00Z',
    actionUrl: '/affiliate/commissions',
    actionText: 'Duyệt Hoa Hồng'
  },
  {
    id: '4',
    type: 'voucher_expiry',
    priority: 'warning',
    title: 'Voucher Sắp Hết Hạn',
    message: '25 voucher sẽ hết hạn trong 3 ngày tới',
    isRead: true,
    createdDate: '2024-01-16T08:00:00Z',
    actionUrl: '/affiliate/vouchers',
    actionText: 'Xem Voucher'
  }
];

export const mockDashboardStats: AffiliateDashboardStats = {
  totalF0: 127,
  totalF1: 1240,
  totalSuccessfulReferrals: 892,
  totalCommissionPaid: 45600000,
  totalCommissionPending: 12800000,
  totalVouchersIssued: 2450,
  newF0Today: 3,
  newF1Today: 18,
  newF0ThisMonth: 22,
  newF1ThisMonth: 165
};

export const mockChartData: AffiliateChartData[] = [
  { date: '2024-01-01', referrals: 12, successfulReferrals: 8, commissionAmount: 1600000 },
  { date: '2024-01-02', referrals: 15, successfulReferrals: 11, commissionAmount: 2200000 },
  { date: '2024-01-03', referrals: 18, successfulReferrals: 14, commissionAmount: 2800000 },
  { date: '2024-01-04', referrals: 22, successfulReferrals: 16, commissionAmount: 3200000 },
  { date: '2024-01-05', referrals: 25, successfulReferrals: 19, commissionAmount: 3800000 },
  { date: '2024-01-06', referrals: 28, successfulReferrals: 21, commissionAmount: 4200000 },
  { date: '2024-01-07', referrals: 32, successfulReferrals: 24, commissionAmount: 4800000 },
  { date: '2024-01-08', referrals: 35, successfulReferrals: 27, commissionAmount: 5400000 },
  { date: '2024-01-09', referrals: 38, successfulReferrals: 29, commissionAmount: 5800000 },
  { date: '2024-01-10', referrals: 42, successfulReferrals: 32, commissionAmount: 6400000 },
  { date: '2024-01-11', referrals: 45, successfulReferrals: 35, commissionAmount: 7000000 },
  { date: '2024-01-12', referrals: 48, successfulReferrals: 38, commissionAmount: 7600000 },
  { date: '2024-01-13', referrals: 52, successfulReferrals: 41, commissionAmount: 8200000 },
  { date: '2024-01-14', referrals: 55, successfulReferrals: 44, commissionAmount: 8800000 },
  { date: '2024-01-15', referrals: 58, successfulReferrals: 47, commissionAmount: 9400000 },
  { date: '2024-01-16', referrals: 62, successfulReferrals: 50, commissionAmount: 10000000 }
];
