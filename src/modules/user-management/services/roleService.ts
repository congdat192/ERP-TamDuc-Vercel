
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
        // Parse permissions từ array of objects thành array of IDs
        const permissionIds = role.permissions ? role.permissions.map(p => p.id) : [];
        
        console.log(`🔧 [RoleService] Role "${role.name}" permissions:`, {
          original: role.permissions,
          parsed: permissionIds
        });
        
        return {
          id: role.id.toString(),
          name: role.name,
          description: role.description || '',
          permissions: permissionIds, // Array of permission IDs
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
      
      // Parse permissions từ array of objects thành array of IDs
      const permissionIds = response.permissions ? response.permissions.map(p => p.id) : [];
      
      console.log(`🔧 [RoleService] Role "${response.name}" permissions:`, {
        original: response.permissions,
        parsed: permissionIds
      });
      
      return {
        id: response.id.toString(),
        name: response.name,
        description: response.description || '',
        permissions: permissionIds, // Array of permission IDs
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
      
      const payload = {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions
      };
      
      console.log('🔧 [RoleService] Sending payload to backend:', JSON.stringify(payload, null, 2));
      
      const response = await api.post<ApiRoleResponse>('/roles', payload);
      console.log('✅ [RoleService] Backend response:', response);

      // Parse permissions từ response
      const permissionIds = response.permissions ? response.permissions.map(p => p.id) : [];

      return {
        id: response.id.toString(),
        name: response.name,
        description: response.description,
        permissions: permissionIds,
        userCount: 0,
        isSystem: false,
        created_at: response.created_at,
        updated_at: response.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error creating role:', error);
      
      let errorMessage = 'Không thể tạo vai trò';
      
      if (error.response?.data?.message) {
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
      
      const payload = {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions || []
      };
      
      console.log('🔧 [RoleService] Update payload:', JSON.stringify(payload, null, 2));
      
      const response = await api.put<ApiRoleResponse>(`/roles/${roleId}`, payload);
      console.log('✅ [RoleService] Update response:', response);
      
      // Parse permissions từ response
      const permissionIds = response.permissions ? response.permissions.map(p => p.id) : [];
      
      return {
        id: response.id.toString(),
        name: response.name,
        description: response.description,
        permissions: permissionIds,
        userCount: 0,
        isSystem: false,
        created_at: response.created_at,
        updated_at: response.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error updating role:', error);
      
      let errorMessage = 'Không thể cập nhật vai trò';
      
      if (error.response?.status === 422) {
        errorMessage = 'Tên vai trò đã tồn tại hoặc dữ liệu không hợp lệ';
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'Vai trò không tồn tại hoặc đã bị xóa';
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
      
      await api.delete(`/roles/${roleId}`);
      console.log('✅ [RoleService] Role deleted successfully');
    } catch (error: any) {
      console.error('❌ [RoleService] Error deleting role:', error);
      
      let errorMessage = 'Không thể xóa vai trò';
      
      if (error.response?.status === 404) {
        errorMessage = 'Vai trò không tồn tại hoặc đã bị xóa';
      } else if (error.response?.status === 400) {
        errorMessage = 'Không thể xóa vai trò đang được sử dụng';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
}
