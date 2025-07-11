
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
      console.error('Error fetching roles:', error);
      throw new Error('Không thể tải danh sách vai trò');
    }
  }

  static async createRole(roleData: RoleCreationData): Promise<CustomRole> {
    try {
      const response = await api.post<{ data: any }>('/roles', {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions
      });

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
      console.error('Error creating role:', error);
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
      console.error('Error updating role:', error);
      throw new Error('Không thể cập nhật vai trò');
    }
  }

  static async deleteRole(roleId: string): Promise<void> {
    try {
      await api.delete(`/roles/${roleId}`);
    } catch (error) {
      console.error('Error deleting role:', error);
      throw new Error('Không thể xóa vai trò');
    }
  }
}
