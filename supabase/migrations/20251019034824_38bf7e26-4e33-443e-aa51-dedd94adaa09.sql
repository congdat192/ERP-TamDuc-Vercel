-- ============================================
-- PHASE 1: DATABASE CHANGES FOR OTP LOGIN
-- ============================================

-- 1. Add user_id column to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);

-- Create unique index on email (if not exists)
CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_email_lower ON employees(LOWER(email));

-- Add comment
COMMENT ON COLUMN employees.user_id IS 'Link to auth.users.id - enables employee self-service login via OTP';

-- ============================================
-- 2. Create otp_rate_limit table (anti-spam)
-- ============================================
CREATE TABLE IF NOT EXISTS otp_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  attempt_count integer DEFAULT 1,
  first_attempt_at timestamptz DEFAULT now(),
  last_attempt_at timestamptz DEFAULT now(),
  blocked_until timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Unique constraint to ensure 1 email = 1 record in window
CREATE UNIQUE INDEX IF NOT EXISTS idx_otp_rate_limit_email ON otp_rate_limit(LOWER(email));

-- Enable RLS
ALTER TABLE otp_rate_limit ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view rate limit data (for debugging)
DROP POLICY IF EXISTS "Only admins can view rate limits" ON otp_rate_limit;
CREATE POLICY "Only admins can view rate limits"
ON otp_rate_limit FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- ============================================
-- 3. Function: Auto-link employee to user by email
-- ============================================
CREATE OR REPLACE FUNCTION auto_link_employee_to_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Find employee with matching email and link them
  UPDATE employees
  SET user_id = NEW.id
  WHERE LOWER(email) = LOWER(NEW.email)
  AND user_id IS NULL
  AND deleted_at IS NULL;
  
  RAISE NOTICE 'Auto-linked user % to employee with email %', NEW.id, NEW.email;
  
  RETURN NEW;
END;
$$;

-- ============================================
-- 4. Trigger: Run after user creation
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created_link_employee ON auth.users;
CREATE TRIGGER on_auth_user_created_link_employee
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auto_link_employee_to_user();

-- ============================================
-- 5. RLS Policy: Employees can view own profile
-- ============================================
DROP POLICY IF EXISTS "Employees can view own profile" ON employees;
CREATE POLICY "Employees can view own profile"
ON employees FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR is_admin(auth.uid())
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
    AND f.code = 'view_employees'
  )
);

-- ============================================
-- 6. Migration Script: Link existing users
-- ============================================
-- Link existing auth.users to employees by email
DO $$
DECLARE
  auth_user RECORD;
  matched_employee RECORD;
  link_count INTEGER := 0;
BEGIN
  -- Loop through all auth.users
  FOR auth_user IN 
    SELECT id, email FROM auth.users WHERE email IS NOT NULL
  LOOP
    -- Find matching employee
    SELECT id, email, user_id INTO matched_employee
    FROM employees
    WHERE LOWER(email) = LOWER(auth_user.email)
    AND user_id IS NULL
    AND deleted_at IS NULL
    LIMIT 1;
    
    -- Link if found
    IF matched_employee.id IS NOT NULL THEN
      UPDATE employees
      SET user_id = auth_user.id
      WHERE id = matched_employee.id;
      
      link_count := link_count + 1;
      RAISE NOTICE 'Linked user % to employee %', auth_user.email, matched_employee.id;
    END IF;
  END LOOP;
  
  RAISE NOTICE '✅ Total linked: % employees', link_count;
END $$;