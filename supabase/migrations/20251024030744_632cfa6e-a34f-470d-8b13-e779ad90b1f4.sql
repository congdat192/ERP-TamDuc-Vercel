-- Disable trigger temporarily
ALTER TABLE lens_products DISABLE TRIGGER ensure_valid_attributes;

-- Manually fix ALL products with double nested arrays
DO $$
DECLARE
  product RECORD;
  attr_key TEXT;
  new_attrs JSONB;
  attr_value JSONB;
  has_changes BOOLEAN;
BEGIN
  FOR product IN SELECT id, attributes FROM lens_products WHERE is_active = true
  LOOP
    new_attrs := product.attributes;
    has_changes := false;
    
    -- Process each key in attributes
    FOR attr_key IN SELECT jsonb_object_keys(product.attributes)
    LOOP
      attr_value := product.attributes->attr_key;
      
      -- Check if value is double nested array [["VALUE"]]
      IF jsonb_typeof(attr_value) = 'array' 
         AND jsonb_array_length(attr_value) > 0
         AND jsonb_typeof(attr_value->0) = 'array' THEN
        
        -- Flatten it: [["VALUE"]] -> ["VALUE"]
        new_attrs := jsonb_set(new_attrs, ARRAY[attr_key], attr_value->0);
        has_changes := true;
        
        RAISE NOTICE 'Flattening product %: % from % to %', 
          product.id, attr_key, attr_value, attr_value->0;
      END IF;
    END LOOP;
    
    -- Update only if there were changes
    IF has_changes THEN
      UPDATE lens_products 
      SET attributes = new_attrs, updated_at = now()
      WHERE id = product.id;
    END IF;
  END LOOP;
END $$;

-- Re-enable trigger
ALTER TABLE lens_products ENABLE TRIGGER ensure_valid_attributes;