-- Fix double nested arrays in lens_products.attributes
-- Flatten [["VALUE"]] to ["VALUE"]

UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{lens_brand}',
  CASE 
    WHEN jsonb_typeof(attributes->'lens_brand') = 'array' 
         AND jsonb_array_length(attributes->'lens_brand') > 0
         AND jsonb_typeof(attributes->'lens_brand'->0) = 'array' THEN
      -- Flatten nested array: take first element which is the actual array
      attributes->'lens_brand'->0
    ELSE 
      attributes->'lens_brand'
  END
)
WHERE attributes ? 'lens_brand';

UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{tinh_nang_trong}',
  CASE 
    WHEN jsonb_typeof(attributes->'tinh_nang_trong') = 'array' 
         AND jsonb_array_length(attributes->'tinh_nang_trong') > 0
         AND jsonb_typeof(attributes->'tinh_nang_trong'->0) = 'array' THEN
      -- Flatten nested array: take first element which is the actual array
      attributes->'tinh_nang_trong'->0
    ELSE 
      attributes->'tinh_nang_trong'
  END
)
WHERE attributes ? 'tinh_nang_trong';

UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{hang_trong}',
  CASE 
    WHEN jsonb_typeof(attributes->'hang_trong') = 'array' 
         AND jsonb_array_length(attributes->'hang_trong') > 0
         AND jsonb_typeof(attributes->'hang_trong'->0) = 'array' THEN
      -- Flatten nested array: take first element which is the actual array
      attributes->'hang_trong'->0
    ELSE 
      attributes->'hang_trong'
  END
)
WHERE attributes ? 'hang_trong';