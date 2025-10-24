-- Step 1: Update lens_brand attribute type to multiselect
UPDATE lens_product_attributes 
SET type = 'multiselect'
WHERE slug = 'lens_brand';

-- Step 2: Migrate old 'hang_trong' key to 'lens_brand' in products
UPDATE lens_products
SET attributes = 
  CASE 
    WHEN attributes ? 'hang_trong' THEN
      attributes - 'hang_trong' || 
      jsonb_build_object('lens_brand', attributes->'hang_trong')
    ELSE attributes
  END
WHERE attributes ? 'hang_trong';

-- Step 3: Ensure all lens_brand values are arrays (not strings)
UPDATE lens_products
SET attributes = 
  jsonb_set(
    attributes,
    '{lens_brand}',
    CASE 
      WHEN jsonb_typeof(attributes->'lens_brand') = 'string' 
      THEN jsonb_build_array(attributes->>'lens_brand')
      ELSE attributes->'lens_brand'
    END
  )
WHERE attributes ? 'lens_brand' 
  AND jsonb_typeof(attributes->'lens_brand') != 'array';