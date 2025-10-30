-- =============================================
-- KIOTVIET PRODUCTS FULL - SINGLE TABLE DESIGN
-- Loại bỏ: Giá vốn & Tính lãi
-- =============================================

-- Drop old tables if migrating (optional - comment out if keeping old structure)
-- DROP TABLE IF EXISTS kiotviet_inventory CASCADE;
-- DROP TABLE IF EXISTS kiotviet_products CASCADE;
-- DROP TABLE IF EXISTS kiotviet_categories CASCADE;

-- Create main products table
CREATE TABLE IF NOT EXISTS kiotviet_products_full (
  -- Primary Key
  id BIGINT PRIMARY KEY,
  
  -- Basic Info
  code TEXT NOT NULL UNIQUE,
  barcode TEXT,
  name TEXT NOT NULL,
  full_name TEXT,
  description TEXT,
  
  -- Category (Denormalized)
  category_id BIGINT,
  category_name TEXT,
  category_path TEXT, -- "Tròng kính > RX > Cận"
  
  -- Trademark/Brand (Denormalized)
  trademark_id BIGINT,
  trademark_name TEXT,
  
  -- Pricing (NO COST/PROFIT)
  base_price NUMERIC DEFAULT 0,
  
  -- Inventory Summary (Aggregated across all branches)
  total_on_hand NUMERIC DEFAULT 0,
  total_reserved NUMERIC DEFAULT 0,
  total_available NUMERIC DEFAULT 0,
  
  -- Inventory by Branch (JSONB - Dynamic)
  inventory_by_branch JSONB DEFAULT '[]'::jsonb,
  /* Example structure:
  [
    {
      "branch_id": 1,
      "branch_name": "Chi nhánh Sàn",
      "on_hand": 10,
      "reserved": 2,
      "available": 8,
      "min_quality": 5,
      "max_quality": 50,
      "location": "A1-B2"
    }
  ]
  */
  
  -- Stock Management
  min_stock NUMERIC DEFAULT 0,
  max_stock NUMERIC DEFAULT 999999999,
  low_stock_alert BOOLEAN GENERATED ALWAYS AS (total_on_hand < min_stock) STORED,
  overstock_alert BOOLEAN GENERATED ALWAYS AS (total_on_hand > max_stock) STORED,
  
  -- Product Details
  weight NUMERIC DEFAULT 0,
  
  -- Settings & Flags
  has_variants BOOLEAN DEFAULT false,
  allow_sale BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  product_type INTEGER DEFAULT 2, -- 1: combo, 2: normal, 3: service
  is_reward_point BOOLEAN DEFAULT true,
  is_lot_serial_control BOOLEAN DEFAULT false,
  is_batch_expire_control BOOLEAN DEFAULT false,
  
  -- Order Template
  order_template TEXT,
  
  -- JSONB Fields (Flexibility for complex data)
  images JSONB DEFAULT '[]'::jsonb,
  attributes JSONB DEFAULT '[]'::jsonb,
  units JSONB DEFAULT '[]'::jsonb,
  price_books JSONB DEFAULT '[]'::jsonb,
  product_formulas JSONB DEFAULT '[]'::jsonb,
  product_serials JSONB DEFAULT '[]'::jsonb,
  product_batch_expires JSONB DEFAULT '[]'::jsonb,
  product_shelves JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_kv_products_full_code ON kiotviet_products_full(code);
CREATE INDEX IF NOT EXISTS idx_kv_products_full_barcode ON kiotviet_products_full(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kv_products_full_name ON kiotviet_products_full USING gin(to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_kv_products_full_category ON kiotviet_products_full(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kv_products_full_trademark ON kiotviet_products_full(trademark_id) WHERE trademark_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kv_products_full_low_stock ON kiotviet_products_full(low_stock_alert) WHERE low_stock_alert = true;
CREATE INDEX IF NOT EXISTS idx_kv_products_full_overstock ON kiotviet_products_full(overstock_alert) WHERE overstock_alert = true;
CREATE INDEX IF NOT EXISTS idx_kv_products_full_active ON kiotviet_products_full(is_active);
CREATE INDEX IF NOT EXISTS idx_kv_products_full_synced ON kiotviet_products_full(synced_at DESC);

-- RLS Policies
ALTER TABLE kiotviet_products_full ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_authenticated_read" ON kiotviet_products_full 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "allow_admin_all" ON kiotviet_products_full 
  FOR ALL 
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_kiotviet_products_full_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

-- Trigger for auto-updating updated_at
CREATE TRIGGER trigger_update_kiotviet_products_full_updated_at
  BEFORE UPDATE ON kiotviet_products_full
  FOR EACH ROW
  EXECUTE FUNCTION update_kiotviet_products_full_updated_at();

-- Grant permissions
GRANT SELECT ON kiotviet_products_full TO authenticated;
GRANT ALL ON kiotviet_products_full TO service_role;