-- ✅ Drop gender CHECK constraint to allow NULL and free-text values

-- Drop the restrictive CHECK constraint for gender
ALTER TABLE employees 
DROP CONSTRAINT IF EXISTS employees_gender_check;

-- Add documentation for gender field
COMMENT ON COLUMN employees.gender IS 
'Giới tính. Cho phép NULL. Giá trị khuyến nghị: Male, Female, Other';