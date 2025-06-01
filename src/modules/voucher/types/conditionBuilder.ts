
export interface VoucherCondition {
  id: string;
  type: 'customerType' | 'customerSource' | 'employee' | 'custom';
  value: string;
  label: string;
}

export interface ConditionRow {
  id: string;
  conditions: VoucherCondition[];
  prefix: string;
  suffix: string;
  priority: number;
  isDefault?: boolean;
}

export interface ConditionTemplate {
  id: string;
  name: string;
  description?: string;
  conditionRows: ConditionRow[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConditionBuilderSettings {
  codeLength: number;
  conditionRows: ConditionRow[];
  templates: ConditionTemplate[];
}

export const CONDITION_TYPES = [
  { value: 'customerType', label: 'Loại Khách Hàng' },
  { value: 'customerSource', label: 'Nguồn Khách Hàng' },
  { value: 'employee', label: 'Nhân Viên' },
  { value: 'custom', label: 'Tùy Chỉnh' }
];

export const MOCK_CONDITION_VALUES = {
  customerType: [
    { value: 'vip', label: 'VIP' },
    { value: 'premium', label: 'Premium' },
    { value: 'regular', label: 'Thường' },
    { value: 'new', label: 'Mới' }
  ],
  customerSource: [
    { value: 'website', label: 'Website' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'fanpage', label: 'Fanpage' },
    { value: 'referral', label: 'Giới Thiệu' },
    { value: 'hotline', label: 'Hotline' }
  ],
  employee: [
    { value: 'john_doe', label: 'John Doe' },
    { value: 'jane_doe', label: 'Jane Doe' },
    { value: 'telesale_team', label: 'Telesale Team' },
    { value: 'support_team', label: 'Support Team' }
  ],
  custom: []
};
