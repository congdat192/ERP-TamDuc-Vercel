
import { ModuleInfo, CustomRole, RoleCreationData } from '../types/role-management';
import { api } from '../../../services/apiService';

export class RoleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    // Sử dụng ModuleService thay vì implement riêng
    const { ModuleService } = await import('./moduleService');
    return ModuleService.getActiveModules();
  }

  static async getRoles(): Promise<CustomRole[]> {
    try {
      const response = await api.get<{ data: any[] }>('/roles');
      
      return response.data.map((role: any) => ({
        id: role.id.toString(),
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || {},
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
      
      // Prepare permissions - ensure it's not empty
      let processedPermissions = roleData.permissions;
      
      // If permissions is empty, provide at least one permission to satisfy backend
      const hasAnyPermissions = Object.values(roleData.permissions).some(perms => 
        Object.values(perms).some(Boolean)
      );
      
      if (!hasAnyPermissions) {
        console.log('🔧 [RoleService] No permissions selected, using empty array');
        // Try sending empty array first, if that fails, we'll provide minimal permission
        processedPermissions = [];
      }
      
      const payload = {
        name: roleData.name,
        description: roleData.description,
        permissions: processedPermissions
      };
      
      console.log('🔧 [RoleService] Final payload:', payload);
      
      const response = await api.post<{ data: any }>('/roles', payload);

      return {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description,
        permissions: response.data.permissions,
        userCount: response.data.user_count || 0,
        isSystem: response.data.is_system || false,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error creating role:', error);
      
      // If the error is about required permissions, try with a different format
      if (error.message && error.message.includes('permissions field is required')) {
        console.log('🔧 [RoleService] Retrying with different permission format');
        
        try {
          const retryPayload = {
            name: roleData.name,
            description: roleData.description,
            permissions: Object.keys(roleData.permissions).length > 0 ? roleData.permissions : {}
          };
          
          console.log('🔧 [RoleService] Retry payload:', retryPayload);
          const response = await api.post<{ data: any }>('/roles', retryPayload);
          
          return {
            id: response.data.id.toString(),
            name: response.data.name,
            description: response.data.description,
            permissions: response.data.permissions,
            userCount: response.data.user_count || 0,
            isSystem: response.data.is_system || false,
            created_at: response.data.created_at,
            updated_at: response.data.updated_at
          };
        } catch (retryError) {
          console.error('❌ [RoleService] Retry also failed:', retryError);
          throw new Error('Không thể tạo vai trò - Vui lòng chọn ít nhất một quyền');
        }
      }
      
      throw new Error('Không thể tạo vai trò');
    }
  }

  static async updateRole(roleId: string, roleData: Partial<RoleCreationData>): Promise<CustomRole> {
    try {
      const response = await api.put<{ data: any }>(`/roles/${roleId}`, roleData);
      
      return {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description,
        permissions: response.data.permissions,
        userCount: response.data.user_count || 0,
        isSystem: response.data.is_system || false,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      };
    } catch (error) {
      console.error('❌ [RoleService] Error updating role:', error);
      throw new Error('Không thể cập nhật vai trò');
    }
  }

  static async deleteRole(roleId: string): Promise<void> {
    try {
      await api.delete(`/roles/${roleId}`);
    } catch (error) {
      console.error('❌ [RoleService] Error deleting role:', error);
      throw new Error('Không thể xóa vai trò');
    }
  }
}
