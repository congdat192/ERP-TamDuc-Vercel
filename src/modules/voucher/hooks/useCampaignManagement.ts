
import { useState, useEffect } from 'react';
import { Campaign, CampaignStatus } from '../types/campaign';

// Mock data
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
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-15'),
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
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10'),
    createdBy: 'Manager'
  },
  {
    id: '3',
    name: 'Chương Trình Khách Hàng Thân Thiết',
    types: ['ongoing'],
    schedule: {
      startDate: new Date('2024-01-01'),
      isCustom: true,
      customDescription: 'Chương trình liên tục cho khách hàng VIP'
    },
    status: 'active',
    description: 'Chương trình voucher liên tục cho khách hàng thân thiết',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-01'),
    createdBy: 'System'
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
      schedule: data.schedule,
      status: data.status,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
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
            schedule: data.schedule,
            updatedAt: new Date()
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
        ? { ...campaign, status, updatedAt: new Date() }
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
