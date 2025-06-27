
export interface FilterCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'between' | 'is_empty' | 'is_not_empty' | 'in_list' | 'not_in_list';
  value: string | string[] | number | boolean;
  displayValue?: string;
}

export interface FilterGroup {
  id: string;
  logic: 'and' | 'or';
  conditions: FilterCondition[];
  groups?: FilterGroup[];
}

export interface AdvancedFilter {
  id: string;
  name?: string;
  description?: string;
  logic: 'and' | 'or';
  groups: FilterGroup[];
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  tags?: string[];
}

export interface FilterResult {
  customerId: string;
  matchedConditions: string[];
  score: number;
}

export interface SavedFilter extends AdvancedFilter {
  customerCount: number;
  lastUsed?: string;
  usageCount: number;
  isStarred: boolean;
  isArchived: boolean;
}

export interface FilterField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'multiselect';
  category: string;
  options?: { value: string; label: string }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export type MessageType = 'zalo' | 'email' | 'sms';

export interface MessageTemplate {
  id: string;
  name: string;
  type: MessageType;
  subject?: string;
  content: string;
  variables: string[];
  isDefault: boolean;
}

export interface ActionHistory {
  id: string;
  action: 'save_filter' | 'export_excel' | 'send_zalo' | 'send_email' | 'send_sms';
  timestamp: string;
  customerCount: number;
  filterName: string;
  details?: Record<string, any>;
  user: string;
}
