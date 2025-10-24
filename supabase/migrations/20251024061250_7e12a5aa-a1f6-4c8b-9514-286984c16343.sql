-- Phase 1: Database Cleanup - Remove redundant columns and optimize attributes JSONB

-- Step 1: Delete existing products (clean start)
DELETE FROM lens_products;

-- Step 2: Drop redundant columns that duplicate attributes JSONB data
ALTER TABLE lens_products 
  DROP COLUMN IF EXISTS material,
  DROP COLUMN IF EXISTS refractive_index,
  DROP COLUMN IF EXISTS origin,
  DROP COLUMN IF EXISTS warranty_months;

-- Step 3: Add GIN index for fast JSONB queries on attributes
CREATE INDEX IF NOT EXISTS idx_lens_products_attributes 
  ON lens_products USING GIN (attributes jsonb_path_ops);

-- Step 4: Add comment for documentation
COMMENT ON COLUMN lens_products.attributes IS 'JSONB storing product attributes as {"slug": ["value1", "value2"]}. Select attributes use single-element arrays ["value"], multiselect use multiple elements ["value1", "value2"]';