-- Add unique constraint for SKU to enable upsert
ALTER TABLE lens_products 
ADD CONSTRAINT lens_products_sku_unique UNIQUE (sku);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_lens_products_sku 
ON lens_products(sku) WHERE is_active = true;