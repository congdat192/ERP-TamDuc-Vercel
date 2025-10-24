-- Debug: Force update ONE product and show details
DO $$
DECLARE
  old_val JSONB;
  new_val JSONB;
BEGIN
  -- Get current value
  SELECT attributes->'lens_brand' INTO old_val
  FROM lens_products
  WHERE name = 'Chemi U6 Perfect';
  
  RAISE NOTICE 'BEFORE: %', old_val;
  RAISE NOTICE 'Type: %', jsonb_typeof(old_val);
  RAISE NOTICE 'Length: %', jsonb_array_length(old_val);
  RAISE NOTICE 'First element: %', old_val->0;
  RAISE NOTICE 'First element type: %', jsonb_typeof(old_val->0);
  
  -- Force update
  UPDATE lens_products
  SET attributes = jsonb_set(attributes, '{lens_brand}', '["CHEMI"]'::jsonb)
  WHERE name = 'Chemi U6 Perfect';
  
  -- Get new value
  SELECT attributes->'lens_brand' INTO new_val
  FROM lens_products
  WHERE name = 'Chemi U6 Perfect';
  
  RAISE NOTICE 'AFTER: %', new_val;
  RAISE NOTICE 'Matches query: %', (SELECT attributes @> '{"lens_brand":["CHEMI"]}' FROM lens_products WHERE name = 'Chemi U6 Perfect');
END $$;