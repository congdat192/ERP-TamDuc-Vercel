import { CustomRole, RoleCreationData } from '../types/role-management';
import { api } from '../../../services/apiService';

// API Permission object từ backend
interface ApiPermission {
  id: number;
  code: string;
  name: string;
  description: string;
}

// API Role response từ backend
interface ApiRoleResponse {
  id: number;
  business_id: number;
  name: string;
  description: string;
  permissions: ApiPermission[]; // Array of permission objects
  created_at: string;
  updated_at: string;
}

// API Response wrapper cho danh sách roles
interface RolesApiResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: ApiRoleResponse[];
}

export class RoleService {
  static async getRoles(): Promise<CustomRole[]> {
    try {
      console.log('🔍 [RoleService] Fetching roles...');
      const response = await api.get<RolesApiResponse>('/roles');
      console.log('✅ [RoleService] Raw roles response:', response);
      
      return response.data.map((role: ApiRoleResponse) => {
        // Parse permissions từ array of objects thành array of codes
        const permissionCodes = role.permissions ? role.permissions.map(p => p.code) : [];
        
        console.log(`🔧 [RoleService] Role "${role.name}" permissions:`, {
          original: role.permissions,
          parsed: permissionCodes
        });
        
        return {
          id: role.id, // Keep as number to match API
          name: role.name,
          description: role.description || '',
          permissions: permissionCodes, // Array of permission codes
          userCount: 0, // Không có trong API response
          isSystem: false, // Không có trong API response
          created_at: role.created_at,
          updated_at: role.updated_at
        };
      });
    } catch (error) {
      console.error('❌ [RoleService] Error fetching roles:', error);
      throw new Error('Không thể tải danh sách vai trò');
    }
  }

  static async getRoleById(roleId: string): Promise<CustomRole> {
    try {
      console.log('🔍 [RoleService] Fetching role by ID:', roleId);
      const response = await api.get<ApiRoleResponse>(`/roles/${roleId}`);
      console.log('✅ [RoleService] Raw role response:', response);
      
      // Parse permissions từ array of objects thành array of codes
      const permissionCodes = response.permissions ? response.permissions.map(p => p.code) : [];
      
      console.log(`🔧 [RoleService] Role "${response.name}" permissions:`, {
        original: response.permissions,
        parsed: permissionCodes
      });
      
      return {
        id: response.id, // Keep as number to match API
        name: response.name,
        description: response.description || '',
        permissions: permissionCodes, // Array of permission codes
        userCount: 0, // Không có trong API response
        isSystem: false, // Không có trong API response
        created_at: response.created_at,
        updated_at: response.updated_at
      };
    } catch (error) {
      console.error('❌ [RoleService] Error fetching role by ID:', error);
      throw new Error('Không thể tải thông tin vai trò');
    }
  }

