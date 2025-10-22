-- =====================================================
-- LENS CATALOG SYSTEM - DATABASE SCHEMA
-- =====================================================

-- 1. Create lens_brands table
CREATE TABLE IF NOT EXISTS public.lens_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create lens_features table
CREATE TABLE IF NOT EXISTS public.lens_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create lens_products table
CREATE TABLE IF NOT EXISTS public.lens_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.lens_brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  material TEXT,
  refractive_index TEXT,
  origin TEXT,
  warranty_months INTEGER,
  is_promotion BOOLEAN DEFAULT false,
  promotion_text TEXT,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 4. Create lens_product_features junction table
CREATE TABLE IF NOT EXISTS public.lens_product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.lens_products(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.lens_features(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, feature_id)
);

-- 5. Create lens_banners table
CREATE TABLE IF NOT EXISTS public.lens_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_lens_products_brand_id ON public.lens_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_lens_products_is_active ON public.lens_products(is_active);
CREATE INDEX IF NOT EXISTS idx_lens_products_price ON public.lens_products(price);
CREATE INDEX IF NOT EXISTS idx_lens_product_features_product_id ON public.lens_product_features(product_id);
CREATE INDEX IF NOT EXISTS idx_lens_product_features_feature_id ON public.lens_product_features(feature_id);
CREATE INDEX IF NOT EXISTS idx_lens_brands_is_active ON public.lens_brands(is_active);
CREATE INDEX IF NOT EXISTS idx_lens_features_is_active ON public.lens_features(is_active);
CREATE INDEX IF NOT EXISTS idx_lens_banners_is_active ON public.lens_banners(is_active);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.lens_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_banners ENABLE ROW LEVEL SECURITY;

-- Public read access (không cần auth)
CREATE POLICY "Anyone can view active brands"
  ON public.lens_brands FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active features"
  ON public.lens_features FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active products"
  ON public.lens_products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view product features"
  ON public.lens_product_features FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view active banners"
  ON public.lens_banners FOR SELECT
  USING (is_active = true);

-- Admin write access (Marketing Manager)
CREATE POLICY "Admins can manage brands"
  ON public.lens_brands FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can manage features"
  ON public.lens_features FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can manage products"
  ON public.lens_products FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can manage product features"
  ON public.lens_product_features FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can manage banners"
  ON public.lens_banners FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_lens_brands_updated_at
  BEFORE UPDATE ON public.lens_brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lens_features_updated_at
  BEFORE UPDATE ON public.lens_features
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lens_products_updated_at
  BEFORE UPDATE ON public.lens_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lens_banners_updated_at
  BEFORE UPDATE ON public.lens_banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert brands
INSERT INTO public.lens_brands (name, description, display_order) VALUES
  ('Essilor', 'Thương hiệu tròng kính hàng đầu thế giới', 1),
  ('Hoya', 'Công nghệ Nhật Bản tiên tiến', 2),
  ('Zeiss', 'Chất lượng quang học Đức', 3),
  ('Rodenstock', 'Kính cao cấp Đức', 4),
  ('Nikon', 'Công nghệ quang học Nhật', 5),
  ('Pentax', 'Tròng kính chính xác', 6),
  ('Kodak', 'Thương hiệu tin cậy', 7),
  ('Chemi', 'Tròng kính Hàn Quốc', 8),
  ('Seiko', 'Công nghệ mỏng nhẹ', 9),
  ('Conant', 'Giá trị tối ưu', 10)
ON CONFLICT (name) DO NOTHING;

-- Insert features
INSERT INTO public.lens_features (name, code, icon, description, display_order) VALUES
  ('Chống UV', 'UV', '☀️', 'Bảo vệ mắt khỏi tia UV', 1),
  ('Chống xước', 'SCRATCH', '🛡️', 'Lớp phủ chống xước bền bỉ', 2),
  ('Chống ánh sáng xanh', 'BLUE', '💙', 'Lọc ánh sáng xanh từ màn hình', 3),
  ('Đa tròng', 'PROGRESSIVE', '👁️', 'Nhìn xa - gần trong 1 tròng', 4),
  ('Chống lóa', 'ANTI_GLARE', '✨', 'Giảm phản xạ ánh sáng', 5),
  ('Siêu mỏng', 'THIN', '📏', 'Tròng kính siêu mỏng nhẹ', 6),
  ('Đổi màu', 'TRANSITION', '🌓', 'Tự động đổi màu theo ánh sáng', 7),
  ('Chống nước', 'WATER', '💧', 'Lớp phủ kỵ nước', 8)
ON CONFLICT (code) DO NOTHING;

-- Insert sample products
INSERT INTO public.lens_products (brand_id, name, sku, description, price, material, refractive_index, origin, warranty_months, is_promotion, promotion_text)
SELECT 
  b.id,
  'Essilor Crizal Sapphire UV',
  'ESS-CRZ-SAP-001',
  'Tròng kính cao cấp với lớp phủ Crizal Sapphire chống xước và UV tốt nhất',
  2500000,
  'Polycarbonate',
  '1.67',
  'Pháp',
  24,
  true,
  'Giảm 20%'
FROM public.lens_brands b WHERE b.name = 'Essilor' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.lens_products (brand_id, name, sku, description, price, material, refractive_index, origin, warranty_months)
SELECT 
  b.id,
  'Hoya Nulux EP',
  'HOYA-NUX-EP-002',
  'Tròng đa tròng công nghệ Nhật Bản với thiết kế mỏng nhẹ',
  3200000,
  'Hi-Index',
  '1.74',
  'Nhật Bản',
  24
