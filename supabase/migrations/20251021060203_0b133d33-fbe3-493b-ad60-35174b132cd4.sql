-- ============================================
-- PHASE 1: FIX TRAINING MODULE SCHEMA
-- ============================================

-- ============================================
-- Part 1: Standardize training_sessions
-- ============================================

-- Add missing columns (non-destructive)
ALTER TABLE training_sessions 
ADD COLUMN IF NOT EXISTS location_type TEXT CHECK (location_type IN ('offline', 'online', 'hybrid')),
ADD COLUMN IF NOT EXISTS meeting_url TEXT,
ADD COLUMN IF NOT EXISTS max_participants INTEGER,
ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0;

-- Ensure start_date and end_date exist and are NOT NULL
ALTER TABLE training_sessions
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN end_date SET NOT NULL;

-- ============================================
-- Part 2: Fix training_enrollments
-- ============================================

-- Rename enrollment_date to enrolled_date if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'training_enrollments' 
    AND column_name = 'enrollment_date'
  ) THEN
    ALTER TABLE training_enrollments 
    RENAME COLUMN enrollment_date TO enrolled_date;
  END IF;
END $$;

-- Add missing columns
ALTER TABLE training_enrollments
ADD COLUMN IF NOT EXISTS enrollment_type TEXT CHECK (enrollment_type IN ('mandatory', 'optional', 'self_registered')) DEFAULT 'optional',
ADD COLUMN IF NOT EXISTS pre_test_score NUMERIC,
ADD COLUMN IF NOT EXISTS post_test_score NUMERIC,
ADD COLUMN IF NOT EXISTS trainer_remarks TEXT;

-- Ensure session_id is NOT NULL
ALTER TABLE training_enrollments
ALTER COLUMN session_id SET NOT NULL;

-- ============================================
-- Part 3: Add Foreign Keys and Indexes
-- ============================================

-- FK cho training_sessions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_sessions_program'
  ) THEN
    ALTER TABLE training_sessions
    ADD CONSTRAINT fk_sessions_program 
      FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_sessions_trainer'
  ) THEN
    ALTER TABLE training_sessions
    ADD CONSTRAINT fk_sessions_trainer 
      FOREIGN KEY (trainer_id) REFERENCES training_trainers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- FK cho training_enrollments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_enrollments_session'
  ) THEN
    ALTER TABLE training_enrollments
    ADD CONSTRAINT fk_enrollments_session 
      FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_enrollments_program'
  ) THEN
    ALTER TABLE training_enrollments
    ADD CONSTRAINT fk_enrollments_program 
      FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_enrollments_employee'
  ) THEN
    ALTER TABLE training_enrollments
    ADD CONSTRAINT fk_enrollments_employee 
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;
  END IF;
END $$;

-- FK cho employee_competencies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_competencies_employee'
  ) THEN
    ALTER TABLE employee_competencies
    ADD CONSTRAINT fk_competencies_employee 
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_competencies_assessor'
  ) THEN
    ALTER TABLE employee_competencies
    ADD CONSTRAINT fk_competencies_assessor 
      FOREIGN KEY (assessed_by) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_program ON training_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_sessions_trainer ON training_sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_date ON training_sessions(start_date);
CREATE INDEX IF NOT EXISTS idx_enrollments_session ON training_enrollments(session_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_employee ON training_enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program ON training_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_competencies_employee ON employee_competencies(employee_id);

-- ============================================
-- Part 4: Verify RLS Policies
-- ============================================

-- Enable RLS on all training tables
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_competencies ENABLE ROW LEVEL SECURITY;

-- RLS for training_sessions
DROP POLICY IF EXISTS "Admins can manage sessions" ON training_sessions;
CREATE POLICY "Admins can manage sessions" ON training_sessions
FOR ALL USING (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
    AND f.code IN ('manage_training', 'view_training')
  )
);

-- RLS for training_enrollments
DROP POLICY IF EXISTS "Users can manage enrollments" ON training_enrollments;
CREATE POLICY "Users can manage enrollments" ON training_enrollments
FOR ALL USING (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
    AND f.code IN ('manage_training', 'view_training')
  ) OR
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- RLS for employee_competencies (already done in previous migration)
DROP POLICY IF EXISTS "Employees can view own competencies" ON employee_competencies;
CREATE POLICY "Employees can view own competencies" ON employee_competencies
FOR SELECT USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can manage competencies with permission" ON employee_competencies;
CREATE POLICY "Users can manage competencies with permission" ON employee_competencies
FOR ALL USING (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
    AND f.code = 'manage_training'
  )
);