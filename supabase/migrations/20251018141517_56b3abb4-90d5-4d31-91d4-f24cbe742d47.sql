-- ===================================================
-- PHASE 1: HR BENEFITS MODULE - DATABASE SCHEMA
-- ===================================================

-- 1. CREATE BENEFITS TABLE
CREATE TABLE hr_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  benefit_code TEXT NOT NULL UNIQUE,
  benefit_name TEXT NOT NULL,
  benefit_type TEXT NOT NULL CHECK (benefit_type IN ('insurance', 'allowance', 'bonus', 'leave', 'other')),
  description TEXT,
  eligibility_criteria TEXT,
  value NUMERIC(15,2),
  frequency TEXT CHECK (frequency IN ('one-time', 'monthly', 'quarterly', 'yearly', 'as-needed')),
  effective_from DATE,
  effective_to DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_hr_benefits_type ON hr_benefits(benefit_type);
CREATE INDEX idx_hr_benefits_status ON hr_benefits(status);
CREATE INDEX idx_hr_benefits_deleted ON hr_benefits(deleted_at);

-- 2. CREATE BENEFIT ASSIGNMENTS TABLE
CREATE TABLE hr_benefit_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  benefit_id UUID NOT NULL REFERENCES hr_benefits(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  notes TEXT,
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(employee_id, benefit_id, start_date)
);

CREATE INDEX idx_benefit_assignments_employee ON hr_benefit_assignments(employee_id);
CREATE INDEX idx_benefit_assignments_benefit ON hr_benefit_assignments(benefit_id);

-- 3. CREATE REWARDS TABLE
CREATE TABLE hr_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_code TEXT NOT NULL UNIQUE,
  reward_title TEXT NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('bonus', 'recognition', 'gift', 'promotion', 'other')),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  awarded_date DATE NOT NULL,
  reason TEXT NOT NULL,
  amount NUMERIC(15,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_note TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hr_rewards_employee ON hr_rewards(employee_id);
CREATE INDEX idx_hr_rewards_status ON hr_rewards(status);
CREATE INDEX idx_hr_rewards_awarded_date ON hr_rewards(awarded_date);

-- 4. CREATE DISCIPLINE RECORDS TABLE
CREATE TABLE hr_discipline_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_code TEXT NOT NULL UNIQUE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL CHECK (violation_type IN ('late', 'absent', 'policy-violation', 'misconduct', 'other')),
  violation_date DATE NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('warning', 'minor', 'major', 'critical')),
  penalty TEXT,
  penalty_amount NUMERIC(15,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'appealed')),
  issued_by UUID NOT NULL REFERENCES auth.users(id),
  issued_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolution_note TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hr_discipline_employee ON hr_discipline_records(employee_id);
CREATE INDEX idx_hr_discipline_status ON hr_discipline_records(status);
CREATE INDEX idx_hr_discipline_violation_date ON hr_discipline_records(violation_date);

-- 5. ENABLE ROW-LEVEL SECURITY
ALTER TABLE hr_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_benefit_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_discipline_records ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR HR_BENEFITS
CREATE POLICY "Users can view benefits if they have permission"
ON hr_benefits FOR SELECT
USING (
  deleted_at IS NULL AND (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN features f ON f.id = rp.feature_id
      WHERE ur.user_id = auth.uid()
        AND f.code = 'view_benefits'
    ) OR is_admin(auth.uid())
  )
);

CREATE POLICY "Admins can view deleted benefits"
ON hr_benefits FOR SELECT
USING (
  deleted_at IS NOT NULL AND is_admin(auth.uid())
);

CREATE POLICY "Users can create benefits if they have permission"
ON hr_benefits FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'create_benefits'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can update benefits if they have permission"
ON hr_benefits FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'edit_benefits'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can delete benefits if they have permission"
ON hr_benefits FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'delete_benefits'
  ) OR is_admin(auth.uid())
);

-- 7. RLS POLICIES FOR BENEFIT_ASSIGNMENTS
CREATE POLICY "Users can view assignments if they have permission"
ON hr_benefit_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'view_benefits'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can manage assignments if they have permission"
ON hr_benefit_assignments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code IN ('create_benefits', 'edit_benefits')
  ) OR is_admin(auth.uid())
);

-- 8. RLS POLICIES FOR REWARDS
CREATE POLICY "Users can view rewards if they have permission"
ON hr_rewards FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'view_rewards'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can create rewards if they have permission"
ON hr_rewards FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'create_rewards'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can update rewards if they have permission"
ON hr_rewards FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code IN ('edit_rewards', 'approve_rewards')
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can delete rewards if they have permission"
ON hr_rewards FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'delete_rewards'
  ) OR is_admin(auth.uid())
);

-- 9. RLS POLICIES FOR DISCIPLINE RECORDS
CREATE POLICY "Users can view discipline records if they have permission"
ON hr_discipline_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'view_discipline'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can manage discipline records if they have permission"
ON hr_discipline_records FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_discipline'
  ) OR is_admin(auth.uid())
);

-- 10. AUTO-UPDATE TRIGGERS
CREATE TRIGGER update_hr_benefits_updated_at
  BEFORE UPDATE ON hr_benefits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_rewards_updated_at
  BEFORE UPDATE ON hr_rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_discipline_updated_at
  BEFORE UPDATE ON hr_discipline_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 11. ADD FEATURES TO MODULES
INSERT INTO features (module_id, code, name, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'hr'), 'view_benefits', 'Xem Phúc Lợi', 'read'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'create_benefits', 'Tạo Phúc Lợi', 'write'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'edit_benefits', 'Sửa Phúc Lợi', 'write'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'delete_benefits', 'Xóa Phúc Lợi', 'delete'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'view_rewards', 'Xem Khen Thưởng', 'read'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'create_rewards', 'Tạo Khen Thưởng', 'write'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'edit_rewards', 'Sửa Khen Thưởng', 'write'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'delete_rewards', 'Xóa Khen Thưởng', 'delete'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'approve_rewards', 'Phê Duyệt Khen Thưởng', 'approve'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'view_discipline', 'Xem Kỷ Luật', 'read'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'manage_discipline', 'Quản Lý Kỷ Luật', 'write');