FROM public.lens_brands b WHERE b.name = 'Hoya' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.lens_products (brand_id, name, sku, description, price, material, refractive_index, origin, warranty_months, is_promotion, promotion_text)
SELECT 
  b.id,
  'Zeiss DriveSafe',
  'ZEISS-DRV-003',
  'Tròng kính chuyên dụng cho lái xe, giảm chói và tăng độ rõ ban đêm',
  2800000,
  'Trivex',
  '1.60',
  'Đức',
  36,
  true,
  'Tặng hộp'
FROM public.lens_brands b WHERE b.name = 'Zeiss' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.lens_products (brand_id, name, sku, description, price, material, refractive_index, origin, warranty_months)
SELECT 
  b.id,
  'Rodenstock ColorMatic IQ',
  'ROD-CLR-004',
  'Tròng đổi màu thông minh với công nghệ ColorMatic IQ',
  3500000,
  'Hi-Index',
  '1.67',
  'Đức',
  24
FROM public.lens_brands b WHERE b.name = 'Rodenstock' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.lens_products (brand_id, name, sku, description, price, material, refractive_index, origin, warranty_months)
SELECT 
  b.id,
  'Nikon SeeMax Ultimate',
  'NIKON-SMX-005',
  'Tròng kính siêu mỏng với công nghệ quang học Nikon',
  2900000,
  'Hi-Index',
  '1.74',
  'Nhật Bản',
  24
FROM public.lens_brands b WHERE b.name = 'Nikon' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.lens_products (brand_id, name, sku, description, price, material, refractive_index, origin, warranty_months)
SELECT 
  b.id,
  'Chemi Blue Cut',
  'CHEMI-BLC-006',
  'Tròng kính chống ánh sáng xanh giá tốt',
  1200000,
  'CR-39',
  '1.56',
  'Hàn Quốc',
  12
FROM public.lens_brands b WHERE b.name = 'Chemi' LIMIT 1
ON CONFLICT (sku) DO NOTHING;

-- Insert banners
INSERT INTO public.lens_banners (title, subtitle, image_url, display_order) VALUES
  ('Ưu đãi mùa hè', 'Giảm giá lên đến 30% tất cả tròng kính', 'https://placeholder.svg?height=300&width=600&text=Summer+Sale', 1),
  ('Tròng đổi màu', 'Bảo vệ mắt hoàn hảo mọi môi trường', 'https://placeholder.svg?height=300&width=600&text=Transition+Lenses', 2),
  ('Công nghệ Nhật Bản', 'Hoya & Nikon - Chất lượng quang học hàng đầu', 'https://placeholder.svg?height=300&width=600&text=Japan+Technology', 3),
  ('Tư vấn miễn phí', 'Đội ngũ chuyên gia tư vấn nhiệt tình', 'https://placeholder.svg?height=300&width=600&text=Free+Consultation', 4)
ON CONFLICT DO NOTHING;

-- Link products to features (sample data)
INSERT INTO public.lens_product_features (product_id, feature_id)
SELECT p.id, f.id
FROM public.lens_products p
CROSS JOIN public.lens_features f
WHERE p.sku IN ('ESS-CRZ-SAP-001') AND f.code IN ('UV', 'SCRATCH', 'ANTI_GLARE', 'WATER')
ON CONFLICT DO NOTHING;

INSERT INTO public.lens_product_features (product_id, feature_id)
SELECT p.id, f.id
FROM public.lens_products p
CROSS JOIN public.lens_features f
WHERE p.sku IN ('HOYA-NUX-EP-002') AND f.code IN ('UV', 'PROGRESSIVE', 'THIN', 'BLUE')
ON CONFLICT DO NOTHING;

INSERT INTO public.lens_product_features (product_id, feature_id)
SELECT p.id, f.id
FROM public.lens_products p
CROSS JOIN public.lens_features f
WHERE p.sku IN ('ZEISS-DRV-003') AND f.code IN ('UV', 'ANTI_GLARE', 'SCRATCH')
ON CONFLICT DO NOTHING;

INSERT INTO public.lens_product_features (product_id, feature_id)
SELECT p.id, f.id
FROM public.lens_products p
CROSS JOIN public.lens_features f
WHERE p.sku IN ('ROD-CLR-004') AND f.code IN ('UV', 'TRANSITION', 'SCRATCH', 'WATER')
ON CONFLICT DO NOTHING;

INSERT INTO public.lens_product_features (product_id, feature_id)
SELECT p.id, f.id
FROM public.lens_products p
CROSS JOIN public.lens_features f
WHERE p.sku IN ('NIKON-SMX-005') AND f.code IN ('UV', 'THIN', 'ANTI_GLARE', 'SCRATCH')
ON CONFLICT DO NOTHING;

INSERT INTO public.lens_product_features (product_id, feature_id)
SELECT p.id, f.id
FROM public.lens_products p
CROSS JOIN public.lens_features f
WHERE p.sku IN ('CHEMI-BLC-006') AND f.code IN ('UV', 'BLUE', 'SCRATCH')
ON CONFLICT DO NOTHING;

-- =====================================================
-- STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('lens-images', 'lens-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Anyone can view lens images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lens-images');

CREATE POLICY "Admins can upload lens images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'lens-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update lens images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'lens-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete lens images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'lens-images' AND is_admin(auth.uid()));