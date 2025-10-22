-- Drop parent_sku column and index from lens_products table
DROP INDEX IF EXISTS idx_lens_products_parent_sku;
ALTER TABLE lens_products DROP COLUMN IF EXISTS parent_sku;