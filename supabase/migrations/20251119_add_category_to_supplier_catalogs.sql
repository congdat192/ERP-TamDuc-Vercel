-- Add category field to supplier_catalogs table
ALTER TABLE supplier_catalogs ADD COLUMN IF NOT EXISTS category TEXT;

-- Add index for category for better query performance
CREATE INDEX IF NOT EXISTS idx_supplier_catalogs_category ON supplier_catalogs(category, display_order);

-- Update existing records to have a default category (optional)
UPDATE supplier_catalogs SET category = 'Khác' WHERE category IS NULL;
