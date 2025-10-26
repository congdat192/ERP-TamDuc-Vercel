-- Phase 1: Restore from backup with proper type handling
UPDATE lens_product_attributes la
SET options = (
  SELECT 
    CASE
      -- If backup options is array of strings (legacy format)
      WHEN jsonb_typeof(b.options) = 'array' AND jsonb_typeof(b.options->0) = 'string' THEN
        (SELECT jsonb_agg(
          jsonb_build_object(
            'value', elem::text,
            'label', elem::text,
            'image_url', null,
            'short_description', null,
            'content', null
          )
        ) FROM jsonb_array_elements_text(b.options) elem)
      
      -- If backup is already proper format (array of objects), use directly
      WHEN jsonb_typeof(b.options) = 'array' AND jsonb_typeof(b.options->0) = 'object' THEN
        b.options
      
      -- If backup is empty array
      WHEN jsonb_typeof(b.options) = 'array' AND jsonb_array_length(b.options) = 0 THEN
        '[]'::jsonb
      
      -- Fallback to empty array if unknown format
      ELSE '[]'::jsonb
    END
  FROM lens_product_attributes_backup b
  WHERE b.id = la.id
)
WHERE EXISTS (
  SELECT 1 FROM lens_product_attributes_backup b WHERE b.id = la.id
);

-- Phase 2: Add validation function
CREATE OR REPLACE FUNCTION validate_attribute_options(opts jsonb)
RETURNS boolean AS $$
BEGIN
  -- Must be array
  IF jsonb_typeof(opts) != 'array' THEN
    RETURN false;
  END IF;
  
  -- Allow empty arrays
  IF jsonb_array_length(opts) = 0 THEN
    RETURN true;
  END IF;
  
  -- Each element must be object with required keys
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(opts) elem
    WHERE jsonb_typeof(elem) != 'object'
       OR NOT (elem ? 'value')
       OR NOT (elem ? 'label')
  ) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add check constraint to prevent future corruption
ALTER TABLE lens_product_attributes
DROP CONSTRAINT IF EXISTS options_valid_structure;

ALTER TABLE lens_product_attributes
ADD CONSTRAINT options_valid_structure
CHECK (validate_attribute_options(options));

-- Verify restoration
DO $$
DECLARE
  valid_count INTEGER;
  total_count INTEGER;
  sample_row RECORD;
BEGIN
  SELECT COUNT(*) INTO valid_count
  FROM lens_product_attributes
  WHERE validate_attribute_options(options);
  
  SELECT COUNT(*) INTO total_count
  FROM lens_product_attributes;
  
  -- Get sample data for verification
  SELECT name, slug, jsonb_typeof(options) as type, jsonb_array_length(options) as length
  INTO sample_row
  FROM lens_product_attributes
  LIMIT 1;
  
  IF valid_count = total_count THEN
    RAISE NOTICE 'Restoration successful: All % rows have valid structure', total_count;
    RAISE NOTICE 'Sample: % (%) - type: %, length: %', sample_row.name, sample_row.slug, sample_row.type, sample_row.length;
  ELSE
    RAISE WARNING 'Restoration incomplete: % of % rows still invalid', (total_count - valid_count), total_count;
  END IF;
END $$;