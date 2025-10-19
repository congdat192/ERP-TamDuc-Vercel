-- ================================
-- PHASE 1: Fix Storage RLS for Employee Documents
-- ================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Employees can read own documents from storage" ON storage.objects;

-- Create new policy allowing read for both approved and pending documents
CREATE POLICY "Employees can read own documents from storage"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-documents' 
  AND (storage.foldername(name))[1] = 'documents'
  AND (
    -- Allow reading approved documents: documents/{employeeId}_...
    auth.uid() IN (
      SELECT user_id FROM employees 
      WHERE id::text = split_part((storage.foldername(name))[2], '_', 1)
    )
    OR
    -- Allow reading pending documents: documents/pending/{employeeId}_...
    (
      (storage.foldername(name))[2] = 'pending'
      AND auth.uid() IN (
        SELECT user_id FROM employees 
        WHERE id::text = split_part((storage.foldername(name))[3], '_', 1)
      )
    )
  )
);

-- ================================
-- PHASE 4: Allow Employees to View Admin Documents Related to Them
-- ================================

-- Update existing policy to allow employees to see their own documents
-- This policy already exists but we ensure it's there
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'administrative_documents' 
    AND policyname = 'Employees can view own admin documents'
  ) THEN
    CREATE POLICY "Employees can view own admin documents"
    ON administrative_documents FOR SELECT
    TO authenticated
    USING (
      employee_id IN (
        SELECT id FROM employees WHERE user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Also ensure company-wide published documents are visible
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'administrative_documents' 
    AND policyname = 'Authenticated users can view published company documents'
  ) THEN
    CREATE POLICY "Authenticated users can view published company documents"
    ON administrative_documents FOR SELECT
    TO authenticated
    USING (
      employee_id IS NULL 
      AND status = 'published'
    );
  END IF;
END $$;

-- ================================
-- PHASE 4: Allow Employees to View Benefit Assignments
-- ================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hr_benefit_assignments' 
    AND policyname = 'Employees can view own benefit assignments'
  ) THEN
    CREATE POLICY "Employees can view own benefit assignments"
    ON hr_benefit_assignments FOR SELECT
    TO authenticated
    USING (
      employee_id IN (
        SELECT id FROM employees WHERE user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- ================================
-- PHASE 4: Allow Employees to View Rewards Related to Them
-- ================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hr_rewards' 
    AND policyname = 'Employees can view own rewards'
  ) THEN
    CREATE POLICY "Employees can view own rewards"
    ON hr_rewards FOR SELECT
    TO authenticated
    USING (
      employee_id IN (
        SELECT id FROM employees WHERE user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- ================================
-- PHASE 4: Allow Employees to View Discipline Records
-- ================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hr_discipline_records' 
    AND policyname = 'Employees can view own discipline records'
  ) THEN
    CREATE POLICY "Employees can view own discipline records"
    ON hr_discipline_records FOR SELECT
    TO authenticated
    USING (
      employee_id IN (
        SELECT id FROM employees WHERE user_id = auth.uid()
      )
    );
  END IF;
END $$;