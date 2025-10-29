-- Add missing fields from KiotViet API to match full schema
ALTER TABLE kiotviet_categories 
  ADD COLUMN IF NOT EXISTS retailer_id BIGINT,
  ADD COLUMN IF NOT EXISTS has_child BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS created_date TIMESTAMP WITH TIME ZONE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_kiotviet_categories_retailer_id 
  ON kiotviet_categories(retailer_id);

CREATE INDEX IF NOT EXISTS idx_kiotviet_categories_modified_date 
  ON kiotviet_categories(modified_date);

CREATE INDEX IF NOT EXISTS idx_kiotviet_categories_has_child 
  ON kiotviet_categories(has_child);

-- Add comments for documentation
COMMENT ON COLUMN kiotviet_categories.retailer_id IS 'Retailer ID from KiotViet API';
COMMENT ON COLUMN kiotviet_categories.has_child IS 'Whether category has child categories (max 3 levels)';
COMMENT ON COLUMN kiotviet_categories.modified_date IS 'Last modified date from KiotViet API for incremental sync';
COMMENT ON COLUMN kiotviet_categories.created_date IS 'Created date from KiotViet API';
COMMENT ON COLUMN kiotviet_categories.level IS 'Category hierarchy level (1=root, 2=child, 3=grandchild). Max 3 levels per KiotViet constraints';