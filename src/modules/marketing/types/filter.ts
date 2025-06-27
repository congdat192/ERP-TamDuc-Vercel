
export type FilterOperator = 
  | 'equals' | 'not_equals' | 'contains' | 'not_contains' 
  | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' 
  | 'greater_equal' | 'less_equal' | 'between' | 'is_empty' 
  | 'is_not_empty' | 'in_list' | 'not_in_list' | 'is_null' | 'is_not_null' | 'in' | 'not_in';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | string[] | number | boolean | { from?: string; to?: string };
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
  customers: string[];
  totalCount: number;
  executionTime: number;
}

export interface SavedFilter extends AdvancedFilter {
  customerCount: number;
  lastUsed?: string;
  usageCount: number;
  isStarred: boolean;
  isArchived: boolean;
}

export interface SavedFilterSegment {
  id: string;
  name: string;
  description: string;
  filter: AdvancedFilter;
  customerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FilterField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'multiselect' | 'string';
  category: string;
  operators: FilterOperator[];
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

export type ActionType = 'save_filter' | 'export_excel' | 'send_zalo' | 'send_email' | 'send_sms';

export interface ActionHistory {
  id: string;
  action: ActionType;
  timestamp: string;
  customerCount: number;
  filterName: string;
  details?: Record<string, any>;
  user: string;
}

export interface ActionHistoryItem {
  id: string;
  type: ActionType;
  timestamp: string;
  customerCount: number;
  filterName?: string;
  filterSnapshot?: AdvancedFilter;
  details?: Record<string, any>;
}
