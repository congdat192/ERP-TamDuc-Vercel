-- Force flatten ALL products NOW with explicit UPDATE
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{lens_brand}',
  CASE 
    WHEN jsonb_typeof(attributes->'lens_brand') = 'array' 
         AND jsonb_array_length(attributes->'lens_brand') = 1
         AND jsonb_typeof((attributes->'lens_brand')->0) = 'array'
    THEN (attributes->'lens_brand')->0
    ELSE attributes->'lens_brand'
  END
)
WHERE is_active = true 
  AND jsonb_typeof(attributes->'lens_brand') = 'array' 
  AND jsonb_array_length(attributes->'lens_brand') = 1
  AND jsonb_typeof((attributes->'lens_brand')->0) = 'array';