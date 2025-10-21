-- ============================================================================
-- PHASE 1: FIX TRAINING MODULE DATABASE SCHEMA
-- ============================================================================

-- Step 1.1: Chuẩn hóa bảng training_sessions - Thêm start_date, end_date
ALTER TABLE training_sessions 
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- Migrate dữ liệu từ session_date + start_time/end_time (nếu có)
UPDATE training_sessions 
SET 
  start_date = CASE 
    WHEN session_date IS NOT NULL AND start_time IS NOT NULL 
    THEN session_date + start_time
    ELSE session_date
  END,
  end_date = CASE 
    WHEN session_date IS NOT NULL AND end_time IS NOT NULL 
    THEN session_date + end_time
    ELSE session_date + INTERVAL '2 hours'
  END
WHERE start_date IS NULL OR end_date IS NULL;

-- Đặt NOT NULL và default
ALTER TABLE training_sessions 
ALTER COLUMN start_date SET DEFAULT NOW(),
ALTER COLUMN end_date SET DEFAULT NOW() + INTERVAL '2 hours';

-- Step 1.2: Thêm session_id vào training_enrollments
ALTER TABLE training_enrollments 
ADD COLUMN IF NOT EXISTS session_id UUID;

-- Thêm FK training_enrollments -> training_sessions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_enrollments_session'
  ) THEN
    ALTER TABLE training_enrollments
    ADD CONSTRAINT fk_enrollments_session 
    FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Thêm index
CREATE INDEX IF NOT EXISTS idx_enrollments_session ON training_enrollments(session_id);

-- Step 1.3: Rename training_competencies -> training_program_competencies
ALTER TABLE IF EXISTS training_competencies RENAME TO training_program_competencies;

-- Step 1.4: Tạo bảng employee_competencies MỚI (đúng logic)
CREATE TABLE IF NOT EXISTS employee_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  competency_code TEXT NOT NULL,
  competency_name TEXT NOT NULL,
  current_level INTEGER NOT NULL CHECK (current_level BETWEEN 1 AND 5),
  target_level INTEGER CHECK (target_level BETWEEN 1 AND 5),
  last_assessed_date DATE,
  assessed_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, competency_code)
);

-- Thêm indexes cho employee_competencies
CREATE INDEX IF NOT EXISTS idx_employee_competencies_employee ON employee_competencies(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_competencies_code ON employee_competencies(competency_code);

-- Thêm trigger updated_at
DROP TRIGGER IF EXISTS update_employee_competencies_updated_at ON employee_competencies;
CREATE TRIGGER update_employee_competencies_updated_at
  BEFORE UPDATE ON employee_competencies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS cho employee_competencies
ALTER TABLE employee_competencies ENABLE ROW LEVEL SECURITY;

-- RLS policies cho employee_competencies
DROP POLICY IF EXISTS "Users can view competencies with permission" ON employee_competencies;
CREATE POLICY "Users can view competencies with permission"
ON employee_competencies FOR SELECT
USING (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  )
);

DROP POLICY IF EXISTS "Employees can view own competencies" ON employee_competencies;
CREATE POLICY "Employees can view own competencies"
ON employee_competencies FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can manage competencies with permission" ON employee_competencies;
CREATE POLICY "Users can manage competencies with permission"
ON employee_competencies FOR ALL
USING (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'manage_training'
  )
);

-- Step 1.5: Thêm các FK constraints còn thiếu
DO $$ 
BEGIN
  -- FK training_sessions -> training_programs
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_sessions_program'
  ) THEN
    ALTER TABLE training_sessions
    ADD CONSTRAINT fk_sessions_program 
    FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE;
  END IF;

  -- FK training_enrollments -> training_programs
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_enrollments_program'
  ) THEN
    ALTER TABLE training_enrollments
    ADD CONSTRAINT fk_enrollments_program 
    FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE;
  END IF;

  -- FK training_enrollments -> employees
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_enrollments_employee'
  ) THEN
    ALTER TABLE training_enrollments
    ADD CONSTRAINT fk_enrollments_employee 
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;
  END IF;

  -- FK course_recommendations -> employees
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_recommendations_employee'
  ) THEN
    ALTER TABLE course_recommendations
    ADD CONSTRAINT fk_recommendations_employee 
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;
  END IF;

  -- FK course_recommendations -> training_programs
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_recommendations_program'
  ) THEN
    ALTER TABLE course_recommendations
    ADD CONSTRAINT fk_recommendations_program 
    FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Thêm indexes cho performance
CREATE INDEX IF NOT EXISTS idx_sessions_program ON training_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program ON training_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_employee ON training_enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_employee ON course_recommendations(employee_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_program ON course_recommendations(program_id);