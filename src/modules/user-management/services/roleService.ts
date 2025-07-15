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

export class RoleService {
  static async getRoles(): Promise<CustomRole[]> {
    try {
      console.log('🔍 [RoleService] Fetching roles...');
      const response = await api.get<{ data: any[] }>('/roles');
      console.log('✅ [RoleService] Raw roles response:', response);
      
      return response.data.map((role: any) => ({
        id: role.id.toString(),
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || [],
        userCount: role.user_count || 0,
        isSystem: role.is_system || false,
        created_at: role.created_at,
        updated_at: role.updated_at
      }));
    } catch (error) {
      console.error('❌ [RoleService] Error fetching roles:', error);
      throw new Error('Không thể tải danh sách vai trò');
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
      
      const response = await api.post<RoleApiResponse>('/roles', payload);
      console.log('✅ [RoleService] Backend response:', response);
      console.log('✅ [RoleService] Response structure:', JSON.stringify(response, null, 2));

      // Parse response - backend trả về direct object, không có wrapper
      const roleData_response = response as RoleApiResponse;
      
      return {
        id: roleData_response.id.toString(),
        name: roleData_response.name,
        description: roleData_response.description,
        permissions: roleData_response.permissions || [],
        userCount: roleData_response.user_count || 0,
        isSystem: roleData_response.is_system || false,
        created_at: roleData_response.created_at,
        updated_at: roleData_response.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error creating role:', error);
      
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
      
      const payload = {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions || [] // Array of feature IDs
      };
      
      console.log('🔧 [RoleService] Update payload:', payload);
      
      const response = await api.put<RoleApiResponse>(`/roles/${roleId}`, payload);
      
      return {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description,
        permissions: response.data.permissions || [],
        userCount: response.data.user_count || 0,
        isSystem: response.data.is_system || false,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error updating role:', error);
      console.error('❌ [RoleService] Error response:', error.response?.data);
      
      let errorMessage = 'Không thể cập nhật vai trò';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
      console.error('❌ [RoleService] Error response:', error.response?.data);
      
      let errorMessage = 'Không thể xóa vai trò';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }
}
