-- ============================================
-- VOUCHER MANAGEMENT MODULE - DATABASE SCHEMA
-- ============================================

-- 1. Bảng chiến dịch voucher
CREATE TABLE IF NOT EXISTS voucher_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  campaign_id TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng template voucher
CREATE TABLE IF NOT EXISTS voucher_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_text TEXT NOT NULL,
  template_html TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bảng loại khách hàng
CREATE TABLE IF NOT EXISTS voucher_customer_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_code TEXT UNIQUE NOT NULL,
  type_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Bảng nguồn khách hàng
CREATE TABLE IF NOT EXISTS voucher_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_code TEXT UNIQUE NOT NULL,
  source_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Bảng lịch sử phát voucher
CREATE TABLE IF NOT EXISTS voucher_issuance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  source TEXT NOT NULL,
  customer_type TEXT,
  issued_by UUID REFERENCES auth.users(id),
  voucher_code TEXT,
  status TEXT,
  error_message TEXT,
  api_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_voucher_campaigns_active ON voucher_campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_voucher_history_phone ON voucher_issuance_history(phone);
CREATE INDEX IF NOT EXISTS idx_voucher_history_created ON voucher_issuance_history(created_at DESC);

-- RLS Policies
ALTER TABLE voucher_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_customer_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_issuance_history ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access campaigns" ON voucher_campaigns FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access templates" ON voucher_templates FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access customer types" ON voucher_customer_types FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access sources" ON voucher_sources FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access history" ON voucher_issuance_history FOR ALL USING (is_admin(auth.uid()));

-- Staff read settings, write history
CREATE POLICY "Staff read campaigns" ON voucher_campaigns FOR SELECT USING (true);
CREATE POLICY "Staff read templates" ON voucher_templates FOR SELECT USING (true);
CREATE POLICY "Staff read customer types" ON voucher_customer_types FOR SELECT USING (true);
CREATE POLICY "Staff read sources" ON voucher_sources FOR SELECT USING (true);
CREATE POLICY "Staff insert history" ON voucher_issuance_history FOR INSERT WITH CHECK (issued_by = auth.uid());
CREATE POLICY "Staff read own history" ON voucher_issuance_history FOR SELECT USING (issued_by = auth.uid() OR is_admin(auth.uid()));

-- Seed data
INSERT INTO voucher_campaigns (name, campaign_id, description) VALUES
('Khách mới Q1 2025', 'NEW_Q1_2025', 'Giảm 20% cho khách hàng mới'),
('Khách cũ VIP', 'VIP_LOYALTY', 'Voucher tri ân khách VIP')
ON CONFLICT (campaign_id) DO NOTHING;

INSERT INTO voucher_templates (name, template_text, is_default) VALUES
('Template mặc định', 
 E'🎁 Chúc mừng! Bạn nhận được mã voucher: {{voucher_code}}\n📋 Chiến dịch: {{campaign_name}}\n💰 Giảm giá: {{discount_display}}\n⏰ Hết hạn: {{expires_at}}\n📞 Hotline: 1900-xxx-xxx',
 true)
ON CONFLICT DO NOTHING;

INSERT INTO voucher_customer_types (type_code, type_name, description) VALUES
('new', 'Khách hàng mới', 'Khách hàng chưa từng mua hàng'),
('existing', 'Khách hàng cũ', 'Khách hàng đã mua hàng trước đây'),
('vip', 'Khách hàng VIP', 'Khách hàng VIP với giá trị cao')
ON CONFLICT (type_code) DO NOTHING;

INSERT INTO voucher_sources (source_code, source_name, description) VALUES
('fanpage', 'Facebook Fanpage', 'Khách hàng từ Fanpage'),
('website', 'Website', 'Khách hàng từ Website'),
('zalo', 'Zalo OA', 'Khách hàng từ Zalo OA')
ON CONFLICT (source_code) DO NOTHING;