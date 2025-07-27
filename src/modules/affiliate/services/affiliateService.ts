
import { apiClient } from '@/lib/api-client';
import { ReferrerAccount, AffiliateVoucher, CommissionRecord, AffiliateStats } from '../types';

export class AffiliateService {
  // Mock data for development
  private static mockReferrers: ReferrerAccount[] = [
    {
      id: '1',
      userId: 'user1',
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      phone: '0901234567',
      referralCode: 'REF001',
      status: 'active',
      totalVouchersIssued: 25,
      totalCommissionEarned: 2450000,
      totalReferrals: 18,
      createdAt: '2024-01-15T08:00:00Z',
      lastActivity: '2024-01-27T10:30:00Z',
      kiotVietConfig: {
        retailerId: 'retailer001',
        isConnected: true,
        lastSync: '2024-01-27T09:00:00Z'
      }
    },
    {
      id: '2',
      userId: 'user2',
      fullName: 'Trần Thị B',
      email: 'tranthib@gmail.com',
      phone: '0912345678',
      referralCode: 'REF002',
      status: 'active',
      totalVouchersIssued: 15,
      totalCommissionEarned: 1200000,
      totalReferrals: 12,
      createdAt: '2024-01-10T09:00:00Z',
      lastActivity: '2024-01-26T14:20:00Z',
      kiotVietConfig: {
        retailerId: 'retailer002',
        isConnected: true,
        lastSync: '2024-01-26T13:00:00Z'
      }
    },
    {
      id: '3',
      userId: 'user3',
      fullName: 'Lê Minh C',
      email: 'leminhc@gmail.com',
      phone: '0923456789',
      referralCode: 'REF003',
      status: 'inactive',
      totalVouchersIssued: 8,
      totalCommissionEarned: 650000,
      totalReferrals: 5,
      createdAt: '2024-01-05T10:00:00Z',
      lastActivity: '2024-01-20T16:45:00Z',
      kiotVietConfig: {
        retailerId: 'retailer003',
        isConnected: false,
        lastSync: '2024-01-20T15:00:00Z'
      }
    }
  ];

  static async getReferrers(): Promise<ReferrerAccount[]> {
    // Mock API call - replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockReferrers), 500);
    });
  }

  static async getReferrerById(id: string): Promise<ReferrerAccount | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const referrer = this.mockReferrers.find(r => r.id === id);
        resolve(referrer || null);
      }, 300);
    });
  }

  static async updateReferrerStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        const referrer = this.mockReferrers.find(r => r.id === id);
        if (referrer) {
          referrer.status = status;
        }
        resolve();
      }, 500);
    });
  }

  static async getAffiliateStats(): Promise<AffiliateStats> {
    return new Promise(resolve => {
      setTimeout(() => {
        const stats: AffiliateStats = {
          totalReferrers: this.mockReferrers.length,
          activeReferrers: this.mockReferrers.filter(r => r.status === 'active').length,
          totalVouchersIssued: this.mockReferrers.reduce((sum, r) => sum + r.totalVouchersIssued, 0),
          totalVouchersUsed: Math.floor(this.mockReferrers.reduce((sum, r) => sum + r.totalVouchersIssued, 0) * 0.7),
          totalCommissionPaid: this.mockReferrers.reduce((sum, r) => sum + r.totalCommissionEarned, 0),
          totalSalesGenerated: this.mockReferrers.reduce((sum, r) => sum + r.totalCommissionEarned, 0) * 20,
          conversionRate: 0.72,
          averageOrderValue: 850000
        };
        resolve(stats);
      }, 300);
    });
  }

  static async getVouchersByReferrer(referrerId: string): Promise<AffiliateVoucher[]> {
    // Mock voucher data
    const mockVouchers: AffiliateVoucher[] = [
      {
        id: '1',
        referrerId,
        referrerName: 'Nguyễn Văn A',
        voucherCode: 'DISCOUNT10A001',
        discountType: 'percentage',
        discountValue: 10,
        status: 'used',
        issuedAt: '2024-01-27T09:00:00Z',
        usedAt: '2024-01-27T15:30:00Z',
        expiresAt: '2024-02-27T09:00:00Z',
        customerPhone: '0987654321',
        orderId: 'ORDER001',
        orderValue: 1200000,
        commissionAmount: 60000,
        kiotVietVoucherId: 'KV001'
      }
    ];

    return new Promise(resolve => {
      setTimeout(() => resolve(mockVouchers), 400);
    });
  }

  static async getCommissionRecords(referrerId?: string): Promise<CommissionRecord[]> {
    // Mock commission data
    const mockCommissions: CommissionRecord[] = [
      {
        id: '1',
        referrerId: '1',
        referrerName: 'Nguyễn Văn A',
        voucherId: '1',
        voucherCode: 'DISCOUNT10A001',
        orderId: 'ORDER001',
        orderValue: 1200000,
        commissionRate: 5,
        commissionAmount: 60000,
        status: 'paid',
        createdAt: '2024-01-27T15:30:00Z',
        paidAt: '2024-01-28T10:00:00Z',
        customerInfo: {
          phone: '0987654321',
          name: 'Khách hàng A'
        }
      }
    ];

    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = referrerId 
          ? mockCommissions.filter(c => c.referrerId === referrerId)
          : mockCommissions;
        resolve(filtered);
      }, 400);
    });
  }
}
