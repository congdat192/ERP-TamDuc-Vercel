-- Emergency restore from backup: Convert string arrays to AttributeOption objects
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
  FROM jsonb_array_elements_text(
    (SELECT b.options FROM lens_product_attributes_backup b WHERE b.id = la.id)
  ) elem
)
WHERE EXISTS (
  SELECT 1 
  FROM lens_product_attributes_backup b 
  WHERE b.id = la.id 
  AND b.options IS NOT NULL 
  AND jsonb_typeof(b.options) = 'array'
  AND b.options::text != '[]'
);

-- Log restoration results
DO $$
DECLARE
  restored_count INTEGER;
  sample_name TEXT;
  sample_options JSONB;
BEGIN
  SELECT COUNT(*) INTO restored_count 
  FROM lens_product_attributes 
  WHERE options IS NOT NULL AND options::text != '[]';
  
  SELECT name, options INTO sample_name, sample_options
  FROM lens_product_attributes
  WHERE options IS NOT NULL AND options::text != '[]'
  LIMIT 1;
  
  RAISE NOTICE '✅ Restored % attributes with options', restored_count;
  RAISE NOTICE '✅ Sample: % has % options', sample_name, jsonb_array_length(sample_options);
END $$;