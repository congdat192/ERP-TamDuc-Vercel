-- ============================================
-- PHASE 1: RLS Policies for Employee Self-Service
-- ============================================

-- 1. Employees can update own avatar
CREATE POLICY "Employees can update own avatar"
ON employees FOR UPDATE
USING (user_id = auth.uid() AND deleted_at IS NULL)
WITH CHECK (user_id = auth.uid() AND deleted_at IS NULL);

-- 2. Employees can view own documents
CREATE POLICY "Employees can view own documents"
ON employee_documents FOR SELECT
USING (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);

-- 3. Employees can upload own documents
CREATE POLICY "Employees can upload own documents"
ON employee_documents FOR INSERT
WITH CHECK (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);

-- 4. Employees can delete own documents
CREATE POLICY "Employees can delete own documents"
ON employee_documents FOR DELETE
USING (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);