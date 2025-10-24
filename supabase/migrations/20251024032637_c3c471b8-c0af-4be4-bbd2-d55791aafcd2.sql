-- Step 1: Backup existing brand_id data to attributes.lens_brand
UPDATE lens_products
SET attributes = jsonb_set(
  COALESCE(attributes, '{}'::jsonb),
  '{lens_brand}',
  CASE 
    WHEN (SELECT name FROM lens_brands WHERE id = lens_products.brand_id) IS NOT NULL
    THEN to_jsonb(ARRAY[(SELECT name FROM lens_brands WHERE id = lens_products.brand_id)])
    ELSE '[]'::jsonb
  END
)
WHERE brand_id IS NOT NULL 
  AND (attributes->'lens_brand' IS NULL OR attributes->'lens_brand' = 'null'::jsonb);

-- Step 2: Convert any existing scalar lens_brand to array format
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{lens_brand}',
  to_jsonb(ARRAY[attributes->>'lens_brand'])
)
WHERE attributes->>'lens_brand' IS NOT NULL
  AND jsonb_typeof(attributes->'lens_brand') = 'string';

-- Step 3: Drop foreign key constraint
ALTER TABLE lens_products DROP CONSTRAINT IF EXISTS lens_products_brand_id_fkey;

-- Step 4: Drop brand_id column
ALTER TABLE lens_products DROP COLUMN IF EXISTS brand_id;

-- Step 5: Drop lens_brands table
DROP TABLE IF EXISTS lens_brands CASCADE;

-- Note: Skipping options merge due to data format issues
-- You can manually add brand names to lens_product_attributes.options via UI if needed