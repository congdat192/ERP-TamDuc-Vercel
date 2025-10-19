-- ✅ STEP 1 & 2: Remove strict CHECK constraint and allow NULL for emergency_contact_relationship

-- Drop the restrictive CHECK constraint
ALTER TABLE employees 
DROP CONSTRAINT IF EXISTS employees_emergency_contact_relationship_check;

-- Allow NULL values
ALTER TABLE employees 
ALTER COLUMN emergency_contact_relationship DROP NOT NULL;

-- Add documentation comment
COMMENT ON COLUMN employees.emergency_contact_relationship IS 
'Quan hệ với người liên hệ khẩn cấp. Cho phép NULL và nhập tự do (ví dụ: Cha, Mẹ, Vợ, Chồng, Người yêu, Bạn trai, Con, Bạn, etc.)';