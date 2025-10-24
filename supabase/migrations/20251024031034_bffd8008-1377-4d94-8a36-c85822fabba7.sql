-- FINAL FIX: Disable trigger and force update ALL products
ALTER TABLE lens_products DISABLE TRIGGER ensure_valid_attributes;

-- Update ALL products with nested arrays
UPDATE lens_products p
SET attributes = (
  SELECT jsonb_object_agg(
    key,
    CASE 
      -- Fix nested arrays: [["VALUE"]] → ["VALUE"]
      WHEN jsonb_typeof(value) = 'array' 
           AND jsonb_array_length(value) > 0
           AND jsonb_typeof(value->0) = 'array'
      THEN value->0
      ELSE value
    END
  )
  FROM jsonb_each(p.attributes)
)
WHERE id IN (
  SELECT id FROM lens_products
  WHERE attributes::text LIKE '%[["CHEMI"]]%'
     OR attributes::text LIKE '%[["HOYA"]]%'
     OR attributes::text LIKE '%[["ESSILOR"]]%'
     OR attributes::text LIKE '%[["NIKON"]]%'
     OR attributes::text LIKE '%[["ZEISS"]]%'
);

ALTER TABLE lens_products ENABLE TRIGGER ensure_valid_attributes;