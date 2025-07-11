
import { ModuleInfo } from '../types/role-management';
import { api } from '../../../services/apiService';

interface ModuleApiResponse {
  data?: any[];
  modules?: any[];
  [key: string]: any; // Allow for flexible API response structure
}

export class ModuleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    try {
      const response = await api.get<ModuleApiResponse>('/modules', {
        requiresBusinessId: false // Modules API không cần business ID
      });
      
      console.log('🔧 [ModuleService] Raw API response:', response);
      console.log('🔧 [ModuleService] Response data:', response.data);
      
      // Check if response.data is an array or has nested data property
      let modulesList: any[] = [];
      if (Array.isArray(response.data)) {
        modulesList = response.data;
      } else if (response?.data && Array.isArray(response.data.data)) {
        modulesList = response.data.data;
      } else if (response?.data && response.data.modules && Array.isArray(response.data.modules)) {
        modulesList = response.data.modules;
      } else {
        console.error('🔧 [ModuleService] Unexpected response structure:', response);
        throw new Error('Unexpected API response structure');
      }
      
      console.log('🔧 [ModuleService] Processed modules list:', modulesList);
      
      // Transform API response to ModuleInfo format
      const transformedModules = modulesList.map((module: any) => {
        const transformed: ModuleInfo = {
          id: module.id ? module.id.toString() : Math.random().toString(),
          name: module.name || module.module_name || 'Unknown Module',
          label: module.display_name || module.label || module.name || 'Unknown Module',
          icon: module.icon || 'Settings',
          features: module.features || [],
          status: (module.status || 'active') as 'active' | 'inactive'
        };
        console.log('🔧 [ModuleService] Transformed module:', transformed);
        return transformed;
      });
      
      console.log('🔧 [ModuleService] Final transformed modules:', transformedModules);
      return transformedModules;
    } catch (error) {
      console.error('❌ [ModuleService] Error fetching modules:', error);
      
      // Fallback: Return some basic modules if API fails
      const fallbackModules: ModuleInfo[] = [
        {
          id: 'voucher',
          name: 'voucher',
          label: 'Quản Lý Voucher',
          icon: 'Ticket',
          features: [],
          status: 'active'
        },
        {
          id: 'customer',
          name: 'customer',
          label: 'Quản Lý Khách Hàng',
          icon: 'Users',
          features: [],
          status: 'active'
        },
        {
          id: 'admin',
          name: 'admin',
          label: 'Quản Trị Hệ Thống',
          icon: 'Shield',
          features: [],
          status: 'active'
        }
      ];
      
      console.log('🔧 [ModuleService] Using fallback modules:', fallbackModules);
      return fallbackModules;
    }
  }
}
