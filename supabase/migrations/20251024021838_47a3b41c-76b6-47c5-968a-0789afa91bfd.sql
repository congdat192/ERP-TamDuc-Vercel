-- ============================================
-- MIGRATION: Convert Brands to Product Attribute
-- ============================================

-- Step 1: Create "Hãng Tròng" attribute
INSERT INTO lens_product_attributes (
  name, 
  slug, 
  type, 
  options, 
  display_order, 
  is_active,
  icon
)
SELECT 
  'Hãng Tròng',
  'hang_trong',
  'multiselect',
  (
    SELECT jsonb_agg(name ORDER BY display_order)
    FROM lens_brands
    WHERE is_active = true
  ),
  0,
  true,
  'Building2'
WHERE NOT EXISTS (
  SELECT 1 FROM lens_product_attributes WHERE slug = 'hang_trong'
);

-- Step 2: Migrate brand_id to attributes["hang_trong"]
UPDATE lens_products
SET attributes = jsonb_set(
  COALESCE(attributes, '{}'::jsonb),
  '{hang_trong}',
  to_jsonb(ARRAY[
    (SELECT name FROM lens_brands WHERE id = lens_products.brand_id)
  ])
)
WHERE brand_id IS NOT NULL
AND (attributes->>'hang_trong') IS NULL;

-- Step 3: Add deleted_at column to lens_brands (soft delete for backward compatibility)
ALTER TABLE lens_brands 
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Step 4: Create index for attribute filtering
CREATE INDEX IF NOT EXISTS idx_lens_products_attributes_gin 
ON lens_products USING gin (attributes);

-- Step 5: Update RLS policies to not require brand_id (already covered by existing policies)
-- No changes needed - existing policies work with attributes

COMMENT ON COLUMN lens_brands.deleted_at IS 'Soft delete - brands now managed via lens_product_attributes';
COMMENT ON INDEX idx_lens_products_attributes_gin IS 'GIN index for fast JSONB attribute filtering';