
import { ModuleInfo } from '../types/role-management';
import { api } from '../../../services/apiService';

export class ModuleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    try {
      const response = await api.get<{ data: any[] }>('/modules', {
        requiresBusinessId: false // Modules API không cần business ID
      });
      
      // Transform API response to ModuleInfo format
      return response.data.map((module: any) => ({
        id: module.id.toString(),
        name: module.name,
        label: module.display_name || module.name,
        icon: module.icon || 'Settings',
        features: [], // Không cần features chi tiết nữa
        status: module.status || 'active'
      }));
    } catch (error) {
      console.error('Error fetching modules:', error);
      throw new Error('Không thể tải danh sách modules');
    }
  }
}
