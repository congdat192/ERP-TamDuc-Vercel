-- Quick fix: Convert remaining scalar attributes to array format
DO $$
DECLARE
  product_record RECORD;
  attr_key TEXT;
  attr_value JSONB;
  new_attrs JSONB;
  fixed_count INT := 0;
BEGIN
  RAISE NOTICE 'Fixing remaining scalar attributes...';
  
  FOR product_record IN 
    SELECT id, name, attributes 
    FROM lens_products 
    WHERE is_active = true AND attributes IS NOT NULL
  LOOP
    new_attrs := product_record.attributes;
    
    FOR attr_key IN SELECT jsonb_object_keys(product_record.attributes)
    LOOP
      attr_value := product_record.attributes->attr_key;
      
      -- Convert scalar strings to arrays
      IF jsonb_typeof(attr_value) = 'string' THEN
        new_attrs := jsonb_set(
          new_attrs,
          ARRAY[attr_key],
          jsonb_build_array(attr_value),
          true
        );
        fixed_count := fixed_count + 1;
        RAISE NOTICE '  ✓ Fixed %.% for product "%"', attr_key, attr_value, product_record.name;
      END IF;
    END LOOP;
    
    IF new_attrs != product_record.attributes THEN
      UPDATE lens_products 
      SET attributes = new_attrs, updated_at = now()
      WHERE id = product_record.id;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Fixed % scalar attributes', fixed_count;
END $$;

-- Final verification
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN jsonb_typeof(attributes->'lens_brand') != 'array' THEN 1 END) as scalar_brand,
  COUNT(CASE WHEN jsonb_typeof(attributes->'material') != 'array' THEN 1 END) as scalar_material,
  COUNT(CASE WHEN jsonb_typeof(attributes->'refractive_index') != 'array' THEN 1 END) as scalar_refractive
FROM lens_products 
WHERE is_active = true AND attributes IS NOT NULL;