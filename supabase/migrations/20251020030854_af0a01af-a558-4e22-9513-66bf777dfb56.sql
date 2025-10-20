-- Create employee_payrolls table
CREATE TABLE public.employee_payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- Tháng/năm của phiếu lương (YYYY-MM-01)
  company_name TEXT NOT NULL,
  employee_code TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  
  -- Phần Lương (1)
  total_salary NUMERIC(15,2) DEFAULT 0,
  salary_fulltime_ct NUMERIC(15,2) DEFAULT 0,
  standard_days NUMERIC(5,2) DEFAULT 26,
  actual_days NUMERIC(5,2) DEFAULT 0,
  actual_salary NUMERIC(15,2) DEFAULT 0,
  ot_days NUMERIC(5,2) DEFAULT 0,
  ot_amount NUMERIC(15,2) DEFAULT 0,
  
  -- Phần Thưởng (2)
  total_bonus NUMERIC(15,2) DEFAULT 0,
  invoice_bonus NUMERIC(15,2) DEFAULT 0,
  
  -- Tổng Hợp
  total_income NUMERIC(15,2) DEFAULT 0, -- A. Tổng thu nhập (1) + (2)
  total_deductions NUMERIC(15,2) DEFAULT 0, -- B. Các khoản trừ
  net_payment NUMERIC(15,2) DEFAULT 0, -- C. Thực nhận (A - B)
  
  -- Metadata
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'locked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  issued_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(employee_id, month)
);

-- Create payroll_invoice_commissions table (Chi tiết hoa hồng hóa đơn)
CREATE TABLE public.payroll_invoice_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID NOT NULL REFERENCES public.employee_payrolls(id) ON DELETE CASCADE,
  invoice_level TEXT NOT NULL, -- Mức hóa đơn
  quantity INTEGER DEFAULT 0, -- SL
  return_value TEXT, -- Đơn hoàn
  return_quantity INTEGER DEFAULT 0, -- SL Hoàn
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_employee_payrolls_employee_id ON public.employee_payrolls(employee_id);
CREATE INDEX idx_employee_payrolls_month ON public.employee_payrolls(month);
CREATE INDEX idx_payroll_invoice_commissions_payroll_id ON public.payroll_invoice_commissions(payroll_id);

-- Enable RLS
ALTER TABLE public.employee_payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_invoice_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employee_payrolls

-- Employees can view their own issued/locked payrolls
CREATE POLICY "Employees can view own issued payrolls"
ON public.employee_payrolls
FOR SELECT
USING (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
  AND status IN ('issued', 'locked')
);

-- Admins can view all payrolls
CREATE POLICY "Admins can view all payrolls"
ON public.employee_payrolls
FOR SELECT
USING (is_admin(auth.uid()));

-- Users with permission can manage payrolls
CREATE POLICY "Users can create payrolls if they have permission"
ON public.employee_payrolls
FOR INSERT
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
    AND f.code = 'manage_payroll'
  )
);

CREATE POLICY "Users can update payrolls if they have permission"
ON public.employee_payrolls
FOR UPDATE
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
    AND f.code = 'manage_payroll'
  )
);

CREATE POLICY "Users can delete payrolls if they have permission"
ON public.employee_payrolls
FOR DELETE
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
    AND f.code = 'manage_payroll'
  )
);

-- RLS Policies for payroll_invoice_commissions

-- Users can view commissions if they can view the parent payroll
CREATE POLICY "Users can view commissions of accessible payrolls"
ON public.payroll_invoice_commissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM employee_payrolls ep
    WHERE ep.id = payroll_id
    AND (
      is_admin(auth.uid()) OR
      (ep.employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()) AND ep.status IN ('issued', 'locked'))
    )
  )
);

-- Users with permission can manage commissions
CREATE POLICY "Users can manage commissions if they have permission"
ON public.payroll_invoice_commissions
FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
    AND f.code = 'manage_payroll'
  )
);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_employee_payrolls_updated_at
BEFORE UPDATE ON public.employee_payrolls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-calculate payroll totals
CREATE OR REPLACE FUNCTION public.calculate_payroll_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Calculate actual_salary if not provided
  IF NEW.actual_salary = 0 AND NEW.salary_fulltime_ct > 0 AND NEW.standard_days > 0 THEN
    NEW.actual_salary := (NEW.salary_fulltime_ct / NEW.standard_days) * NEW.actual_days;
  END IF;
  
  -- Calculate total_salary
  NEW.total_salary := COALESCE(NEW.actual_salary, 0) + COALESCE(NEW.ot_amount, 0);
  
  -- Calculate total_income
  NEW.total_income := COALESCE(NEW.total_salary, 0) + COALESCE(NEW.total_bonus, 0);
  
  -- Calculate net_payment
  NEW.net_payment := COALESCE(NEW.total_income, 0) - COALESCE(NEW.total_deductions, 0);
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-calculate totals
CREATE TRIGGER calculate_payroll_totals_trigger
BEFORE INSERT OR UPDATE ON public.employee_payrolls
FOR EACH ROW
EXECUTE FUNCTION public.calculate_payroll_totals();