-- Standardize lens_products attributes structure
-- Step 1: Rename tinh_nang_trong_values to tinh_nang_trong
UPDATE lens_products
SET attributes = attributes - 'tinh_nang_trong_values' || 
  jsonb_build_object('tinh_nang_trong', attributes->'tinh_nang_trong_values')
WHERE attributes ? 'tinh_nang_trong_values';

-- Step 2: Convert scalar lens_brand to array and ensure uppercase
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{lens_brand}',
  CASE 
    WHEN jsonb_typeof(attributes->'lens_brand') = 'string' THEN
      to_jsonb(ARRAY[UPPER(attributes->>'lens_brand')])
    WHEN jsonb_typeof(attributes->'lens_brand') = 'array' THEN
      (SELECT jsonb_agg(UPPER(value::text))
       FROM jsonb_array_elements_text(attributes->'lens_brand'))
    ELSE attributes->'lens_brand'
  END
)
WHERE attributes ? 'lens_brand';

-- Step 3: Convert scalar tinh_nang_trong to array
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{tinh_nang_trong}',
  CASE 
    WHEN jsonb_typeof(attributes->'tinh_nang_trong') = 'string' THEN
      to_jsonb(ARRAY[attributes->>'tinh_nang_trong'])
    ELSE attributes->'tinh_nang_trong'
  END
)
WHERE attributes ? 'tinh_nang_trong';

-- Step 4: Convert scalar hang_trong to array and ensure uppercase
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{hang_trong}',
  CASE 
    WHEN jsonb_typeof(attributes->'hang_trong') = 'string' THEN
      to_jsonb(ARRAY[UPPER(attributes->>'hang_trong')])
    WHEN jsonb_typeof(attributes->'hang_trong') = 'array' THEN
      (SELECT jsonb_agg(UPPER(value::text))
       FROM jsonb_array_elements_text(attributes->'hang_trong'))
    ELSE attributes->'hang_trong'
  END
)
WHERE attributes ? 'hang_trong';