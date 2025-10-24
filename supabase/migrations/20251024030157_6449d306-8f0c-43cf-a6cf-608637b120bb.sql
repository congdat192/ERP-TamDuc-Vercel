-- Fix attributes structure - Flatten ALL double nested arrays universally
DO $$
DECLARE
  product RECORD;
  attr_key TEXT;
  new_attrs JSONB;
  attr_value JSONB;
BEGIN
  FOR product IN SELECT id, attributes FROM lens_products WHERE is_active = true
  LOOP
    new_attrs := product.attributes;
    
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
      END IF;
    END LOOP;
    
    -- Update product with flattened attributes
    UPDATE lens_products SET attributes = new_attrs WHERE id = product.id;
  END LOOP;
END $$;