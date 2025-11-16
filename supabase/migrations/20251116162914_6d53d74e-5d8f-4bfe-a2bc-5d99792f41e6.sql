-- Phase 1: Add display_order column to lens_products
ALTER TABLE lens_products 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Initialize display_order based on created_at (older products = higher order)
UPDATE lens_products 
SET display_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM lens_products
) AS subquery
WHERE lens_products.id = subquery.id;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_lens_products_display_order 
ON lens_products(display_order);

-- Add comment
COMMENT ON COLUMN lens_products.display_order IS 
'Display order for filtered products. Lower number = higher priority. 0 = not manually ordered.';

-- Phase 2: RPC function for batch update display order
CREATE OR REPLACE FUNCTION batch_update_product_display_order(
  updates JSONB
) RETURNS void AS $$
DECLARE
  item JSONB;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    UPDATE lens_products
    SET display_order = (item->>'display_order')::INTEGER,
        updated_at = NOW()
    WHERE id = (item->>'id')::UUID;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;