import { supabase } from '@/integrations/supabase/client';
import { LensUseCase, LensProductUseCaseScore } from '../types/lens-extended';

export const lensUseCasesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('lens_use_cases')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as LensUseCase[];
  },

  async getScoresByProductId(productId: string) {
    const { data, error } = await supabase
      .from('lens_product_use_case_scores')
      .select(`
        *,
        use_case:lens_use_cases(*)
      `)
      .eq('product_id', productId);
    
    if (error) throw error;
    return data as LensProductUseCaseScore[];
  },

  async upsertScore(productId: string, useCaseId: string, score: number, reasoning?: string) {
    const { data, error } = await supabase
      .from('lens_product_use_case_scores')
      .upsert({
        product_id: productId,
        use_case_id: useCaseId,
        score,
        reasoning,
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id,use_case_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteScore(productId: string, useCaseId: string) {
    const { error } = await supabase
      .from('lens_product_use_case_scores')
      .delete()
      .eq('product_id', productId)
      .eq('use_case_id', useCaseId);
    
    if (error) throw error;
  }
};
