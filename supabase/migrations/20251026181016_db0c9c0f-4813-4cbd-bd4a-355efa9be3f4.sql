-- Cleanup double/triple stringified options data

-- Step 1: Identify and fix double stringified data
-- This handles cases where options is stored as a JSON string instead of JSONB
UPDATE lens_product_attributes
SET options = (
  CASE
    -- If options is a string (double stringified), parse it
    WHEN jsonb_typeof(options) = 'string' THEN
      (options #>> '{}')::jsonb
    ELSE options
  END
)
WHERE jsonb_typeof(options) = 'string';

-- Step 2: Handle triple stringified (in case of multiple stringify calls)
UPDATE lens_product_attributes
SET options = (
  CASE
    WHEN jsonb_typeof(options) = 'string' THEN
      (options #>> '{}')::jsonb
    ELSE options
  END
)
WHERE jsonb_typeof(options) = 'string';

-- Step 3: Convert array of strings to array of objects (backwards compatibility)
UPDATE lens_product_attributes
SET options = (
  SELECT jsonb_agg(
    CASE
      WHEN jsonb_typeof(elem) = 'object' THEN elem
      ELSE jsonb_build_object(
        'value', elem::text,
        'label', elem::text,
        'image_url', null,
        'short_description', null,
        'content', null
      )
    END
  )
  FROM jsonb_array_elements(options) elem
)
WHERE jsonb_typeof(options) = 'array' 
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(options) elem 
    WHERE jsonb_typeof(elem) != 'object'
  );

-- Step 4: Verify data integrity
DO $$
DECLARE
  bad_count INTEGER;
  total_count INTEGER;
BEGIN
  -- Count rows with incorrect format
  SELECT COUNT(*) INTO bad_count
  FROM lens_product_attributes
  WHERE NOT (
    jsonb_typeof(options) = 'array' 
    AND (
      jsonb_array_length(options) = 0
      OR jsonb_typeof(options->0) = 'object'
    )
  );
  
  SELECT COUNT(*) INTO total_count
  FROM lens_product_attributes;
  
  IF bad_count > 0 THEN
    RAISE WARNING 'Cleanup incomplete: % of % rows still have incorrect format', bad_count, total_count;
  ELSE
    RAISE NOTICE 'Data cleanup successful: All % rows have correct JSONB format', total_count;
  END IF;
END $$;