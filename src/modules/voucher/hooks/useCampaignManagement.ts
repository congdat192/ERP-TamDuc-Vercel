
import { useState, useEffect } from 'react';
import { Campaign, CampaignStatus } from '../types/campaign';

// Mock data with choices
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Khuyến Mãi Black Friday 2024',
    types: ['promotion-batch'],
    schedule: {
      startDate: new Date('2024-11-25'),
      endDate: new Date('2024-11-30'),
      isCustom: false
    },
    status: 'active',
    description: 'Chiến dịch khuyến mãi đặc biệt dành cho Black Friday',
    choices: [
      {
        id: 'choice1',
        voucherType: 'coupon',
        staffTypes: ['telesales'],
        customerTargets: ['new', 'vip'],
        value: 15,
        valueType: 'percentage',
        conditions: ['Áp dụng cho đơn hàng từ 500,000 VNĐ', 'Có hiệu lực trong 30 ngày']
      }
    ],
    startDate: new Date('2024-11-25').toISOString(),
    endDate: new Date('2024-11-30').toISOString(),
    isActive: true,
    conditions: [],
    voucherTemplate: {
      prefix: 'BF',
      length: 8,
      format: 'alphanumeric'
    },
    createdAt: new Date('2024-11-01').toISOString(),
    updatedAt: new Date('2024-11-15').toISOString(),
    createdBy: 'Admin'
  },
  {
    id: '2',
    name: 'Voucher Hàng Tháng Tháng 12',
    types: ['monthly'],
    schedule: {
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      isCustom: false
    },
    status: 'draft',
    description: 'Voucher hàng tháng cho tháng 12/2024',
    choices: [
      {
        id: 'choice2',
        voucherType: 'voucher',
        staffTypes: ['cskh', 'telesales'],
        customerTargets: ['all'],
        value: 100000,
        valueType: 'fixed',
        conditions: ['Chỉ sử dụng 1 lần/khách hàng']
      }
    ],
    startDate: new Date('2024-12-01').toISOString(),
    endDate: new Date('2024-12-31').toISOString(),
    isActive: false,
    conditions: [],
    voucherTemplate: {
      prefix: 'VM',
      length: 10,
      format: 'numeric'
    },
    createdAt: new Date('2024-11-10').toISOString(),
    updatedAt: new Date('2024-11-10').toISOString(),
    createdBy: 'Manager'
  }
];

export function useCampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setLoading(false);
    }, 1000);
  }, []);

  const createCampaign = async (data: any): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: data.name,
      types: data.types,
      schedule: {
        startDate: data.schedule.startDate,
        endDate: data.schedule.endDate,
        isCustom: data.schedule.isCustom,
        customDescription: data.schedule.customDescription
      },
      status: data.status || 'draft',
      description: data.description,
      choices: data.choices || [],
      startDate: data.schedule.startDate.toISOString(),
      endDate: data.schedule.endDate ? data.schedule.endDate.toISOString() : '',
      isActive: data.status === 'active',
      conditions: [],
      voucherTemplate: {
        prefix: 'NEW',
        length: 8,
        format: 'alphanumeric'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User'
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setLoading(false);
  };

  const updateCampaign = async (id: string, data: any): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id 
        ? {
            ...campaign,
            ...data,
            schedule: {
              ...campaign.schedule,
              ...data.schedule
            },
            updatedAt: new Date().toISOString()
          }
        : campaign
    ));
    setLoading(false);
  };

  const deleteCampaign = async (id: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    setLoading(false);
  };

  const bulkUpdateStatus = async (ids: string[], status: CampaignStatus): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCampaigns(prev => prev.map(campaign => 
      ids.includes(campaign.id) 
        ? { ...campaign, status, updatedAt: new Date().toISOString() }
        : campaign
    ));
    setLoading(false);
  };

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    bulkUpdateStatus
  };
}
