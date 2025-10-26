-- Phase 1: Fix database cleanup double stringify
-- Parse nested JSON strings back to proper structure

UPDATE lens_product_attributes
SET options = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'value', 
      CASE 
        WHEN jsonb_typeof(elem->'value') = 'string' AND (elem->>'value')::text LIKE '{%' 
        THEN (elem->>'value')::jsonb->>'value'
        ELSE elem->>'value'
      END,
      'label',
      CASE 
        WHEN jsonb_typeof(elem->'label') = 'string' AND (elem->>'label')::text LIKE '{%'
        THEN (elem->>'label')::jsonb->>'label'
        ELSE elem->>'label'
      END,
      'image_url',
      CASE 
        WHEN jsonb_typeof(elem->'label') = 'string' AND (elem->>'label')::text LIKE '{%'
        THEN (elem->>'label')::jsonb->>'image_url'
        ELSE elem->>'image_url'
      END,
      'short_description',
      CASE 
        WHEN jsonb_typeof(elem->'label') = 'string' AND (elem->>'label')::text LIKE '{%'
        THEN (elem->>'label')::jsonb->>'short_description'
        ELSE elem->>'short_description'
      END,
      'content',
      CASE 
        WHEN jsonb_typeof(elem->'label') = 'string' AND (elem->>'label')::text LIKE '{%'
        THEN (elem->>'label')::jsonb->>'content'
        ELSE elem->>'content'
      END
    )
  )
  FROM jsonb_array_elements(options) elem
)
WHERE jsonb_typeof(options) = 'array'
AND EXISTS (
  SELECT 1 FROM jsonb_array_elements(options) e
  WHERE jsonb_typeof(e->'label') = 'string' 
  AND (e->>'label')::text LIKE '{%'
);

-- Verify cleanup results
DO $$
DECLARE
  fixed_count INTEGER;
  sample_record RECORD;
BEGIN
  SELECT COUNT(*) INTO fixed_count
  FROM lens_product_attributes
  WHERE jsonb_typeof(options) = 'array'
  AND jsonb_array_length(options) > 0;
  
  SELECT 
    name,
    slug,
    jsonb_array_length(options) as option_count,
    options->0->>'label' as first_label,
    options->0->>'value' as first_value,
    length(options->0->>'label') as label_length
  INTO sample_record
  FROM lens_product_attributes
  WHERE slug = 'tinh_nang_trong'
  LIMIT 1;
  
  RAISE NOTICE '✅ Cleaned up % attributes', fixed_count;
  IF sample_record.name IS NOT NULL THEN
    RAISE NOTICE '✅ Sample "%": % options', sample_record.name, sample_record.option_count;
    RAISE NOTICE '   First label: "%" (length: %)', sample_record.first_label, sample_record.label_length;
    RAISE NOTICE '   Expected: Clean text, NOT nested JSON (length should be ~10-20 chars)';
  END IF;
END $$;