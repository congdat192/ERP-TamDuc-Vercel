
export interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  memberCount: number;
  managerId?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  memberCount: number;
  isSystem: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  resource?: string;
  description: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  memberCount: number;
  created_at: string;
  updated_at: string;
}

export interface EnhancedUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'locked' | 'pending_verification';
  departmentId?: string;
  department?: Department;
  roleId: string;
  role: Role;
  groupIds: string[];
  groups: UserGroup[];
  lastLogin?: string;
  emailVerified: boolean;
  isActive: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserManagementFilters {
  search?: string;
  status?: string[];
  departmentIds?: string[];
  roleIds?: string[];
  groupIds?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface BulkOperation {
  type: 'activate' | 'deactivate' | 'delete' | 'change_role' | 'change_department' | 'add_to_group';
  userIds: string[];
  params?: Record<string, any>;
}

// Add missing Member and MembersResponse types
export interface Member {
  id: number;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembersResponse {
  total: number;
  per_page: string;
  current_page: string;
  data: Member[];
}
