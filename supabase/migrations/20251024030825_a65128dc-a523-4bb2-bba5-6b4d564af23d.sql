-- Fix ALL attribute formats: string → ["value"] and [["value"]] → ["value"]
DO $$
DECLARE
  product RECORD;
  attr_key TEXT;
  new_attrs JSONB;
  attr_value JSONB;
  has_changes BOOLEAN;
BEGIN
  FOR product IN SELECT id, name, attributes FROM lens_products WHERE is_active = true
  LOOP
    new_attrs := product.attributes;
    has_changes := false;
    
    -- Process each key in attributes
    FOR attr_key IN SELECT jsonb_object_keys(product.attributes)
    LOOP
      attr_value := product.attributes->attr_key;
      
      -- Case 1: String value → Convert to single-item array
      IF jsonb_typeof(attr_value) = 'string' THEN
        new_attrs := jsonb_set(new_attrs, ARRAY[attr_key], jsonb_build_array(attr_value));
        has_changes := true;
        RAISE NOTICE 'Product %: Converting % from string "%" to array', 
          product.name, attr_key, attr_value;
          
      -- Case 2: Double nested array [["VALUE"]] → Flatten to ["VALUE"]
      ELSIF jsonb_typeof(attr_value) = 'array' 
         AND jsonb_array_length(attr_value) > 0
         AND jsonb_typeof(attr_value->0) = 'array' THEN
        
        new_attrs := jsonb_set(new_attrs, ARRAY[attr_key], attr_value->0);
        has_changes := true;
        RAISE NOTICE 'Product %: Flattening % from nested array to %', 
          product.name, attr_key, attr_value->0;
      END IF;
    END LOOP;
    
    -- Update only if there were changes
    IF has_changes THEN
      UPDATE lens_products 
      SET attributes = new_attrs
      WHERE id = product.id;
      
      RAISE NOTICE 'Updated product: % (ID: %)', product.name, product.id;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Attribute normalization complete!';
END $$;