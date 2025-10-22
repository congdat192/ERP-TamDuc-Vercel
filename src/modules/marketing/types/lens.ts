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

export interface LensProductAttribute {
  id: string;
  name: string;
  slug: string;
  type: 'select' | 'color' | 'text' | 'checkbox';
  options: string[];
  icon: string | null;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface LensProductAttributeValue {
  id: string;
  product_id: string;
  attribute_id: string;
  value: string;
  created_at: string;
  attribute?: LensProductAttribute;
}

export interface LensProductVariant {
  id: string;
  product_id: string;
  sku: string;
  variant_name: string;
  attributes: Record<string, string>; // { "chiet_suat": "1.56", "mau_sac": "Clear" }
  price: number;
  stock_quantity: number;
  image_urls: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface LensProduct {
  id: string;
  brand_id: string;
  name: string;
  product_type: 'simple' | 'variable';
  base_sku: string | null;
  sku: string | null; // For simple products only
  description: string | null;
  price: number; // Base price for simple, min price for variable
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
  variants?: LensProductVariant[];
  attribute_values?: LensProductAttributeValue[];
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
  variants?: LensProductVariant[];
}

export interface CreateVariantInput {
  sku: string;
  variant_name: string;
  attributes: Record<string, string>;
  price: number;
  stock_quantity: number;
  image_urls?: string[];
  display_order?: number;
}
