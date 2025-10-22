export interface LensBrand {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LensFeature {
  id: string;
  name: string;
  code: string;
  icon: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LensProduct {
  id: string;
  brand_id: string;
  name: string;
  sku: string | null;
  description: string | null;
  price: number;
  image_urls: string[];
  material: string | null;
  refractive_index: string | null;
  origin: string | null;
  warranty_months: number | null;
  is_promotion: boolean;
  promotion_text: string | null;
  view_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  brand?: LensBrand;
  features?: LensFeature[];
}

export interface LensBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LensFilters {
  brandIds: string[];
  featureIds: string[];
  material: string | null;
  refractiveIndex: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  origin: string | null;
  hasWarranty: boolean;
  search: string;
  sort: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export interface LensProductWithDetails extends LensProduct {
  brand: LensBrand;
  features: LensFeature[];
}
