
import { 
  F0User, 
  F1User, 
  Commission, 
  WithdrawalRequest, 
  AffiliateVoucher, 
  ActivityLog, 
  AffiliateStats, 
  ChartData, 
  AlertNotification 
} from '../types';

// Mock data
const mockF0Users: F0User[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    registrationDate: '2024-01-15',
    status: 'pending',
    totalF1: 5,
    totalCommission: 2500000,
    totalVouchers: 12
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0912345678',
    registrationDate: '2024-01-10',
    status: 'approved',
    totalF1: 8,
    totalCommission: 4200000,
    totalVouchers: 20
  },
  {
    id: '3',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0923456789',
    registrationDate: '2024-01-20',
    status: 'pending',
    totalF1: 3,
    totalCommission: 1800000,
    totalVouchers: 8
  }
];

const mockWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: '1',
    f0Id: '2',
    f0Name: 'Trần Thị B',
    amount: 1000000,
    requestDate: '2024-01-25',
    status: 'pending',
    bankInfo: {
      bankName: 'Vietcombank',
      accountNumber: '0123456789',
      accountName: 'Tran Thi B'
    }
  },
  {
    id: '2',
    f0Id: '1',
    f0Name: 'Nguyễn Văn A',
    amount: 500000,
    requestDate: '2024-01-24',
    status: 'approved',
    processedDate: '2024-01-25',
    bankInfo: {
      bankName: 'Techcombank',
      accountNumber: '9876543210',
      accountName: 'Nguyen Van A'
    }
  }
];

const mockCommissions: Commission[] = [
  {
    id: '1',
    f0Id: '2',
    f0Name: 'Trần Thị B',
    f1Id: 'f1_1',
    f1Name: 'Phạm Văn D',
    orderId: 'ORD001',
    orderValue: 1500000,
    commissionRate: 10,
    commissionAmount: 150000,
    status: 'pending',
    createdDate: '2024-01-25'
  },
  {
    id: '2',
    f0Id: '1',
    f0Name: 'Nguyễn Văn A',
    f1Id: 'f1_2',
    f1Name: 'Hoàng Thị E',
    orderId: 'ORD002',
    orderValue: 2000000,
    commissionRate: 10,
    commissionAmount: 200000,
    status: 'approved',
    createdDate: '2024-01-24',
    approvedDate: '2024-01-25'
  }
];

const mockAlerts: AlertNotification[] = [
  {
    id: '1',
    type: 'critical',
    title: 'F0 chờ duyệt',
    message: '3 F0 mới đăng ký cần được duyệt',
    timestamp: '2024-01-25T10:00:00Z',
    isRead: false,
    actionUrl: '/ERP/Affiliate/f0-approval'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Yêu cầu rút tiền',
    message: '2 yêu cầu rút tiền mới cần xử lý',
    timestamp: '2024-01-25T09:30:00Z',
    isRead: false,
    actionUrl: '/ERP/Affiliate/withdrawal-management'
  },
  {
    id: '3',
    type: 'info',
    title: 'Hoa hồng mới',
    message: '5 hoa hồng mới được tạo hôm nay',
    timestamp: '2024-01-25T08:15:00Z',
    isRead: true
  }
];

const mockStats: AffiliateStats = {
  totalF0Registered: 156,
  totalF1Invited: 1243,
  totalSuccessfulReferrals: 987,
  totalCommissionPaid: 45200000,
  totalCommissionPending: 12300000,
  totalVouchersIssued: 2456,
  newF0Today: 3,
  newF1Today: 12,
  newF0ThisMonth: 28,
  newF1ThisMonth: 187
};

const mockChartData: ChartData[] = [
  { date: '2024-01-19', referrals: 15, successful: 12, commission: 2400000 },
  { date: '2024-01-20', referrals: 18, successful: 14, commission: 2800000 },
  { date: '2024-01-21', referrals: 12, successful: 10, commission: 2000000 },
  { date: '2024-01-22', referrals: 20, successful: 16, commission: 3200000 },
  { date: '2024-01-23', referrals: 25, successful: 20, commission: 4000000 },
  { date: '2024-01-24', referrals: 22, successful: 18, commission: 3600000 },
  { date: '2024-01-25', referrals: 28, successful: 24, commission: 4800000 }
];

// Mock service functions
export const affiliateService = {
  // Dashboard data
  getAffiliateStats: async (): Promise<AffiliateStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStats;
  },

  getChartData: async (): Promise<ChartData[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockChartData;
  },

  getAlerts: async (): Promise<AlertNotification[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAlerts;
  },

  // Quick lists for dashboard
  getPendingF0: async (): Promise<F0User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockF0Users.filter(f0 => f0.status === 'pending').slice(0, 5);
  },

  getRecentWithdrawals: async (): Promise<WithdrawalRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockWithdrawalRequests.slice(0, 5);
  },

  getRecentCommissions: async (): Promise<Commission[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCommissions.slice(0, 5);
  },

  // Full data for detail pages
  getAllF0Users: async (): Promise<F0User[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockF0Users;
  },

  getAllWithdrawalRequests: async (): Promise<WithdrawalRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockWithdrawalRequests;
  },

  getAllCommissions: async (): Promise<Commission[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockCommissions;
  }
};
