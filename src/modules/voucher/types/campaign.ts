
export type CampaignType = 'monthly' | 'promotion-batch' | 'ongoing';

export type CampaignStatus = 'active' | 'inactive' | 'draft' | 'completed';

export type VoucherType = 'voucher' | 'coupon';

export type StaffType = 'cskh' | 'telesale';

export type CustomerTargetType = 'new' | 'existing' | 'vip' | 'regular' | 'all';

export interface CampaignChoice {
  id: string;
  voucherType: VoucherType;
  staffTypes: StaffType[];
  customerTargets: CustomerTargetType[];
  value: number;
  valueType: 'fixed' | 'percentage';
  conditions: string[];
}

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
  choices: CampaignChoice[];
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
  choices: CampaignChoice[];
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

export const VOUCHER_TYPE_LABELS: Record<VoucherType, string> = {
  'voucher': 'Voucher',
  'coupon': 'Coupon'
};

export const STAFF_TYPE_LABELS: Record<StaffType, string> = {
  'cskh': 'CSKH',
  'telesale': 'Telesale'
};

export const CUSTOMER_TARGET_LABELS: Record<CustomerTargetType, string> = {
  'new': 'Khách Hàng Mới',
  'existing': 'Khách Hàng Cũ',
  'vip': 'Khách VIP',
  'regular': 'Khách Thường',
  'all': 'Tất Cả'
};
