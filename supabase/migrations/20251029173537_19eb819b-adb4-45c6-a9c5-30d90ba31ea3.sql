-- ==========================================
-- PHASE 1: KIOTVIET INTEGRATION DATABASE
-- ==========================================

-- 1. Credentials table (với encrypted token)
CREATE TABLE IF NOT EXISTS kiotviet_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  retailer_name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  encrypted_token TEXT NOT NULL, -- AES-256-GCM encrypted
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Categories table (synced from KiotViet)
CREATE TABLE IF NOT EXISTS kiotviet_categories (
  id BIGINT PRIMARY KEY,
  category_name TEXT NOT NULL,
  parent_id BIGINT,
  level INT DEFAULT 1,
  synced_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (parent_id) REFERENCES kiotviet_categories(id) ON DELETE SET NULL
);

-- 3. Products table (synced from KiotViet)
CREATE TABLE IF NOT EXISTS kiotviet_products (
  id BIGINT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  barcode TEXT,
  name TEXT NOT NULL,
  category_id BIGINT REFERENCES kiotviet_categories(id) ON DELETE SET NULL,
  full_name TEXT,
  description TEXT,
  base_price NUMERIC(15,2) DEFAULT 0,
  has_variants BOOLEAN DEFAULT false,
  allow_sale BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]'::jsonb,
  product_type INT DEFAULT 2,
  attributes JSONB DEFAULT '[]'::jsonb,
  units JSONB DEFAULT '[]'::jsonb,
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Inventory table (synced from KiotViet)
CREATE TABLE IF NOT EXISTS kiotviet_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT REFERENCES kiotviet_products(id) ON DELETE CASCADE,
  branch_id BIGINT NOT NULL,
  branch_name TEXT,
  on_hand NUMERIC(15,3) DEFAULT 0,
  reserved NUMERIC(15,3) DEFAULT 0,
  available NUMERIC(15,3) DEFAULT 0,
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, branch_id)
);

-- 5. Sync logs table
CREATE TABLE IF NOT EXISTS kiotviet_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  records_synced INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_kiotviet_products_code ON kiotviet_products(code);
CREATE INDEX IF NOT EXISTS idx_kiotviet_products_name ON kiotviet_products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_kiotviet_products_category ON kiotviet_products(category_id);
CREATE INDEX IF NOT EXISTS idx_kiotviet_products_active ON kiotviet_products(is_active);
CREATE INDEX IF NOT EXISTS idx_kiotviet_inventory_product ON kiotviet_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_kiotviet_inventory_branch ON kiotviet_inventory(branch_id);
CREATE INDEX IF NOT EXISTS idx_kiotviet_categories_parent ON kiotviet_categories(parent_id);

-- ==========================================
-- RLS POLICIES
-- ==========================================

ALTER TABLE kiotviet_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiotviet_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiotviet_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiotviet_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiotviet_sync_logs ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access credentials" ON kiotviet_credentials FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access categories" ON kiotviet_categories FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access products" ON kiotviet_products FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access inventory" ON kiotviet_inventory FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access logs" ON kiotviet_sync_logs FOR ALL USING (is_admin(auth.uid()));

-- All authenticated users can read (for product catalog)
CREATE POLICY "All users read categories" ON kiotviet_categories FOR SELECT USING (true);
CREATE POLICY "All users read products" ON kiotviet_products FOR SELECT USING (true);
CREATE POLICY "All users read inventory" ON kiotviet_inventory FOR SELECT USING (true);

-- ==========================================
-- TRIGGERS
-- ==========================================

CREATE TRIGGER update_kiotviet_credentials_updated_at
  BEFORE UPDATE ON kiotviet_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();