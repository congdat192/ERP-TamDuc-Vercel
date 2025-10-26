-- Upgrade attribute options from string[] to jsonb with metadata
-- Step 1: Backup existing data
CREATE TABLE IF NOT EXISTS lens_product_attributes_backup AS 
SELECT * FROM lens_product_attributes;

-- Step 2: Migrate existing string options to new object format
-- Convert ["Plastic", "Hi-Index"] → [{"value": "Plastic", "label": "Plastic"}, ...]
UPDATE lens_product_attributes
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
  FROM jsonb_array_elements_text(options) AS elem
)
WHERE jsonb_typeof(options) = 'array' 
  AND (options->0->>'value') IS NULL; -- Only migrate if not already migrated

-- Step 3: Add comment for documentation
COMMENT ON COLUMN lens_product_attributes.options IS 
'JSONB array of objects: [{"value": "plastic", "label": "Plastic", "image_url": "...", "short_description": "...", "content": "..."}]';

-- Step 4: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_lens_product_attributes_options 
ON lens_product_attributes USING GIN (options);