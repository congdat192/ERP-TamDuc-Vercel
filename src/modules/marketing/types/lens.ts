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

export interface LensProductAttribute {
  id: string;
  name: string;
  slug: string;
  type: 'select' | 'multiselect';
  options: string[];
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LensProduct {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  price: number;
  sale_price: number | null;
  discount_percent: number | null;
  image_urls: string[];
  attributes: Record<string, string[]>; // JSONB: {"slug": ["value1", "value2"]}
  is_promotion: boolean;
  promotion_text: string | null;
  view_count: number;
  is_active: boolean;
  related_product_ids: string[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  brand?: LensBrand;
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
  attributeFilters: Record<string, string[]>; // {"lens_brand": ["CHEMI"], "tinh_nang_trong": ["Chống UV400"]}
  minPrice: number | null;
  maxPrice: number | null;
  search: string;
  sort: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export interface LensProductWithDetails extends LensProduct {
  // No additional fields needed - brand info is in attributes
}
