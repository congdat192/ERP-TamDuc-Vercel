-- ============================================
-- PHASE 1: DATABASE CLEANUP & ADD PARENT_SKU
-- ============================================

-- Drop unused tables from previous migration
DROP TABLE IF EXISTS lens_product_attribute_values CASCADE;
DROP TABLE IF EXISTS lens_product_variants CASCADE;

-- Add parent_sku column to lens_products for grouping variants
ALTER TABLE lens_products 
ADD COLUMN IF NOT EXISTS parent_sku TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_lens_products_parent_sku 
ON lens_products(parent_sku) 
WHERE parent_sku IS NOT NULL;

-- Add comment
COMMENT ON COLUMN lens_products.parent_sku IS 'SKU của sản phẩm gốc để group variants. VD: RODEN-CM cho tất cả chiết suất 1.56, 1.60, 1.67';

-- Verify schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'lens_products'
ORDER BY ordinal_position;