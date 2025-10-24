import { supabase } from '@/integrations/supabase/client';
import { LensSupplyTier } from '../types/lens-extended';

export const lensSupplyTiersApi = {
  async getByProductId(productId: string) {
    const { data, error } = await supabase
      .from('lens_supply_tiers')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as LensSupplyTier[];
  },

  async create(tier: Omit<LensSupplyTier, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('lens_supply_tiers')
      .insert(tier)
      .select()
      .single();
    
    if (error) throw error;
    return data as LensSupplyTier;
  },

  async update(id: string, tier: Partial<LensSupplyTier>) {
    const { data, error } = await supabase
      .from('lens_supply_tiers')
      .update({ ...tier, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as LensSupplyTier;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('lens_supply_tiers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async checkAvailability(productId: string, sph: number, cyl: number) {
    const { data, error } = await supabase
      .from('lens_supply_tiers')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .gte('sph_max', sph)
      .lte('sph_min', sph)
      .gte('cyl_max', cyl)
      .lte('cyl_min', cyl)
      .order('lead_time_days', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data as LensSupplyTier | null;
  }
};
