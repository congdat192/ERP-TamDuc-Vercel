import { CustomRole, RoleCreationData } from '../types/role-management';
import { api } from '../../../services/apiService';

interface RoleApiResponse {
  id: number;
  name: string;
  description: string;
  permissions: number[];
  user_count: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

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
  name: string;
  description: string;
  permissions: ApiPermission[]; // Array of permission objects
  user_count?: number;
  is_system?: boolean;
  created_at: string;
  updated_at: string;
}

export class RoleService {
  static async getRoles(): Promise<CustomRole[]> {
    try {
      console.log('🔍 [RoleService] Fetching roles...');
      const response = await api.get<{ data: ApiRoleResponse[] }>('/roles');
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
          userCount: role.user_count || 0,
          isSystem: role.is_system || false,
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
        userCount: response.user_count || 0,
        isSystem: response.is_system || false,
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
      console.log('🔧 [RoleService] API endpoint: POST /roles');
      console.log('🔧 [RoleService] Permissions array:', payload.permissions);
      
      const response = await api.post<RoleApiResponse>('/roles', payload);
      console.log('✅ [RoleService] Backend response:', response);
      console.log('✅ [RoleService] Response structure:', JSON.stringify(response, null, 2));

      // API trả về direct object, không có wrapper
      return {
        id: response.id.toString(),
        name: response.name,
        description: response.description,
        permissions: response.permissions || [],
        userCount: response.user_count || 0,
        isSystem: response.is_system || false,
        created_at: response.created_at,
        updated_at: response.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error creating role:', error);
      console.error('❌ [RoleService] Error details:');
      console.error('  - Status:', error.response?.status);
      console.error('  - Status Text:', error.response?.statusText);
      console.error('  - Response Data:', error.response?.data);
      console.error('  - Request Headers:', error.config?.headers);
      console.error('  - Request URL:', error.config?.url);
      console.error('  - Request Data:', error.config?.data);
      
      // Extract chi tiết error message từ backend
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
      
      // Theo API documentation, sử dụng endpoint /roles/ và truyền ID trong payload
      const payload = {
        id: parseInt(roleId), // Truyền ID trong payload
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions || [] // Array of feature IDs
      };
      
      console.log('🔧 [RoleService] Update payload:', JSON.stringify(payload, null, 2));
      console.log('🔧 [RoleService] API endpoint: PUT /roles');
      console.log('🔧 [RoleService] Permissions being sent:', payload.permissions);
      
      // Sử dụng endpoint /roles thay vì /roles/{id}
      const response = await api.put<RoleApiResponse>('/roles', payload);
      console.log('✅ [RoleService] Update response:', response);
      
      // Parse permissions nếu backend trả về array of objects
      let permissionIds = [];
      if (Array.isArray(response.permissions)) {
        if (response.permissions.length > 0 && typeof response.permissions[0] === 'object') {
          // Backend trả về array of objects
          permissionIds = response.permissions.map((p: any) => p.id);
        } else {
          // Backend trả về array of IDs
          permissionIds = response.permissions;
        }
      }
      
      console.log('🔧 [RoleService] Parsed permissions from response:', permissionIds);
      
      return {
        id: response.id.toString(),
        name: response.name,
        description: response.description,
        permissions: permissionIds,
        userCount: response.user_count || 0,
        isSystem: response.is_system || false,
        created_at: response.created_at,
        updated_at: response.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error updating role:', error);
      console.error('❌ [RoleService] Error response:', error.response?.data);
      console.error('❌ [RoleService] Error status:', error.response?.status);
      console.error('❌ [RoleService] Error headers:', error.response?.headers);
      
      let errorMessage = 'Không thể cập nhật vai trò';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('❌ [RoleService] Final error message:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  static async deleteRole(roleId: string): Promise<void> {
    try {
      console.log('🗑️ [RoleService] Deleting role:', roleId);
      
      // Theo API documentation, sử dụng endpoint /roles/{id}
      await api.delete(`/roles/${roleId}`);
      console.log('✅ [RoleService] Role deleted successfully');
    } catch (error: any) {
      console.error('❌ [RoleService] Error deleting role:', error);
      console.error('❌ [RoleService] Error response:', error.response?.data);
      console.error('❌ [RoleService] Error status:', error.response?.status);
      
      let errorMessage = 'Không thể xóa vai trò';
      
      // Xử lý specific error cases
      if (error.response?.status === 500) {
        errorMessage = 'Lỗi hệ thống: Có thể database chưa được cấu hình đầy đủ. Vui lòng liên hệ quản trị viên.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('❌ [RoleService] Final error message:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}
