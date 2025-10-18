
export interface Role {
  id: number; // Changed from string to number to match API
  name: string;
  description?: string;
  permissions: Permission[];
  memberCount?: number;
  isSystem?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number; // Changed from string to number to match API
  code: string;
  name: string;
  description: string;
}


export interface EnhancedUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'locked' | 'pending_verification';
  roleId: string;
  role: Role;
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
  roleIds?: number[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface BulkOperation {
  type: 'activate' | 'deactivate' | 'delete' | 'change_role';
  userIds: string[];
  params?: Record<string, any>;
}

// API Member types (matching actual API response)
export interface Member {
  id: number; // API returns number
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_owner: boolean;
  role_id?: number; // New: role_id FK to roles table
  roles?: Role; // Changed: single role object (not array) from JOIN
  created_at: string;
  updated_at: string;
}

export interface MembersResponse {
  total: number;
  per_page: number; // Changed from string to number
  current_page: number; // Changed from string to number
  data: Member[];
}
