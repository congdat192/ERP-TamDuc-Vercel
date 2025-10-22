-- Phase 0: Update CHECK constraint to allow 'multiselect'
ALTER TABLE lens_product_attributes 
DROP CONSTRAINT IF EXISTS lens_product_attributes_type_check;

ALTER TABLE lens_product_attributes 
ADD CONSTRAINT lens_product_attributes_type_check 
CHECK (type IN ('select', 'multiselect'));

-- Phase 1: Add icon column to lens_product_attributes
ALTER TABLE lens_product_attributes 
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT NULL;

-- Phase 2: Add attributes JSONB column to lens_products
ALTER TABLE lens_products 
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}'::jsonb;

-- Phase 3: Add icons to existing attributes
UPDATE lens_product_attributes SET icon = '🧪' WHERE slug = 'material';
UPDATE lens_product_attributes SET icon = '🔍' WHERE slug = 'refractive_index';
UPDATE lens_product_attributes SET icon = '🌍' WHERE slug = 'origin';
UPDATE lens_product_attributes SET icon = '⏱️' WHERE slug = 'warranty_months';

-- Phase 4: Migrate lens_features to lens_product_attributes as multiselect
INSERT INTO lens_product_attributes (name, slug, type, options, icon, display_order, is_active)
SELECT 
  name,
  LOWER(REPLACE(REPLACE(REPLACE(name, ' ', '_'), 'ă', 'a'), 'ư', 'u')) as slug,
  'multiselect' as type,
  '[]'::jsonb as options,
  icon,
  display_order + 100 as display_order,
  is_active
FROM lens_features
WHERE is_active = true
ORDER BY display_order;

-- Phase 5: Migrate lens_product_features data to lens_products.attributes JSONB
UPDATE lens_products p
SET attributes = COALESCE(
  (
    SELECT jsonb_build_object(
      'features', 
      jsonb_agg(lpf.feature_id ORDER BY lpf.feature_id)
    )
    FROM lens_product_features lpf
    WHERE lpf.product_id = p.id
  ),
  '{}'::jsonb
)
WHERE EXISTS (
  SELECT 1 FROM lens_product_features lpf WHERE lpf.product_id = p.id
);

-- Phase 6: Drop old tables (cleanup)
DROP TABLE IF EXISTS lens_product_features CASCADE;
DROP TABLE IF EXISTS lens_features CASCADE;