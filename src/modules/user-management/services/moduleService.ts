
import { ModuleInfo } from '../types/role-management';
import { api } from '../../../services/apiService';

interface ModuleApiResponse {
  data?: any;
  modules?: any;
  [key: string]: any; // Allow for flexible API response structure
}

export class ModuleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    console.log('🚀 [ModuleService] Starting getActiveModules()...');
    
    try {
      console.log('🚀 [ModuleService] Making API call to /modules');
      const response = await api.get<ModuleApiResponse>('/modules', {
        requiresBusinessId: false // Modules API không cần business ID
      });
      
      console.log('✅ [ModuleService] Raw API response:', response);
      console.log('✅ [ModuleService] Response data:', response.data);
      console.log('✅ [ModuleService] Response type:', typeof response.data);
      console.log('✅ [ModuleService] Is response.data array?', Array.isArray(response.data));
      
      // Check if response.data is an array or has nested data property
      let modulesList: any[] = [];
      const responseData = response.data as any;
      
      console.log('🔍 [ModuleService] Processing responseData:', responseData);
      
      if (Array.isArray(responseData)) {
        console.log('📋 [ModuleService] Direct array found, using responseData');
        modulesList = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        console.log('📋 [ModuleService] Nested data array found, using responseData.data');
        modulesList = responseData.data;
      } else if (responseData && responseData.modules && Array.isArray(responseData.modules)) {
        console.log('📋 [ModuleService] Nested modules array found, using responseData.modules');
        modulesList = responseData.modules;
      } else {
        console.error('❌ [ModuleService] Unexpected response structure:', response);
        console.error('❌ [ModuleService] responseData:', responseData);
        console.error('❌ [ModuleService] responseData keys:', Object.keys(responseData || {}));
        
        // If empty response, we'll use fallback but also log this issue
        console.warn('⚠️ [ModuleService] Empty modules response from API, using fallback modules');
        modulesList = [];
      }
      
      console.log('📊 [ModuleService] Final modules list:', modulesList);
      console.log('📊 [ModuleService] Modules count:', modulesList.length);
      
      // If API returns empty array or fails, use comprehensive fallback modules
      if (modulesList.length === 0) {
        console.log('🔄 [ModuleService] No data from API, using comprehensive fallback modules');
        
        const fallbackModules: ModuleInfo[] = [
          {
            id: 'voucher',
            name: 'voucher',
            label: 'Quản Lý Voucher',
            icon: 'Ticket',
            features: ['view', 'add', 'edit', 'delete'],
            status: 'active'
          },
          {
            id: 'customer',
            name: 'customer',
            label: 'Quản Lý Khách Hàng',
            icon: 'Users',
            features: ['view', 'add', 'edit', 'delete'],
            status: 'active'
          },
          {
            id: 'admin',
            name: 'admin',
            label: 'Quản Trị Hệ Thống',
            icon: 'Shield',
            features: ['view', 'add', 'edit', 'delete'],
            status: 'active'
          },
          {
            id: 'inventory',
            name: 'inventory',
            label: 'Quản Lý Kho',
            icon: 'Package',
            features: ['view', 'add', 'edit', 'delete'],
            status: 'active'
          },
          {
            id: 'sales',
            name: 'sales', 
            label: 'Quản Lý Bán Hàng',
            icon: 'ShoppingCart',
            features: ['view', 'add', 'edit', 'delete'],
            status: 'active'
          },
          {
            id: 'marketing',
            name: 'marketing',
            label: 'Marketing',
            icon: 'Target',
            features: ['view', 'add', 'edit', 'delete'],
            status: 'active'
          },
          {
            id: 'analytics',
            name: 'analytics',
            label: 'Báo Cáo & Phân Tích',
            icon: 'BarChart3',
            features: ['view', 'add', 'edit', 'delete'],
            status: 'active'
          },
          {
            id: 'settings',
            name: 'settings',
            label: 'Cài Đặt Hệ Thống',
            icon: 'Settings',
            features: ['view', 'add', 'edit', 'delete'],
            status: 'active'
          }
        ];
        
        console.log('🔄 [ModuleService] Using fallback modules:', fallbackModules);
        return fallbackModules;
      }
      
      // Transform API response to ModuleInfo format
      const transformedModules = modulesList.map((module: any, index: number) => {
        console.log(`🔄 [ModuleService] Transforming module ${index}:`, module);
        
        // Extract features/permissions from module data
        let features = ['view', 'add', 'edit', 'delete']; // Default features
        
        if (module.features && Array.isArray(module.features)) {
          features = module.features;
        } else if (module.permissions && Array.isArray(module.permissions)) {
          features = module.permissions;
        } else if (module.actions && Array.isArray(module.actions)) {
          features = module.actions;
        }
        
        const transformed: ModuleInfo = {
          id: module.id ? module.id.toString() : `module_${index}`,
          name: module.name || module.module_name || module.code || `module_${index}`,
          label: module.display_name || module.label || module.title || module.name || 'Unknown Module',
          icon: module.icon || 'Settings',
          features: features,
          status: (module.status || module.is_active !== false ? 'active' : 'inactive') as 'active' | 'inactive'
        };
        
        console.log(`✅ [ModuleService] Transformed module ${index}:`, transformed);
        return transformed;
      });
      
      console.log('🎉 [ModuleService] Final transformed modules:', transformedModules);
      console.log('🎉 [ModuleService] Returning', transformedModules.length, 'modules');
      return transformedModules;
      
    } catch (error) {
      console.error('💥 [ModuleService] Error in getActiveModules:', error);
      console.error('💥 [ModuleService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        response: (error as any).response?.data
      });
      
      // Enhanced fallback: Return comprehensive modules if API fails
      const fallbackModules: ModuleInfo[] = [
        {
          id: 'voucher',
          name: 'voucher',
          label: 'Quản Lý Voucher',
          icon: 'Ticket',
          features: ['view', 'add', 'edit', 'delete'],
          status: 'active'
        },
        {
          id: 'customer',
          name: 'customer',
          label: 'Quản Lý Khách Hàng',
          icon: 'Users',
          features: ['view', 'add', 'edit', 'delete'],
          status: 'active'
        },
        {
          id: 'admin',
          name: 'admin',
          label: 'Quản Trị Hệ Thống',
          icon: 'Shield',
          features: ['view', 'add', 'edit', 'delete'],
          status: 'active'
        },
        {
          id: 'inventory',
          name: 'inventory',
          label: 'Quản Lý Kho',
          icon: 'Package',
          features: ['view', 'add', 'edit', 'delete'],
          status: 'active'
        },
        {
          id: 'sales',
          name: 'sales',
          label: 'Quản Lý Bán Hàng',
          icon: 'ShoppingCart',
          features: ['view', 'add', 'edit', 'delete'],
          status: 'active'
        },
        {
          id: 'marketing',
          name: 'marketing',
          label: 'Marketing',
          icon: 'Target',
          features: ['view', 'add', 'edit', 'delete'],
          status: 'active'
        },
        {
          id: 'analytics',
          name: 'analytics',
          label: 'Báo Cáo & Phân Tích',
          icon: 'BarChart3',
          features: ['view', 'add', 'edit', 'delete'],
          status: 'active'
        },
        {
          id: 'settings',
          name: 'settings',
          label: 'Cài Đặt Hệ Thống',
          icon: 'Settings',
          features: ['view', 'add', 'edit', 'delete'],
          status: 'active'
        }
      ];
      
      console.log('🔄 [ModuleService] Using enhanced fallback modules due to error:', fallbackModules);
      return fallbackModules;
    }
  }
}
