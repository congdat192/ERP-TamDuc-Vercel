
import { ModuleInfo, ApiModulesResponse, FeatureInfo, getFeatureType } from '../types/role-management';
import { api } from '../../../services/apiService';

export class ModuleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    console.log('🚀 [ModuleService] Starting getActiveModules()...');
    
    try {
      console.log('🚀 [ModuleService] Making API call to /modules');
      const response = await api.get<ApiModulesResponse>('/modules', {
        requiresBusinessId: false // Modules API không cần business ID theo API spec mới
      });
      
      console.log('✅ [ModuleService] Raw API response:', response);
      
      // API trả về trực tiếp { data: ModuleInfo[] }
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
      return transformedModules;
      
    } catch (error) {
      console.error('💥 [ModuleService] Error in getActiveModules:', error);
      
      // Improved error handling - no fallback, let user know about the real issue
      throw new Error(`Failed to load modules: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
