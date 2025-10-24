-- Drop trigger first, then recreate function with search_path
DROP TRIGGER IF EXISTS ensure_valid_attributes ON lens_products;
DROP FUNCTION IF EXISTS validate_lens_product_attributes() CASCADE;

CREATE OR REPLACE FUNCTION validate_lens_product_attributes()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  attr_key TEXT;
  new_attrs JSONB;
  attr_value JSONB;
BEGIN
  new_attrs := NEW.attributes;
  
  -- Process each key in attributes
  FOR attr_key IN SELECT jsonb_object_keys(NEW.attributes)
  LOOP
    attr_value := NEW.attributes->attr_key;
    
    -- Check if value is double nested array [["VALUE"]]
    IF jsonb_typeof(attr_value) = 'array' 
       AND jsonb_array_length(attr_value) > 0
       AND jsonb_typeof(attr_value->0) = 'array' THEN
      
      -- Flatten it: [["VALUE"]] -> ["VALUE"]
      new_attrs := jsonb_set(new_attrs, ARRAY[attr_key], attr_value->0);
    END IF;
  END LOOP;
  
  NEW.attributes := new_attrs;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER ensure_valid_attributes
  BEFORE INSERT OR UPDATE ON lens_products
  FOR EACH ROW
  EXECUTE FUNCTION validate_lens_product_attributes();

-- Manually flatten ALL existing data NOW
UPDATE lens_products
SET attributes = (
  SELECT jsonb_object_agg(
    key,
    CASE 
      WHEN jsonb_typeof(value) = 'array' 
           AND jsonb_array_length(value) > 0
           AND jsonb_typeof(value->0) = 'array' 
      THEN value->0
      ELSE value
    END
  )
  FROM jsonb_each(attributes)
)
WHERE is_active = true;