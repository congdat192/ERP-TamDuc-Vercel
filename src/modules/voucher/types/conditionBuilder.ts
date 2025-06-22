
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
  code: string;
  description?: string;
  active: boolean;
  priority?: number;
}

export interface ConditionGroupPriority {
  id: string;
  type: 'customerSource' | 'customerType' | 'staffType' | 'denomination' | 'timeSlot';
  priority: number;
  active: boolean;
  description?: string;
}

// Updated mock data to match StaffManager, CustomerSourceManager, CustomerTypeManager
export const MOCK_VALUE_MAPPINGS: ConditionValueMapping[] = [
  // Staff mappings - consistent with StaffManager
  {
    id: '1',
    conditionType: 'staffType',
    conditionValue: 'cskh',
    code: 'CS',
    description: 'CSKH (Bảo Trâm, Anh Thy)',
    active: true,
    priority: 1
  },
  {
    id: '2', 
    conditionType: 'staffType',
    conditionValue: 'telesales',
    code: 'TS',
    description: 'Telesales (Nguyễn Liễu)',
    active: true,
    priority: 2
  },
  {
    id: '3',
    conditionType: 'staffType',
    conditionValue: 'sales',
    code: 'SL',
    description: 'Bán hàng',
    active: false,
    priority: 3
  },
  {
    id: '4',
    conditionType: 'staffType', 
    conditionValue: 'admin',
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
    code: 'WB',
    description: 'Website',
    active: true,
    priority: 1
  },
  {
    id: '6',
    conditionType: 'customerSource',
    conditionValue: 'facebook',
    code: 'FB',
    description: 'Facebook',
    active: true,
    priority: 2
  },
  {
    id: '7',
    conditionType: 'customerSource',
    conditionValue: 'zalo',
    code: 'ZL',
    description: 'Zalo',
    active: true,
    priority: 3
  },
  {
    id: '8',
    conditionType: 'customerSource',
    conditionValue: 'referral',
    code: 'RF',
    description: 'Giới thiệu',
    active: true,
    priority: 4
  },
  {
    id: '9',
    conditionType: 'customerSource',
    conditionValue: 'store',
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
    code: 'VP',
    description: 'Khách hàng VIP',
    active: true,
    priority: 1
  },
  {
    id: '11',
    conditionType: 'customerType',
    conditionValue: 'regular',
    code: 'RG',
    description: 'Khách hàng thường',
    active: true,
    priority: 2
  },
  {
    id: '12',
    conditionType: 'customerType',
    conditionValue: 'new',
    code: 'NW',
    description: 'Khách hàng mới',
    active: true,
    priority: 3
  },
  {
    id: '13',
    conditionType: 'customerType',
    conditionValue: 'business',
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
    code: '50',
    description: '50.000 VNĐ',
    active: true,
    priority: 1
  },
  {
    id: '15',
    conditionType: 'denomination',
    conditionValue: '100000',
    code: '10',
    description: '100.000 VNĐ',
    active: true,
    priority: 2
  },
  {
    id: '16',
    conditionType: 'denomination',
    conditionValue: '200000',
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
    priority: 1,
    active: true,
    description: 'Loại nhân viên xử lý'
  },
  {
    id: '2',
    type: 'customerSource',
    priority: 2,
    active: true,
    description: 'Nguồn khách hàng'
  },
  {
    id: '3',
    type: 'customerType',
    priority: 3,
    active: true,
    description: 'Loại khách hàng'
  },
  {
    id: '4',
    type: 'denomination',
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
