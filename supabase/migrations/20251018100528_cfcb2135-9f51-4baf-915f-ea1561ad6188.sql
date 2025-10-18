-- =====================================================
-- PHASE 1: UPDATE EMPLOYEES TABLE FOR PAYROLL SYSTEM
-- =====================================================

-- Step 1: Create employment_type enum (replacing contract_type)
CREATE TYPE employment_type AS ENUM (
  'Full-time',
  'Part-time', 
  'CTV',
  'Thử việc',
  'Thực tập'
);

-- Step 2: Add new columns for payroll
ALTER TABLE employees
  -- Basic info
  ADD COLUMN team text,
  ADD COLUMN employment_type employment_type DEFAULT 'Thử việc',
  ADD COLUMN seniority_months integer,
  
  -- Allowances (replacing salary_p3)
  ADD COLUMN allowance_meal numeric DEFAULT 0,
  ADD COLUMN allowance_fuel numeric DEFAULT 0,
  ADD COLUMN allowance_phone numeric DEFAULT 0,
  ADD COLUMN allowance_other numeric DEFAULT 0,
  ADD COLUMN total_fixed_salary numeric,
  
  -- Notes
  ADD COLUMN notes text;

-- Step 3: Migrate contract_type to employment_type
UPDATE employees
SET employment_type = CASE 
  WHEN contract_type = 'Chính Thức' THEN 'Full-time'::employment_type
  WHEN contract_type = 'Thử Việc' THEN 'Thử việc'::employment_type
  WHEN contract_type = 'Hợp Đồng' THEN 'Part-time'::employment_type
  ELSE 'Thử việc'::employment_type
END;

-- Step 4: Create function to calculate seniority_months
CREATE OR REPLACE FUNCTION calculate_seniority_months()
RETURNS TRIGGER AS $$
BEGIN
  NEW.seniority_months := EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.join_date)) * 12 
                        + EXTRACT(MONTH FROM AGE(CURRENT_DATE, NEW.join_date));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger for seniority_months
CREATE TRIGGER update_seniority_months
  BEFORE INSERT OR UPDATE OF join_date ON employees
  FOR EACH ROW
  EXECUTE FUNCTION calculate_seniority_months();

-- Step 6: Create function to calculate total_fixed_salary
CREATE OR REPLACE FUNCTION calculate_total_fixed_salary()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_fixed_salary := COALESCE(NEW.salary_p1, 0) 
                          + COALESCE(NEW.allowance_meal, 0)
                          + COALESCE(NEW.allowance_fuel, 0)
                          + COALESCE(NEW.allowance_phone, 0)
                          + COALESCE(NEW.allowance_other, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for total_fixed_salary
CREATE TRIGGER update_total_fixed_salary
  BEFORE INSERT OR UPDATE OF salary_p1, allowance_meal, allowance_fuel, allowance_phone, allowance_other ON employees
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_fixed_salary();

-- Step 8: Backfill seniority_months for existing employees
UPDATE employees
SET seniority_months = EXTRACT(YEAR FROM AGE(CURRENT_DATE, join_date)) * 12 
                     + EXTRACT(MONTH FROM AGE(CURRENT_DATE, join_date));

-- Step 9: Backfill total_fixed_salary for existing employees
UPDATE employees
SET total_fixed_salary = COALESCE(salary_p1, 0) 
                       + COALESCE(allowance_meal, 0)
                       + COALESCE(allowance_fuel, 0)
                       + COALESCE(allowance_phone, 0)
                       + COALESCE(allowance_other, 0);

-- Step 10: Drop old fields that are no longer needed
ALTER TABLE employees
  DROP COLUMN IF EXISTS contract_type,
  DROP COLUMN IF EXISTS salary_p2,
  DROP COLUMN IF EXISTS salary_p3;

-- Step 11: Add comments for documentation
COMMENT ON COLUMN employees.team IS 'Nhóm/team làm việc trực thuộc';
COMMENT ON COLUMN employees.employment_type IS 'Loại hình làm việc';
COMMENT ON COLUMN employees.seniority_months IS 'Thâm niên tính bằng tháng (tự động)';
COMMENT ON COLUMN employees.allowance_meal IS 'Phụ cấp ăn trưa (VND)';
COMMENT ON COLUMN employees.allowance_fuel IS 'Phụ cấp xăng xe (VND)';
COMMENT ON COLUMN employees.allowance_phone IS 'Phụ cấp điện thoại (VND)';
COMMENT ON COLUMN employees.allowance_other IS 'Phụ cấp khác (VND)';
COMMENT ON COLUMN employees.total_fixed_salary IS 'Tổng lương cứng = LCB + tất cả phụ cấp (tự động)';
COMMENT ON COLUMN employees.notes IS 'Ghi chú về nhân viên';

-- =====================================================
-- PHASE 2: CREATE MONTHLY_ATTENDANCE TABLE
-- =====================================================

-- Step 1: Create monthly_attendance table
CREATE TABLE monthly_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  month date NOT NULL, -- First day of the month (YYYY-MM-01)
  
  -- Attendance data
  standard_days numeric DEFAULT 26,
  actual_days numeric DEFAULT 0,
  paid_leave numeric DEFAULT 0,
  unpaid_leave numeric DEFAULT 0,
  ot_hours numeric DEFAULT 0,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  
  -- Ensure one record per employee per month
  UNIQUE(employee_id, month)
);

-- Step 2: Add index for performance
CREATE INDEX idx_monthly_attendance_employee_month ON monthly_attendance(employee_id, month DESC);
CREATE INDEX idx_monthly_attendance_month ON monthly_attendance(month DESC);

-- Step 3: Enable RLS
ALTER TABLE monthly_attendance ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS Policies - same as employees table
CREATE POLICY "Users can view attendance if they have permission"
ON monthly_attendance FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'view_employees'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can create attendance if they have permission"
ON monthly_attendance FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'create_employees'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can update attendance if they have permission"
ON monthly_attendance FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'edit_employees'
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Users can delete attendance if they have permission"
ON monthly_attendance FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'delete_employees'
  ) OR is_admin(auth.uid())
);

-- Step 5: Add trigger for updated_at
CREATE TRIGGER update_monthly_attendance_updated_at
  BEFORE UPDATE ON monthly_attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Add comments
COMMENT ON TABLE monthly_attendance IS 'Bảng chấm công hàng tháng cho tính lương';
COMMENT ON COLUMN monthly_attendance.month IS 'Tháng chấm công (ngày đầu tháng, format YYYY-MM-01)';
COMMENT ON COLUMN monthly_attendance.standard_days IS 'Số ngày công chuẩn trong tháng';
COMMENT ON COLUMN monthly_attendance.actual_days IS 'Số ngày công thực tế làm việc';
COMMENT ON COLUMN monthly_attendance.paid_leave IS 'Số ngày nghỉ có phép';
COMMENT ON COLUMN monthly_attendance.unpaid_leave IS 'Số ngày nghỉ không phép';
COMMENT ON COLUMN monthly_attendance.ot_hours IS 'Số giờ làm thêm (OT)';