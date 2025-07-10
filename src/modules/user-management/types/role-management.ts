
export interface ModuleInfo {
  id: string;
  name: string;
  label: string;
  icon: string;
  features: string[];
  status: 'active' | 'inactive';
}

export interface CustomPermission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface ModulePermissions {
  [moduleId: string]: CustomPermission;
}

export interface RoleCreationData {
  name: string;
  description: string;
  permissions: ModulePermissions;
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: ModulePermissions;
  userCount: number;
  isSystem: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoleFilters {
  search?: string;
  isSystem?: boolean;
}
