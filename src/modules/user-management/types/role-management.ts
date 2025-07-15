
// API Feature structure từ backend
export interface ApiFeature {
  id: number;
  module_id: number;
  code: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// API Module structure từ backend
export interface ApiModule {
  id: number;
  code: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  features: ApiFeature[];
}

// API Response structure cho GET /modules
export interface ApiModulesResponse {
  data: ApiModule[];
}

// Frontend ModuleInfo structure (transformed từ API)
export interface ModuleInfo {
  id: string;
  code: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  features: FeatureInfo[];
  status: 'active' | 'inactive';
}

// Frontend Feature structure
export interface FeatureInfo {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'view' | 'create' | 'edit' | 'delete';
}

// Permission selection state cho UI
export interface PermissionSelection {
  [moduleId: string]: {
    [featureId: number]: boolean;
  };
}

// Legacy types for backward compatibility with existing components
export interface CustomPermission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface ModulePermissions {
  [moduleId: string]: CustomPermission;
}

// Role creation data - permissions là array các feature IDs
export interface RoleCreationData {
  name: string;
  description: string;
  permissions: number[]; // Array of feature IDs: [1,2,3,4]
}

// Custom Role structure
export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: number[]; // Array of feature IDs
  userCount: number;
  isSystem: boolean;
  created_at: string;
  updated_at: string;
}

// Role filters
export interface RoleFilters {
  search?: string;
  isSystem?: boolean;
}

// Helper function để map feature code to type
export const getFeatureType = (code: string): 'view' | 'create' | 'edit' | 'delete' => {
  if (code.includes('view') || code.includes('read')) return 'view';
  if (code.includes('create') || code.includes('add')) return 'create';
  if (code.includes('edit') || code.includes('update')) return 'edit';
  if (code.includes('delete') || code.includes('remove')) return 'delete';
  return 'view'; // default fallback
};
