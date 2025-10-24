-- Flatten ALL remaining nested arrays - NO WHERE conditions
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{lens_brand}',
  CASE 
    WHEN jsonb_array_length(attributes->'lens_brand') = 1
         AND jsonb_typeof((attributes->'lens_brand')->0) = 'array'
    THEN (attributes->'lens_brand')->0
    ELSE attributes->'lens_brand'
  END
)
WHERE attributes ? 'lens_brand';

-- Do same for tinh_nang_trong
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{tinh_nang_trong}',
  CASE 
    WHEN jsonb_typeof(attributes->'tinh_nang_trong') = 'array'
         AND jsonb_array_length(attributes->'tinh_nang_trong') = 1
         AND jsonb_typeof((attributes->'tinh_nang_trong')->0) = 'array'
    THEN (attributes->'tinh_nang_trong')->0
    ELSE attributes->'tinh_nang_trong'
  END
)
WHERE attributes ? 'tinh_nang_trong';