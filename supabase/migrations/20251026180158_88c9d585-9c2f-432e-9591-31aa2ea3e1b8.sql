-- ============================================================================
-- FIX: lens_product_attributes.options column type + normalize data
-- Issue: Column is text/text[] instead of jsonb, causing metadata loss
-- ============================================================================

-- Step 1: Backup existing data
CREATE TABLE IF NOT EXISTS lens_product_attributes_backup_v2 AS 
SELECT * FROM lens_product_attributes;

-- Step 2: ALTER COLUMN TYPE to jsonb with data migration
ALTER TABLE lens_product_attributes 
ALTER COLUMN options TYPE jsonb USING 
  CASE 
    -- If already looks like JSON array
    WHEN options::text LIKE '[%' THEN options::text::jsonb
    -- If single value, wrap in array
    ELSE jsonb_build_array(options::text)
  END;

-- Step 3: Normalize all existing data to AttributeOption[] format
UPDATE lens_product_attributes
SET options = (
  SELECT jsonb_agg(
    CASE 
      -- If already has correct object structure
      WHEN jsonb_typeof(elem) = 'object' AND elem ? 'value' THEN elem
      -- If string or other format, convert to AttributeOption
      ELSE jsonb_build_object(
        'value', COALESCE(elem->>'value', elem::text),
        'label', COALESCE(elem->>'label', elem::text),
        'image_url', NULL,
        'short_description', NULL,
        'content', NULL
      )
    END
  )
  FROM jsonb_array_elements(options) AS elem
)
WHERE jsonb_typeof(options) = 'array';

-- Step 4: Add GIN index for JSONB query performance
CREATE INDEX IF NOT EXISTS idx_lens_attributes_options_gin 
ON lens_product_attributes USING GIN (options);

-- Step 5: Add constraint to ensure options is always an array
ALTER TABLE lens_product_attributes 
ADD CONSTRAINT options_must_be_array 
CHECK (jsonb_typeof(options) = 'array');

-- Step 6: Set default value for new records
ALTER TABLE lens_product_attributes 
ALTER COLUMN options SET DEFAULT '[]'::jsonb;

-- ============================================================================
-- Verification queries (for manual testing):
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'lens_product_attributes' AND column_name = 'options';
-- Expected: data_type = 'jsonb'

-- SELECT id, name, jsonb_typeof(options), jsonb_array_length(options), 
--        options->0->'value', options->0->'label'
-- FROM lens_product_attributes LIMIT 5;
-- Expected: jsonb_typeof = 'array', options->0 has 'value', 'label', etc.
-- ============================================================================