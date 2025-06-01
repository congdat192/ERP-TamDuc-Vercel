
export type CampaignType = 'monthly' | 'promotion-batch' | 'ongoing';

export type CampaignStatus = 'active' | 'inactive' | 'draft' | 'completed';

export interface CampaignSchedule {
  startDate: Date;
  endDate?: Date;
  isCustom: boolean;
  customDescription?: string;
}

export interface Campaign {
  id: string;
  name: string;
  types: CampaignType[];
  schedule: CampaignSchedule;
  status: CampaignStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CampaignFormData {
  name: string;
  types: CampaignType[];
  schedule: CampaignSchedule;
  status: CampaignStatus;
  description?: string;
}

export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  'monthly': 'Hàng Tháng',
  'promotion-batch': 'Đợt Khuyến Mãi',
  'ongoing': 'Liên Tục'
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  'active': 'Hoạt Động',
  'inactive': 'Tạm Dừng',
  'draft': 'Nháp',
  'completed': 'Hoàn Thành'
};
