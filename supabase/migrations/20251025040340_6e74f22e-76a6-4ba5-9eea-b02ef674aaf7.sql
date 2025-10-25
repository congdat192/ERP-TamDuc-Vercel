-- Table: supplier_catalogs
CREATE TABLE IF NOT EXISTS supplier_catalogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  icon TEXT,
  pdf_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_supplier_catalogs_active ON supplier_catalogs(is_active, display_order);

-- RLS Policies
ALTER TABLE supplier_catalogs ENABLE ROW LEVEL SECURITY;

-- Public read for active catalogs (for LensCatalogPage)
CREATE POLICY "Public can view active catalogs" ON supplier_catalogs
  FOR SELECT USING (is_active = true);

-- Admin only for CUD operations
CREATE POLICY "Admin can manage catalogs" ON supplier_catalogs
  FOR ALL USING (is_admin(auth.uid()));

-- Trigger: Update updated_at
CREATE TRIGGER update_supplier_catalogs_updated_at
  BEFORE UPDATE ON supplier_catalogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();