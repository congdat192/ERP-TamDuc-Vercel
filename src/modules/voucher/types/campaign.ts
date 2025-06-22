
export type StaffType = 'cskh' | 'telesales' | 'admin' | 'sales';
export type CustomerTargetType = 'new' | 'existing' | 'vip' | 'regular' | 'business';

export interface CampaignCondition {
  id: string;
  type: 'customerSource' | 'customerType' | 'staffType' | 'timeRange' | 'denomination';
  operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'between' | 'greaterThan' | 'lessThan';
  value: string | string[] | number | number[];
  label: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
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
  business: 'Khách hàng doanh nghiệp'
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
