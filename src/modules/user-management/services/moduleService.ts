// Real Module Service with Supabase
import { supabase } from '@/integrations/supabase/client';
import { ModuleInfo, FeatureInfo, getFeatureType } from '../types/role-management';

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
          feature_type,
          parent_id,
          display_order
        )
      `)
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    
    return (data || []).map(module => {
      const features = (module.features as any[] || []).map((f: any) => ({
        id: f.id,
        code: f.code,
        name: f.name,
        description: f.description || '',
        type: f.feature_type || getFeatureType(f.code),
        parent_id: f.parent_id,
        display_order: f.display_order || 0
      }));
      
      // Build feature tree
      const featureTree = this.buildFeatureTree(features);
      
      return {
        id: module.id.toString(),
        code: module.code,
        name: module.name,
        label: module.name,
        description: module.description || '',
        icon: module.icon || 'Box',
        features,
        featureTree,
        status: 'active' as const
      };
    });
  }

  private static buildFeatureTree(features: FeatureInfo[]): FeatureInfo[] {
    const featureMap = new Map<number, FeatureInfo>();
    const roots: FeatureInfo[] = [];

    // First pass: create all nodes
    features.forEach(f => {
      featureMap.set(f.id, {
        ...f,
        children: []
      });
    });

    // Second pass: build tree
    featureMap.forEach(feature => {
      if (!feature.parent_id) {
        roots.push(feature);
      } else {
        const parent = featureMap.get(feature.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(feature);
        }
      }
    });

    // Sort by display_order
    roots.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    roots.forEach(root => {
      if (root.children) {
        root.children.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      }
    });

    return roots;
  }
}
