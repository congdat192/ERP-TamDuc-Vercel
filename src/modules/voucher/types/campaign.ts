
export type StaffType = 'cskh' | 'telesales' | 'admin' | 'sales';
export type CustomerTargetType = 'new' | 'existing' | 'vip' | 'regular' | 'business' | 'all';
export type VoucherType = 'voucher' | 'coupon';
export type CampaignType = 'monthly' | 'promotion-batch' | 'ongoing';
export type CampaignStatus = 'active' | 'inactive' | 'draft' | 'completed';

export interface CampaignCondition {
  id: string;
  type: 'customerSource' | 'customerType' | 'staffType' | 'timeRange' | 'denomination';
  operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'between' | 'greaterThan' | 'lessThan';
  value: string | string[] | number | number[];
  label: string;
}

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
  description: string;
  types: CampaignType[];
  schedule: CampaignSchedule;
  status: CampaignStatus;
  choices: CampaignChoice[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  conditions: CampaignCondition[];
  voucherTemplate: {
    prefix: string;
    suffix?: string;
    length: number;
    format: 'alphanumeric' | 'numeric' | 'alphabetic';
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFormData {
  name: string;
  description: string;
  types: CampaignType[];
  schedule: CampaignSchedule;
  status: CampaignStatus;
  choices: CampaignChoice[];
}

// Updated staff type labels to match StaffManager
export const STAFF_TYPE_LABELS: Record<StaffType, string> = {
  cskh: 'CSKH',
  telesales: 'Telesales', 
  admin: 'Quản lý',
  sales: 'Bán hàng'
};

// Updated customer target labels to match CustomerTypeManager
export const CUSTOMER_TARGET_LABELS: Record<CustomerTargetType, string> = {
  new: 'Khách hàng mới',
  existing: 'Khách hàng cũ',
  vip: 'Khách hàng VIP',
  regular: 'Khách hàng thường',
  business: 'Khách hàng doanh nghiệp',
  all: 'Tất cả khách hàng'
};

export const VOUCHER_TYPE_LABELS: Record<VoucherType, string> = {
  voucher: 'Voucher',
  coupon: 'Coupon'
};

export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  monthly: 'Hàng tháng',
  'promotion-batch': 'Đợt khuyến mãi',
  ongoing: 'Liên tục'
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  active: 'Đang hoạt động',
  inactive: 'Tạm dừng',
  draft: 'Nháp',
  completed: 'Hoàn thành'
};

// Customer source options consistent with CustomerSourceManager
export const CUSTOMER_SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'zalo', label: 'Zalo' },
  { value: 'referral', label: 'Giới thiệu' },
  { value: 'store', label: 'Tại cửa hàng' }
];

// Staff options consistent with StaffManager mock data
export const STAFF_OPTIONS = [
  { value: 'cskh', label: 'CSKH', staff: ['Bảo Trâm', 'Anh Thy'] },
  { value: 'telesales', label: 'Telesales', staff: ['Nguyễn Liễu'] },
  { value: 'sales', label: 'Bán hàng', staff: [] },
  { value: 'admin', label: 'Quản lý', staff: [] }
];
