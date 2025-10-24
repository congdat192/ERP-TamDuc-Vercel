import { supabase } from '@/integrations/supabase/client';
import { LensQuizAnswers, LensQuizRecommendation, LensProductWithTiersAndScores } from '../types/lens-extended';

export const lensQuizApi = {
  async getRecommendations(answers: LensQuizAnswers): Promise<LensQuizRecommendation[]> {
    // Get all active products with their tiers and scores
    const { data: products, error: productsError } = await supabase
      .from('lens_products')
      .select(`
        *,
        supply_tiers:lens_supply_tiers!inner(*),
        use_case_scores:lens_product_use_case_scores(
          *,
          use_case:lens_use_cases(*)
        )
      `)
      .eq('is_active', true)
      .eq('supply_tiers.is_active', true);
    
    if (productsError) throw productsError;

    const recommendations: LensQuizRecommendation[] = [];

    for (const product of products as any[]) {
      // Check if SPH/CYL is available in any tier
      const availableTier = product.supply_tiers?.find((tier: any) => 
        tier.sph_min <= answers.sph && 
        tier.sph_max >= answers.sph &&
        tier.cyl_min <= answers.cyl && 
        tier.cyl_max >= answers.cyl &&
        tier.is_active
      );

      if (!availableTier) continue;

      // Calculate score for selected use cases
      let totalScore = 0;
      const matchedUseCases: Array<{ code: string; name: string; score: number }> = [];

      for (const useCaseCode of answers.use_cases) {
        const scoreEntry = product.use_case_scores?.find(
          (s: any) => s.use_case?.code === useCaseCode
        );
        
        if (scoreEntry) {
          totalScore += scoreEntry.score;
          matchedUseCases.push({ 
            code: useCaseCode, 
            name: scoreEntry.use_case.name,
            score: scoreEntry.score 
          });
        }
      }

      const avgScore = answers.use_cases.length > 0 
        ? totalScore / answers.use_cases.length 
        : 0;

      // Budget filter
      const finalPrice = product.sale_price || product.price;
      if (answers.budget_min && finalPrice < answers.budget_min) continue;
      if (answers.budget_max && finalPrice > answers.budget_max) continue;

      // Build reasoning
      const reasoning = this.buildReasoning(matchedUseCases, availableTier);

      recommendations.push({
        product: product as LensProductWithTiersAndScores,
        total_score: Math.round(avgScore),
        matched_use_cases: matchedUseCases.sort((a, b) => b.score - a.score),
        available_tier: availableTier,
        reasoning
      });
    }

    return recommendations.sort((a, b) => b.total_score - a.total_score);
  },

  buildReasoning(
    matchedUseCases: Array<{ code: string; name: string; score: number }>,
    tier: any
  ): string {
    let parts: string[] = [];

    if (matchedUseCases.length > 0) {
      const topCase = matchedUseCases[0];
      parts.push(`Phù hợp với nhu cầu ${topCase.name.toLowerCase()} (${topCase.score}/100 điểm)`);
    }
    
    if (tier.tier_type === 'IN_STORE') {
      parts.push('Có sẵn tại cửa hàng, lấy ngay');
    } else if (tier.tier_type === 'NEXT_DAY') {
      parts.push('Giao hàng trong 1 ngày');
    } else if (tier.lead_time_days > 0) {
      parts.push(`Thời gian giao: ${tier.lead_time_days} ngày`);
    }

    return parts.join(' • ');
  }
};
