import { ModuleInfo, CustomRole, RoleCreationData, ModulePermissions } from '../types/role-management';
import { api } from '../../../services/apiService';

interface RoleApiResponse {
  data: any;
  [key: string]: any;
}

export class RoleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    // Sử dụng ModuleService thay vì implement riêng
    const { ModuleService } = await import('./moduleService');
    return ModuleService.getActiveModules();
  }

  static async getRoles(): Promise<CustomRole[]> {
    try {
      console.log('🔍 [RoleService] Fetching roles...');
      const response = await api.get<{ data: any[] }>('/roles');
      console.log('✅ [RoleService] Raw roles response:', response);
      
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
      console.log('🔧 [RoleService] Creating role with original data:', roleData);
      
      // Transform permissions to match backend expectations
      // Based on API docs, backend might expect permissions as an array or different structure
      const transformedPermissions = this.transformPermissionsForBackend(roleData.permissions);
      
      const payload = {
        name: roleData.name,
        description: roleData.description,
        permissions: transformedPermissions
      };
      
      console.log('🔧 [RoleService] Transformed payload for backend:', payload);
      console.log('🔧 [RoleService] Permissions structure:', JSON.stringify(transformedPermissions, null, 2));
      
      const response = await api.post<RoleApiResponse>('/roles', payload);
      console.log('✅ [RoleService] Backend response:', response);

      return {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description,
        permissions: response.data.permissions || {},
        userCount: response.data.user_count || 0,
        isSystem: response.data.is_system || false,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      };
    } catch (error: any) {
      console.error('❌ [RoleService] Error creating role:', error);
      console.error('❌ [RoleService] Error response:', error.response?.data);
      console.error('❌ [RoleService] Error status:', error.response?.status);
      
      // Extract detailed error message from backend
      let errorMessage = 'Không thể tạo vai trò';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        console.log('🔍 [RoleService] Backend error details:', errorData);
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.errors) {
          // Handle validation errors
          const validationErrors = Object.values(errorData.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
      }
      
      throw new Error(errorMessage);
    }
  }

  private static transformPermissionsForBackend(permissions: ModulePermissions): any {
    console.log('🔄 [RoleService] Transforming permissions:', permissions);
    
    // Try different transformation strategies based on common backend patterns
    
    // Strategy 1: Keep as object (current approach)
    const strategyObject = permissions;
    
    // Strategy 2: Transform to array of permission strings
    const strategyArray: string[] = [];
    Object.entries(permissions).forEach(([moduleId, perms]) => {
      Object.entries(perms).forEach(([action, allowed]) => {
        if (allowed) {
          strategyArray.push(`${moduleId}.${action}`);
        }
      });
    });
    
    // Strategy 3: Flat object with dot notation
    const strategyFlat: { [key: string]: boolean } = {};
    Object.entries(permissions).forEach(([moduleId, perms]) => {
      Object.entries(perms).forEach(([action, allowed]) => {
        strategyFlat[`${moduleId}.${action}`] = allowed;
      });
    });
    
    // Strategy 4: Nested structure with arrays
    const strategyNested: { [key: string]: string[] } = {};
    Object.entries(permissions).forEach(([moduleId, perms]) => {
      const allowedActions = Object.entries(perms)
        .filter(([_, allowed]) => allowed)
        .map(([action, _]) => action);
      
      if (allowedActions.length > 0) {
        strategyNested[moduleId] = allowedActions;
      }
    });
    
    console.log('🔄 [RoleService] Transformation strategies:');
    console.log('  - Object:', strategyObject);
    console.log('  - Array:', strategyArray);
    console.log('  - Flat:', strategyFlat);
    console.log('  - Nested:', strategyNested);
    
    // Start with the object approach (current), but log all strategies for debugging
    // If this fails, we can quickly try other approaches
    return strategyObject;
  }

  static async updateRole(roleId: string, roleData: Partial<RoleCreationData>): Promise<CustomRole> {
    try {
      console.log('🔧 [RoleService] Updating role:', roleId, roleData);
      
      const payload = { ...roleData };
      if (roleData.permissions) {
        payload.permissions = this.transformPermissionsForBackend(roleData.permissions);
      }
      
      console.log('🔧 [RoleService] Update payload:', payload);
      
      const response = await api.put<RoleApiResponse>(`/roles/${roleId}`, payload);
      
      return {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description,
        permissions: response.data.permissions || {},
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
