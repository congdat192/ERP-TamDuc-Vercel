-- Restore with proper string-to-array-to-objects conversion
UPDATE lens_product_attributes la
SET options = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'value', elem::text,
      'label', elem::text,
      'image_url', null,
      'short_description', null,
      'content', null
    )
  )
  FROM jsonb_array_elements_text((b.options #>> '{}')::jsonb) elem
)
FROM lens_product_attributes_backup_v2 b
WHERE la.id = b.id
  AND b.options IS NOT NULL
  AND jsonb_typeof(b.options) = 'string'
  AND (b.options #>> '{}') != '[]';

-- Verify restoration
DO $$
DECLARE
  restored_count INTEGER;
  sample_record RECORD;
BEGIN
  SELECT COUNT(*) INTO restored_count 
  FROM lens_product_attributes 
  WHERE options IS NOT NULL 
  AND jsonb_typeof(options) = 'array'
  AND jsonb_array_length(options) > 0;
  
  SELECT name, 
         jsonb_array_length(options) as option_count,
         options->0->>'label' as first_label,
         options->0->>'value' as first_value
  INTO sample_record
  FROM lens_product_attributes
  WHERE jsonb_typeof(options) = 'array'
  AND jsonb_array_length(options) > 0
  LIMIT 1;
  
  RAISE NOTICE '✅ Restored % attributes with options', restored_count;
  IF sample_record.name IS NOT NULL THEN
    RAISE NOTICE '✅ Sample: "%" has % options', sample_record.name, sample_record.option_count;
    RAISE NOTICE '   First option: value=%, label=%', sample_record.first_value, sample_record.first_label;
  END IF;
END $$;