import { LensProduct } from './lens';

export interface LensSupplyTier {
  id: string;
  product_id: string;
  tier_type: 'IN_STORE' | 'NEXT_DAY' | 'CUSTOM_ORDER' | 'FACTORY_ORDER';
  tier_name: string | null;
  sph_min: number;
  sph_max: number;
  cyl_min: number;
  cyl_max: number;
  lead_time_days: number;
  stock_quantity: number | null;
  price_adjustment: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface LensUseCase {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LensProductUseCaseScore {
  id: string;
  product_id: string;
  use_case_id: string;
  score: number; // 0-100
  reasoning: string | null;
  created_at: string;
  updated_at: string;
  use_case?: LensUseCase;
}

export interface LensProductWithTiersAndScores extends LensProduct {
  supply_tiers: LensSupplyTier[];
  use_case_scores: LensProductUseCaseScore[];
}

export interface LensQuizAnswers {
  use_cases: string[]; // ['computer_work', 'driving']
  sph: number; // -3.5
  cyl: number; // -1.0
  budget_min?: number;
  budget_max?: number;
}

export interface LensQuizRecommendation {
  product: LensProductWithTiersAndScores;
  total_score: number;
  matched_use_cases: Array<{ code: string; name: string; score: number }>;
  available_tier: LensSupplyTier | null;
  reasoning: string;
}
