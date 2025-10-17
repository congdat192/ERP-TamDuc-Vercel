// Real Module Service with Supabase
import { supabase } from '@/integrations/supabase/client';
import { ModuleInfo, getFeatureType } from '../types/role-management';

export class ModuleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    const { data, error } = await supabase
      .from('modules')
      .select(`
        id,
        code,
        name,
        description,
        icon,
        features (
          id,
          code,
          name,
          description,
          feature_type
        )
      `)
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    
    return (data || []).map(module => ({
      id: module.id.toString(),
      code: module.code,
      name: module.name,
      label: module.name,
      description: module.description || '',
      icon: module.icon || 'Box',
      features: (module.features as any[] || []).map((f: any) => ({
        id: f.id,
        code: f.code,
        name: f.name,
        description: f.description || '',
        type: getFeatureType(f.code)
      })),
      status: 'active' as const
    }));
  }
}