  static async createRole(roleData: RoleCreationData): Promise<CustomRole> {
    try {
      console.log('🔧 [RoleService] Creating role with data:', roleData);
      
      // Validate permissions array
      if (!Array.isArray(roleData.permissions) || roleData.permissions.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một quyền cho vai trò');
      }

      // Ensure permissions are strings (codes)
      const permissions = roleData.permissions.map(code => {
        if (typeof code !== 'string') {
          throw new Error('Permission code phải là chuỗi');
        }
        return code;
      });
      
      const payload = {
        name: roleData.name.trim(),
        description: roleData.description?.trim() || '',
        permissions: permissions // Array of permission codes
      };
      
      console.log('🔧 [RoleService] Sending payload to backend:', JSON.stringify(payload, null, 2));
      
      const response = await api.post<ApiRoleResponse>('/roles', payload);
      console.log('✅ [RoleService] Backend response:', response);

      // Parse permissions từ response
      const permissionCodes = response.permissions ? response.permissions.map(p => p.code) : [];

      return {
        id: response.id, // Keep as number to match API
        name: response.name,
        description: response.description,
        permissions: permissionCodes,
        userCount: 0,
        isSystem: false,
        created_at: response.created_at,
        updated_at: response.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error creating role:', error);
      
      let errorMessage = 'Không thể tạo vai trò';
      
      // Handle specific API errors
      if (error.response?.status === 422) {
        if (error.response?.data?.message === 'Tên vai trò đã tồn tại') {
          errorMessage = 'Tên vai trò đã tồn tại trong hệ thống';
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          if (errors.name) {
            errorMessage = `Tên vai trò: ${errors.name[0]}`;
          } else if (errors.permissions) {
            errorMessage = `Quyền hạn: ${errors.permissions[0]}`;
          } else {
            errorMessage = 'Dữ liệu không hợp lệ';
          }
        } else {
          errorMessage = error.response.data.message || 'Dữ liệu không hợp lệ';
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng liên hệ quản trị viên.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('❌ [RoleService] Final error message:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  static async updateRole(roleId: string, roleData: Partial<RoleCreationData>): Promise<CustomRole> {
    try {
      console.log('🔧 [RoleService] Updating role:', roleId, roleData);
      
      // Validate permissions array if provided
      if (roleData.permissions && (!Array.isArray(roleData.permissions) || roleData.permissions.length === 0)) {
        throw new Error('Vui lòng chọn ít nhất một quyền cho vai trò');
      }

      // Ensure permissions are strings (codes) if provided
      let permissions: string[] = [];
      if (roleData.permissions) {
        permissions = roleData.permissions.map(code => {
          if (typeof code !== 'string') {
            throw new Error('Permission code phải là chuỗi');
          }
          return code;
        });
      }
      
      const payload: any = {};
      if (roleData.name !== undefined) payload.name = roleData.name.trim();
      if (roleData.description !== undefined) payload.description = roleData.description?.trim() || '';
      if (roleData.permissions !== undefined) payload.permissions = permissions;
      
      console.log('🔧 [RoleService] Update payload:', JSON.stringify(payload, null, 2));
      
      const response = await api.put<ApiRoleResponse>(`/roles/${roleId}`, payload);
      console.log('✅ [RoleService] Update response:', response);
      
      // Parse permissions từ response
      const permissionCodes = response.permissions ? response.permissions.map(p => p.code) : [];
      
      return {
        id: response.id, // Keep as number to match API
        name: response.name,
        description: response.description,
        permissions: permissionCodes,
        userCount: 0,
        isSystem: false,
        created_at: response.created_at,
        updated_at: response.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error updating role:', error);
      
      let errorMessage = 'Không thể cập nhật vai trò';
      
      // Handle specific API errors
      if (error.response?.status === 422) {
        if (error.response?.data?.message === 'Tên vai trò đã tồn tại') {
          errorMessage = 'Tên vai trò đã tồn tại trong hệ thống';
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          if (errors.name) {
            errorMessage = `Tên vai trò: ${errors.name[0]}`;
          } else if (errors.permissions) {
            errorMessage = `Quyền hạn: ${errors.permissions[0]}`;
          } else {
            errorMessage = 'Dữ liệu không hợp lệ';
          }
        } else {
          errorMessage = error.response.data.message || 'Dữ liệu không hợp lệ';
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'Vai trò không tồn tại hoặc đã bị xóa';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng liên hệ quản trị viên.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  static async deleteRole(roleId: string): Promise<void> {
    try {
      console.log('🗑️ [RoleService] Deleting role:', roleId);
      
      const response = await api.delete(`/roles/${roleId}`);
      console.log('✅ [RoleService] Role deleted successfully:', response);
    } catch (error: any) {
      console.error('❌ [RoleService] Error deleting role:', error);
      
      let errorMessage = 'Không thể xóa vai trò';
      
      // Handle specific API errors
      if (error.response?.status === 404) {
        errorMessage = 'Vai trò không tồn tại hoặc đã bị xóa';
      } else if (error.response?.status === 400) {
        if (error.response?.data?.message === 'Không thể xóa vai trò đang được sử dụng') {
          errorMessage = 'Không thể xóa vai trò này vì đang có người dùng sử dụng';
        } else {
          errorMessage = error.response.data.message || 'Không thể xóa vai trò';
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng liên hệ quản trị viên.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
}
