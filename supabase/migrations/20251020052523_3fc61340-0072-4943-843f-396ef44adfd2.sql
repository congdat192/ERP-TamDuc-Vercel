-- Add is_employee_only column to employees table
ALTER TABLE employees 
ADD COLUMN is_employee_only BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN employees.is_employee_only IS 'TRUE = Chỉ truy cập ESS (Employee Self-Service), FALSE = Có quyền truy cập ERP';

-- Update existing employees: Mark all current employees with user_id as employee-only
-- (Admin can later update this for users who need ERP access)
UPDATE employees 
SET is_employee_only = TRUE
WHERE user_id IS NOT NULL;

-- Add index for performance optimization
CREATE INDEX idx_employees_user_id_employee_only ON employees(user_id, is_employee_only) WHERE user_id IS NOT NULL;