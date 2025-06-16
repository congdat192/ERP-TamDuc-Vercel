
export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal'
  | 'in'
  | 'not_in'
  | 'between'
  | 'is_null'
  | 'is_not_null';

export type FilterFieldType = 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';

export type FilterLogic = 'and' | 'or';

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
  category: 'customer' | 'invoice' | 'product';
  operators: FilterOperator[];
  options?: Array<{ value: string; label: string }>;
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterGroup {
  id: string;
  logic: FilterLogic;
  conditions: FilterCondition[];
  groups?: FilterGroup[];
}

export interface AdvancedFilter {
  id: string;
  name?: string;
  logic: FilterLogic;
  groups: FilterGroup[];
  createdAt: string;
}

export interface FilterResult {
  customers: string[];
  totalCount: number;
  executionTime: number;
}

export interface SavedFilterSegment {
  id: string;
  name: string;
  description?: string;
  filter: AdvancedFilter;
  customerCount: number;
  createdAt: string;
  updatedAt: string;
}
