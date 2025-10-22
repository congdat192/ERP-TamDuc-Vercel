-- Migration: Migrate old features format to new multiselect slug_values format
-- This migration handles products that still use the old attributes.features array format

-- Step 1: Add comments for tracking
COMMENT ON TABLE lens_products IS 'Lens products with attributes stored in JSONB format. Multiselect attributes use slug_values keys (e.g., protection_values)';

-- Step 2: Migrate existing products with old features format
-- This will convert attributes.features (array of UUIDs) to attributes.{slug}_values (array of option names)
DO $$
DECLARE
  product_record RECORD;
  attr_record RECORD;
  feature_id UUID;
  slug_key TEXT;
  option_names TEXT[];
BEGIN
  -- Loop through all products that have the old 'features' key
  FOR product_record IN 
    SELECT id, attributes 
    FROM lens_products 
    WHERE attributes ? 'features'
      AND jsonb_typeof(attributes->'features') = 'array'
  LOOP
    -- Loop through each feature ID in the old features array
    FOR feature_id IN 
      SELECT jsonb_array_elements_text(product_record.attributes->'features')::uuid
    LOOP
      -- Find the corresponding attribute
      SELECT slug, name INTO attr_record
      FROM lens_product_attributes
      WHERE id = feature_id AND type = 'multiselect';
      
      IF FOUND THEN
        -- Build the new key: {slug}_values
        slug_key := attr_record.slug || '_values';
        
        -- Get existing values or create empty array
        IF product_record.attributes ? slug_key THEN
          option_names := ARRAY(SELECT jsonb_array_elements_text(product_record.attributes->slug_key));
        ELSE
          option_names := ARRAY[]::TEXT[];
        END IF;
        
        -- Add the attribute name if not already present
        IF NOT (attr_record.name = ANY(option_names)) THEN
          option_names := array_append(option_names, attr_record.name);
        END IF;
        
        -- Update the product with new format
        UPDATE lens_products
        SET attributes = jsonb_set(
          attributes,
          ARRAY[slug_key],
          to_jsonb(option_names)
        )
        WHERE id = product_record.id;
      END IF;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Migration completed: Converted features to slug_values format';
END $$;

-- Step 3: Remove old 'features' key from all products
UPDATE lens_products
SET attributes = attributes - 'features'
WHERE attributes ? 'features';

-- Step 4: Add index for better JSONB query performance
CREATE INDEX IF NOT EXISTS idx_lens_products_attributes_gin ON lens_products USING gin(attributes jsonb_path_ops);

-- Step 5: Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Data migration completed successfully:';
  RAISE NOTICE '- Converted old attributes.features (UUIDs) to attributes.{slug}_values (option names)';
  RAISE NOTICE '- Removed old features key';
  RAISE NOTICE '- Added GIN index for JSONB attributes';
  RAISE NOTICE '- Products are now using the new multiselect format';
END $$;