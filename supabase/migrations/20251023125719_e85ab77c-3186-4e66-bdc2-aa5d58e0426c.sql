-- Thêm column related_product_ids vào lens_products
ALTER TABLE lens_products 
ADD COLUMN IF NOT EXISTS related_product_ids JSONB DEFAULT '[]'::jsonb;

-- Comment để mô tả
COMMENT ON COLUMN lens_products.related_product_ids IS 'Array of product IDs that are related to this product';

-- Index để query nhanh hơn
CREATE INDEX IF NOT EXISTS idx_lens_products_related_ids 
ON lens_products USING gin(related_product_ids);