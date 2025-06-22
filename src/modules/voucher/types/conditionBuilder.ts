export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string | string[];
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
}

export interface FilterGroup {
  id: string;
  conditions: FilterCondition[];
  operator: 'AND' | 'OR';
}

export interface ConditionTemplate {
  id: string;
  name: string;
  description: string;
  groups: FilterGroup[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConditionValueMapping {
  id: string;
  conditionType: 'customerSource' | 'customerType' | 'staffType' | 'denomination' | 'timeSlot';
  conditionValue: string;
  value: string; // Added missing property
  label: string; // Added missing property
  code: string;
  description?: string;
  active: boolean;
  priority?: number;
}

export interface ConditionGroupPriority {
  id: string;
  type: 'customerSource' | 'customerType' | 'staffType' | 'denomination' | 'timeSlot';
  label: string; // Added missing property
  priority: number;
  active: boolean;
  description?: string;
}

// Updated ConditionRow interface
export interface ConditionRow {
  id: string;
  field: string;
  operator: string;
  value: string;
  conditions: VoucherCondition[]; // Added missing property
  prefix: string; // Added missing property
  suffix: string; // Added missing property
  priority: number; // Added missing property
  isDefault?: boolean; // Added missing property
}

// Updated VoucherCondition interface
export interface VoucherCondition {
  id: string;
  type: string;
  operator: string;
  value: string | string[];
  label: string; // Added missing property
}

// Updated mock data to match ConditionValueMapping interface
export const MOCK_VALUE_MAPPINGS: ConditionValueMapping[] = [
  // Staff mappings - consistent with StaffManager
  {
    id: '1',
    conditionType: 'staffType',
    conditionValue: 'cskh',
    value: 'cskh',
    label: 'CSKH',
    code: 'CS',
    description: 'CSKH (Bảo Trâm, Anh Thy)',
    active: true,
    priority: 1
  },
  {
    id: '2', 
    conditionType: 'staffType',
    conditionValue: 'telesales',
    value: 'telesales',
    label: 'Telesales',
    code: 'TS',
    description: 'Telesales (Nguyễn Liễu)',
    active: true,
    priority: 2
  },
  {
    id: '3',
    conditionType: 'staffType',
    conditionValue: 'sales',
    value: 'sales',
    label: 'Bán hàng',
    code: 'SL',
    description: 'Bán hàng',
    active: false,
    priority: 3
  },
  {
    id: '4',
    conditionType: 'staffType', 
    conditionValue: 'admin',
    value: 'admin',
    label: 'Quản lý',
    code: 'AD',
    description: 'Quản lý',
    active: false,
    priority: 4
  },

  // Customer source mappings - consistent with CustomerSourceManager
  {
    id: '5',
    conditionType: 'customerSource',
    conditionValue: 'website',
    value: 'website',
    label: 'Website',
    code: 'WB',
    description: 'Website',
    active: true,
    priority: 1
  },
  {
    id: '6',
    conditionType: 'customerSource',
    conditionValue: 'facebook',
    value: 'facebook',
    label: 'Facebook',
    code: 'FB',
    description: 'Facebook',
    active: true,
    priority: 2
  },
  {
    id: '7',
    conditionType: 'customerSource',
    conditionValue: 'zalo',
    value: 'zalo',
    label: 'Zalo',
    code: 'ZL',
    description: 'Zalo',
    active: true,
    priority: 3
  },
  {
    id: '8',
    conditionType: 'customerSource',
    conditionValue: 'referral',
    value: 'referral',
    label: 'Giới thiệu',
    code: 'RF',
    description: 'Giới thiệu',
    active: true,
    priority: 4
  },
  {
    id: '9',
    conditionType: 'customerSource',
    conditionValue: 'store',
    value: 'store',
    label: 'Tại cửa hàng',
    code: 'ST',
    description: 'Tại cửa hàng',
    active: true,
    priority: 5
  },

  // Customer type mappings - consistent with CustomerTypeManager
  {
    id: '10',
    conditionType: 'customerType',
    conditionValue: 'vip',
    value: 'vip',
    label: 'Khách hàng VIP',
    code: 'VP',
    description: 'Khách hàng VIP',
    active: true,
    priority: 1
  },
  {
    id: '11',
    conditionType: 'customerType',
    conditionValue: 'regular',
    value: 'regular',
    label: 'Khách hàng thường',
    code: 'RG',
    description: 'Khách hàng thường',
    active: true,
    priority: 2
  },
  {
    id: '12',
    conditionType: 'customerType',
    conditionValue: 'new',
    value: 'new',
    label: 'Khách hàng mới',
    code: 'NW',
    description: 'Khách hàng mới',
    active: true,
    priority: 3
  },
  {
    id: '13',
    conditionType: 'customerType',
    conditionValue: 'business',
    value: 'business',
    label: 'Khách hàng doanh nghiệp',
    code: 'BZ',
    description: 'Khách hàng doanh nghiệp',
    active: true,
    priority: 4
  },

  // Denomination mappings
  {
    id: '14',
    conditionType: 'denomination',
    conditionValue: '50000',
    value: '50000',
    label: '50.000 VNĐ',
    code: '50',
    description: '50.000 VNĐ',
    active: true,
    priority: 1
  },
  {
    id: '15',
    conditionType: 'denomination',
    conditionValue: '100000',
    value: '100000',
    label: '100.000 VNĐ',
    code: '10',
    description: '100.000 VNĐ',
    active: true,
    priority: 2
  },
  {
    id: '16',
    conditionType: 'denomination',
    conditionValue: '200000',
    value: '200000',
    label: '200.000 VNĐ',
    code: '20',
    description: '200.000 VNĐ',
    active: true,
    priority: 3
  }
];

export const MOCK_GROUP_PRIORITIES: ConditionGroupPriority[] = [
  {
    id: '1',
    type: 'staffType',
    label: 'Loại nhân viên xử lý',
    priority: 1,
    active: true,
    description: 'Loại nhân viên xử lý'
  },
  {
    id: '2',
    type: 'customerSource',
    label: 'Nguồn khách hàng',
    priority: 2,
    active: true,
    description: 'Nguồn khách hàng'
  },
  {
    id: '3',
    type: 'customerType',
    label: 'Loại khách hàng',
    priority: 3,
    active: true,
    description: 'Loại khách hàng'
  },
  {
    id: '4',
    type: 'denomination',
    label: 'Mệnh giá voucher',
    priority: 4,
    active: false,
    description: 'Mệnh giá voucher'
  }
];

export const CONDITION_TYPE_LABELS = {
  customerSource: 'Nguồn Khách Hàng',
  customerType: 'Loại Khách Hàng', 
  staffType: 'Loại Nhân Viên',
  denomination: 'Mệnh Giá',
  timeSlot: 'Khung Giờ'
};

// Legacy exports for backward compatibility
export const CONDITION_TYPES = [
  { value: 'customerSource', label: 'Nguồn Khách Hàng' },
  { value: 'customerType', label: 'Loại Khách Hàng' },
  { value: 'staffType', label: 'Loại Nhân Viên' },
  { value: 'denomination', label: 'Mệnh Giá' }
];

// Updated MOCK_CONDITION_VALUES to be properly typed array
export const MOCK_CONDITION_VALUES: Record<string, Array<{value: string, label: string}>> = {
  customerSource: [
    { value: 'website', label: 'Website' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'zalo', label: 'Zalo' },
    { value: 'referral', label: 'Giới thiệu' },
    { value: 'store', label: 'Tại cửa hàng' }
  ],
  customerType: [
    { value: 'vip', label: 'Khách hàng VIP' },
    { value: 'regular', label: 'Khách hàng thường' },
    { value: 'new', label: 'Khách hàng mới' },
    { value: 'business', label: 'Khách hàng doanh nghiệp' }
  ],
  staffType: [
    { value: 'cskh', label: 'CSKH' },
    { value: 'telesales', label: 'Telesales' },
    { value: 'sales', label: 'Bán hàng' },
    { value: 'admin', label: 'Quản lý' }
  ],
  denomination: [
    { value: '50000', label: '50.000 VNĐ' },
    { value: '100000', label: '100.000 VNĐ' },
    { value: '200000', label: '200.000 VNĐ' }
  ]
};

// Keep legacy export as alias
export { MOCK_VALUE_MAPPINGS as MOCK_CONDITION_VALUES };
