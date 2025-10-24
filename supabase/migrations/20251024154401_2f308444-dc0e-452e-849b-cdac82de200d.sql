-- Phase 1: Create lens_supply_tiers table
CREATE TABLE lens_supply_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES lens_products(id) ON DELETE CASCADE,
  tier_type TEXT NOT NULL CHECK (tier_type IN ('IN_STORE', 'NEXT_DAY', 'CUSTOM_ORDER', 'FACTORY_ORDER')),
  tier_name TEXT,
  sph_min NUMERIC(4,2) NOT NULL,
  sph_max NUMERIC(4,2) NOT NULL,
  cyl_min NUMERIC(4,2) NOT NULL,
  cyl_max NUMERIC(4,2) NOT NULL,
  lead_time_days INTEGER NOT NULL DEFAULT 0,
  stock_quantity INTEGER NULL,
  price_adjustment NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_sph_range CHECK (sph_min <= sph_max),
  CONSTRAINT valid_cyl_range CHECK (cyl_min <= cyl_max)
);

CREATE INDEX idx_supply_tiers_product_id ON lens_supply_tiers(product_id);
CREATE INDEX idx_supply_tiers_type ON lens_supply_tiers(tier_type) WHERE is_active = true;
CREATE INDEX idx_supply_tiers_sph_cyl ON lens_supply_tiers(sph_min, sph_max, cyl_min, cyl_max);

-- Enable RLS
ALTER TABLE lens_supply_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tiers"
  ON lens_supply_tiers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage tiers"
  ON lens_supply_tiers FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Phase 1: Create lens_use_cases table
CREATE TABLE lens_use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_use_cases_code ON lens_use_cases(code) WHERE is_active = true;

-- Enable RLS
ALTER TABLE lens_use_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active use cases"
  ON lens_use_cases FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage use cases"
  ON lens_use_cases FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Seed data for use cases
INSERT INTO lens_use_cases (code, name, description, icon, display_order) VALUES
  ('computer_work', 'Dùng máy tính nhiều', 'Làm việc văn phòng, coding, design, cần lọc ánh sáng xanh', 'Monitor', 1),
  ('driving', 'Lái xe thường xuyên', 'Lái xe ban ngày, cần chống chói và UV', 'Car', 2),
  ('outdoor_sports', 'Chơi thể thao ngoài trời', 'Chạy bộ, đạp xe, tennis, cần bền và chống va đập', 'Activity', 3),
  ('indoor_activities', 'Hoạt động trong nhà', 'Đọc sách, xem TV, các hoạt động giải trí', 'Home', 4),
  ('night_driving', 'Lái xe ban đêm', 'Cần giảm chói từ đèn pha đối diện', 'Moon', 5),
  ('screen_heavy', 'Dùng điện thoại/màn hình nhiều', 'Mỏi mắt, khô mắt, cần bảo vệ mắt khỏi ánh sáng xanh', 'Smartphone', 6),
  ('professional', 'Công việc chuyên nghiệp', 'Cần độ chính xác cao, nhìn rõ nhiều khoảng cách', 'Briefcase', 7),
  ('myopia_control', 'Kiểm soát cận thị', 'Trẻ em/thanh thiếu niên cần làm chậm tiến triển cận', 'Eye', 8);

-- Phase 1: Create lens_product_use_case_scores table
CREATE TABLE lens_product_use_case_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES lens_products(id) ON DELETE CASCADE,
  use_case_id UUID NOT NULL REFERENCES lens_use_cases(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(product_id, use_case_id)
);

CREATE INDEX idx_product_scores_product ON lens_product_use_case_scores(product_id);
CREATE INDEX idx_product_scores_use_case ON lens_product_use_case_scores(use_case_id);
CREATE INDEX idx_product_scores_score ON lens_product_use_case_scores(score DESC);

-- Enable RLS
ALTER TABLE lens_product_use_case_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scores"
  ON lens_product_use_case_scores FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage scores"
  ON lens_product_use_case_scores FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));