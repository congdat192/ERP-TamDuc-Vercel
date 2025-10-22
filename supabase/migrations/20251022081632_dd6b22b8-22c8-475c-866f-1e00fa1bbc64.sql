-- Migration: Add Variable Products support for Lens Management
-- Created: 2025-10-22

-- Step 1: Add product_type and base_sku to lens_products
ALTER TABLE lens_products 
ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'simple' 
CHECK (product_type IN ('simple', 'variable'));

ALTER TABLE lens_products
ADD COLUMN IF NOT EXISTS base_sku TEXT;

COMMENT ON COLUMN lens_products.product_type IS 'simple: sản phẩm đơn giản, variable: sản phẩm có biến thể';
COMMENT ON COLUMN lens_products.base_sku IS 'SKU gốc cho variable products (VD: ROD-CLR)';

-- Step 2: Create lens_product_attributes table
CREATE TABLE IF NOT EXISTS lens_product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'select' CHECK (type IN ('select', 'color', 'text')),
  options JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE lens_product_attributes IS 'Quản lý các thuộc tính động cho sản phẩm (Chiết suất, Màu sắc, etc.)';

-- Step 3: Create lens_product_variants table
CREATE TABLE IF NOT EXISTS lens_product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES lens_products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  variant_name TEXT NOT NULL,
  attributes JSONB DEFAULT '{}'::jsonb,
  price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  image_urls JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE lens_product_variants IS 'Biến thể của sản phẩm (VD: ROD-CLR-156, ROD-CLR-160)';
COMMENT ON COLUMN lens_product_variants.attributes IS 'JSON chứa các thuộc tính: {"chiet_suat": "1.56", "mau_sac": "Clear"}';

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON lens_product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON lens_product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_active ON lens_product_variants(product_id, is_active);
CREATE INDEX IF NOT EXISTS idx_attributes_slug ON lens_product_attributes(slug);
CREATE INDEX IF NOT EXISTS idx_attributes_active ON lens_product_attributes(is_active);

-- Step 5: Insert default attributes (only if not exists)
INSERT INTO lens_product_attributes (name, slug, type, options, display_order)
SELECT 'Chiết suất', 'chiet_suat', 'select', '["1.56", "1.60", "1.67", "1.74"]'::jsonb, 1
WHERE NOT EXISTS (SELECT 1 FROM lens_product_attributes WHERE slug = 'chiet_suat');

INSERT INTO lens_product_attributes (name, slug, type, options, display_order)
SELECT 'Màu sắc', 'mau_sac', 'color', '["Clear", "Blue", "Brown", "Gray", "Green"]'::jsonb, 2
WHERE NOT EXISTS (SELECT 1 FROM lens_product_attributes WHERE slug = 'mau_sac');

INSERT INTO lens_product_attributes (name, slug, type, options, display_order)
SELECT 'Lớp phủ', 'lop_phu', 'select', '["UV", "AR", "HC", "Crizal", "BlueControl"]'::jsonb, 3
WHERE NOT EXISTS (SELECT 1 FROM lens_product_attributes WHERE slug = 'lop_phu');

-- Step 6: Enable RLS
ALTER TABLE lens_product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE lens_product_attributes ENABLE ROW LEVEL SECURITY;

-- Step 7: RLS Policies for lens_product_variants
CREATE POLICY "Admins can manage variants" ON lens_product_variants
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Anyone can view active variants" ON lens_product_variants
FOR SELECT USING (is_active = true);

-- Step 8: RLS Policies for lens_product_attributes
CREATE POLICY "Admins can manage attributes" ON lens_product_attributes
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Anyone can view active attributes" ON lens_product_attributes
FOR SELECT USING (is_active = true);

-- Step 9: Triggers for auto-update updated_at
CREATE TRIGGER update_variants_updated_at 
BEFORE UPDATE ON lens_product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attributes_updated_at 
BEFORE UPDATE ON lens_product_attributes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();