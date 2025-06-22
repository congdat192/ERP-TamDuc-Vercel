
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

export interface ConditionValueMapping {
  id: string;
  conditionType: 'customerType' | 'customerSource' | 'employee';
  value: string;
  label: string;
  code: string; // 1-2 character code for prefix generation
  active: boolean;
}

export interface ConditionGroupPriority {
  id: string;
  type: 'customerType' | 'customerSource' | 'employee';
  label: string;
  priority: number;
  active: boolean;
}

export interface ConditionTemplate {
  id: string;
  name: string;
  description?: string;
  conditionRows: ConditionRow[];
  valueMappings: ConditionValueMapping[];
  groupPriorities: ConditionGroupPriority[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConditionBuilderSettings {
  codeLength: number;
  conditionRows: ConditionRow[];
  templates: ConditionTemplate[];
  valueMappings: ConditionValueMapping[];
  groupPriorities: ConditionGroupPriority[];
}

export const CONDITION_TYPES = [
  { value: 'customerType', label: 'Loại Khách Hàng' },
  { value: 'customerSource', label: 'Nguồn Khách Hàng' },
  { value: 'employee', label: 'Nhân Viên' }
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
  ]
};

// Mock default mappings
export const MOCK_VALUE_MAPPINGS: ConditionValueMapping[] = [
  { id: '1', conditionType: 'customerType', value: 'vip', label: 'VIP', code: 'V', active: true },
  { id: '2', conditionType: 'customerType', value: 'premium', label: 'Premium', code: 'P', active: true },
  { id: '3', conditionType: 'customerType', value: 'regular', label: 'Thường', code: 'R', active: true },
  { id: '4', conditionType: 'customerType', value: 'new', label: 'Mới', code: 'N', active: true },
  { id: '5', conditionType: 'customerSource', value: 'website', label: 'Website', code: 'W', active: true },
  { id: '6', conditionType: 'customerSource', value: 'facebook', label: 'Facebook', code: 'F', active: true },
  { id: '7', conditionType: 'customerSource', value: 'fanpage', label: 'Fanpage', code: 'FP', active: true },
  { id: '8', conditionType: 'customerSource', value: 'referral', label: 'Giới Thiệu', code: 'GT', active: true },
  { id: '9', conditionType: 'employee', value: 'john_doe', label: 'John Doe', code: 'JD', active: true },
  { id: '10', conditionType: 'employee', value: 'jane_doe', label: 'Jane Doe', code: 'JA', active: true }
];

export const MOCK_GROUP_PRIORITIES: ConditionGroupPriority[] = [
  { id: '1', type: 'employee', label: 'Nhân Viên', priority: 1, active: true },
  { id: '2', type: 'customerType', label: 'Loại Khách Hàng', priority: 2, active: true },
  { id: '3', type: 'customerSource', label: 'Nguồn Khách Hàng', priority: 3, active: true }
];
