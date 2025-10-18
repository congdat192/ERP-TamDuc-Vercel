-- Create enum types for HR module
CREATE TYPE contract_type AS ENUM ('Chính Thức', 'Thử Việc', 'Hợp Đồng');
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'probation', 'terminated');

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_path TEXT,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  join_date DATE NOT NULL,
  contract_type contract_type DEFAULT 'Thử Việc',
  status employee_status DEFAULT 'probation',
  
  -- Salary structure (P1: base, P2: multiplier, P3: allowance)
  salary_p1 NUMERIC(15, 2) DEFAULT 0,
  salary_p2 NUMERIC(5, 2) DEFAULT 1.0,
  salary_p3 NUMERIC(15, 2) DEFAULT 0,
  
  -- Performance tracking
  kpi_score NUMERIC(5, 2) DEFAULT 0,
  last_review_date DATE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for performance
CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table

-- 1. View employees: Users with 'view_employees' permission
CREATE POLICY "Users can view employees if they have permission"
ON employees FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'view_employees'
  )
  OR is_admin(auth.uid())
);

-- 2. Create employees: Users with 'create_employees' permission
CREATE POLICY "Users can create employees if they have permission"
ON employees FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'create_employees'
  )
  OR is_admin(auth.uid())
);

-- 3. Update employees: Users with 'edit_employees' permission
CREATE POLICY "Users can update employees if they have permission"
ON employees FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'edit_employees'
  )
  OR is_admin(auth.uid())
);

-- 4. Delete employees: Users with 'delete_employees' permission
CREATE POLICY "Users can delete employees if they have permission"
ON employees FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'delete_employees'
  )
  OR is_admin(auth.uid())
);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample employees data
INSERT INTO employees (
  employee_code, full_name, email, phone, position, department, 
  join_date, contract_type, status, 
  salary_p1, salary_p2, salary_p3, kpi_score, last_review_date
) VALUES
  ('NV001', 'Nguyễn Văn An', 'an.nguyen@tamduc.vn', '0901234567', 'Sales Manager', 'Sales', 
   '2023-01-15', 'Chính Thức', 'active', 
   15000000, 1.5, 3000000, 85, '2024-01-01'),
  ('NV002', 'Trần Thị Bình', 'binh.tran@tamduc.vn', '0902345678', 'HR Specialist', 'HR', 
   '2023-03-20', 'Chính Thức', 'active', 
   12000000, 1.3, 2000000, 90, '2024-01-01'),
  ('NV003', 'Lê Minh Châu', 'chau.le@tamduc.vn', '0903456789', 'Sales Staff', 'Sales', 
   '2023-06-10', 'Thử Việc', 'probation', 
   8000000, 1.0, 1000000, 75, '2024-01-01');