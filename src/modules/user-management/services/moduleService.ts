
import { ModuleInfo, ApiModulesResponse, FeatureInfo, getFeatureType } from '../types/role-management';
import { api } from '../../../services/apiService';

export class ModuleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    console.log('🚀 [ModuleService] Starting getActiveModules()...');
    
    try {
      console.log('🚀 [ModuleService] Making API call to /modules');
      const response = await api.get<ApiModulesResponse>('/modules', {
        requiresBusinessId: false // Modules API không cần business ID
      });
      
      console.log('✅ [ModuleService] Raw API response:', response);
      console.log('✅ [ModuleService] Response data:', response.data);
      
      // Validate response structure
      if (!response.data || !Array.isArray(response.data)) {
        console.error('❌ [ModuleService] Invalid response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      const modulesList = response.data;
      console.log('📊 [ModuleService] Modules from API:', modulesList);
      console.log('📊 [ModuleService] Modules count:', modulesList.length);
      
      // Transform API response to ModuleInfo format
      const transformedModules = modulesList.map((apiModule, index) => {
        console.log(`🔄 [ModuleService] Transforming module ${index}:`, apiModule);
        
        // Transform features
        const features: FeatureInfo[] = (apiModule.features || []).map(feature => ({
          id: feature.id,
          code: feature.code,
          name: feature.name,
          description: feature.description,
          type: getFeatureType(feature.code)
        }));
        
        // Map module code to appropriate icon
        const getModuleIcon = (code: string): string => {
          switch (code) {
            case 'customer_management': return 'Users';
            case 'pipeline_management': return 'GitBranch';
            case 'member_management': return 'UserCheck';
            case 'role_management': return 'Shield';
            default: return 'Settings';
          }
        };
        
        const transformed: ModuleInfo = {
          id: apiModule.id.toString(),
          code: apiModule.code,
          name: apiModule.name,
          label: apiModule.name,
          description: apiModule.description,
          icon: getModuleIcon(apiModule.code),
          features: features,
          status: 'active' // Assume all returned modules are active
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
      
      // For development: return fallback if API fails
      console.warn('⚠️ [ModuleService] Using fallback modules due to API error');
      
      const fallbackModules: ModuleInfo[] = [
        {
          id: '1',
          code: 'customer_management',
          name: 'Quản lý khách hàng',
          label: 'Quản lý khách hàng',
          description: 'Quản lý khách hàng và thông tin khách hàng',
          icon: 'Users',
          features: [
            { id: 1, code: 'view_customers', name: 'Xem danh sách khách hàng', description: 'Xem danh sách khách hàng', type: 'view' },
            { id: 2, code: 'create_customers', name: 'Tạo khách hàng mới', description: 'Tạo khách hàng mới', type: 'create' },
            { id: 3, code: 'edit_customers', name: 'Sửa thông tin khách hàng', description: 'Sửa thông tin khách hàng', type: 'edit' },
            { id: 4, code: 'delete_customers', name: 'Xóa khách hàng', description: 'Xóa khách hàng', type: 'delete' }
          ],
          status: 'active'
        },
        {
          id: '2',
          code: 'pipeline_management',
          name: 'Quản lý pipeline',
          label: 'Quản lý pipeline',
          description: 'Quản lý pipeline và quy trình bán hàng',
          icon: 'GitBranch',
          features: [
            { id: 5, code: 'view_pipelines', name: 'Xem danh sách pipeline', description: 'Xem danh sách pipeline', type: 'view' },
            { id: 6, code: 'create_pipelines', name: 'Tạo pipeline mới', description: 'Tạo pipeline mới', type: 'create' },
            { id: 7, code: 'edit_pipelines', name: 'Sửa thông tin pipeline', description: 'Sửa thông tin pipeline', type: 'edit' },
            { id: 8, code: 'delete_pipelines', name: 'Xóa pipeline', description: 'Xóa pipeline', type: 'delete' }
          ],
          status: 'active'
        }
      ];
      
      return fallbackModules;
    }
  }
}
