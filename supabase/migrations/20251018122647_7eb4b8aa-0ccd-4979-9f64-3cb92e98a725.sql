-- ============================================
-- PHASE 1: DATABASE INTEGRITY
-- Kết nối Administration ↔ HRIS Modules
-- ============================================

-- Step 1: Add Foreign Key Constraint với ON DELETE SET NULL
-- Khi xóa employee → employee_id = NULL (giữ văn bản)
ALTER TABLE administrative_documents
ADD CONSTRAINT fk_administrative_documents_employee
FOREIGN KEY (employee_id)
REFERENCES employees(id)
ON DELETE SET NULL;

-- Step 2: Add Index cho performance query by employee_id
CREATE INDEX IF NOT EXISTS idx_admin_docs_employee_id 
ON administrative_documents(employee_id)
WHERE employee_id IS NOT NULL;

-- Step 3: Add comment để document constraint
COMMENT ON CONSTRAINT fk_administrative_documents_employee ON administrative_documents IS 
'Khi xóa nhân viên, employee_id sẽ được set NULL (giữ văn bản cho lưu trữ)';

-- Step 4: Verify và fix orphaned data (nếu có)
UPDATE administrative_documents
SET employee_id = NULL
WHERE employee_id IS NOT NULL 
  AND employee_id NOT IN (SELECT id FROM employees);