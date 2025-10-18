-- PHASE 1: Fix Foreign Key Constraints & Add Backup Columns

-- 1.1. Remove duplicate foreign key constraint
ALTER TABLE administrative_documents 
  DROP CONSTRAINT IF EXISTS administrative_documents_employee_id_fkey;

-- 1.2. Add backup columns for employee_documents
ALTER TABLE employee_documents 
  ADD COLUMN IF NOT EXISTS deleted_employee_name TEXT,
  ADD COLUMN IF NOT EXISTS deleted_employee_code TEXT;

-- 1.3. Add backup columns for monthly_attendance
ALTER TABLE monthly_attendance 
  ADD COLUMN IF NOT EXISTS deleted_employee_name TEXT,
  ADD COLUMN IF NOT EXISTS deleted_employee_code TEXT;

-- 1.4. Change CASCADE DELETE to SET NULL for employee_documents
ALTER TABLE employee_documents 
  DROP CONSTRAINT IF EXISTS employee_documents_employee_id_fkey;

ALTER TABLE employee_documents 
  ADD CONSTRAINT employee_documents_employee_id_fkey 
  FOREIGN KEY (employee_id) 
  REFERENCES employees(id) 
  ON DELETE SET NULL;

-- 1.5. Change CASCADE DELETE to SET NULL for monthly_attendance
ALTER TABLE monthly_attendance 
  DROP CONSTRAINT IF EXISTS monthly_attendance_employee_id_fkey;

ALTER TABLE monthly_attendance 
  ADD CONSTRAINT monthly_attendance_employee_id_fkey 
  FOREIGN KEY (employee_id) 
  REFERENCES employees(id) 
  ON DELETE SET NULL;

-- 1.6. Create function to backup employee info before delete
CREATE OR REPLACE FUNCTION public.backup_employee_info_before_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Backup to employee_documents
  UPDATE employee_documents
  SET 
    deleted_employee_name = OLD.full_name,
    deleted_employee_code = OLD.employee_code
  WHERE employee_id = OLD.id;
  
  -- Backup to monthly_attendance
  UPDATE monthly_attendance
  SET 
    deleted_employee_name = OLD.full_name,
    deleted_employee_code = OLD.employee_code
  WHERE employee_id = OLD.id;
  
  -- Log for tracking
  RAISE NOTICE 'Employee deleted: % (%), admin_docs: %, employee_docs: %, attendance: %',
    OLD.full_name, 
    OLD.employee_code,
    (SELECT COUNT(*) FROM administrative_documents WHERE employee_id = OLD.id),
    (SELECT COUNT(*) FROM employee_documents WHERE employee_id = OLD.id),
    (SELECT COUNT(*) FROM monthly_attendance WHERE employee_id = OLD.id);
  
  RETURN OLD;
END;
$$;

-- 1.7. Attach trigger to employees table
DROP TRIGGER IF EXISTS backup_employee_info_trigger ON employees;
CREATE TRIGGER backup_employee_info_trigger
  BEFORE DELETE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION public.backup_employee_info_before_delete();

-- PHASE 4: Soft Delete Implementation

-- 4.1. Add soft delete columns to employees
ALTER TABLE employees 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- 4.2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_employees_deleted_at ON employees(deleted_at);

-- 4.3. Update RLS policies to respect soft delete
DROP POLICY IF EXISTS "Users can view employees if they have permission" ON employees;
CREATE POLICY "Users can view employees if they have permission" 
ON employees FOR SELECT
USING (
  deleted_at IS NULL AND (
    (EXISTS ( 
      SELECT 1
      FROM ((user_roles ur
        JOIN role_permissions rp ON ((rp.role_id = ur.role_id)))
        JOIN features f ON ((f.id = rp.feature_id)))
      WHERE ((ur.user_id = auth.uid()) AND (f.code = 'view_employees'::text))
    )) OR is_admin(auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can update employees if they have permission" ON employees;
CREATE POLICY "Users can update employees if they have permission"
ON employees FOR UPDATE
USING (
  deleted_at IS NULL AND (
    (EXISTS ( 
      SELECT 1
      FROM ((user_roles ur
        JOIN role_permissions rp ON ((rp.role_id = ur.role_id)))
        JOIN features f ON ((f.id = rp.feature_id)))
      WHERE ((ur.user_id = auth.uid()) AND (f.code = 'edit_employees'::text))
    )) OR is_admin(auth.uid())
  )
);