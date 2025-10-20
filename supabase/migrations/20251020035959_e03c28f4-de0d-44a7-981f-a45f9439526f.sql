-- Add all detailed payroll fields to employee_payrolls table
ALTER TABLE public.employee_payrolls
  -- A. Thông tin nhân viên (từ Excel)
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS responsibility_allowance numeric DEFAULT 0,
  
  -- B. Thông tin lương cơ bản
  ADD COLUMN IF NOT EXISTS salary_fulltime_probation numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS salary_fulltime_official numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS salary_parttime_official numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS salary_parttime_probation numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_meal_allowance numeric DEFAULT 0,
  
  -- C. Công thực tế chi tiết (Chính thức)
  ADD COLUMN IF NOT EXISTS ct_actual_days numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ct_holiday_days numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ct_regime_days numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ct_ot_sessions numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ct_ot_days numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ct_ot_hours numeric DEFAULT 0,
  
  -- D. Công thử việc
  ADD COLUMN IF NOT EXISTS tv_actual_days numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tv_holiday_days numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tv_regime_days numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tv_ot_sessions numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tv_ot_hours numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS parttime_days numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_leave_days numeric DEFAULT 0,
  
  -- E. Các khoản thưởng chi tiết
  ADD COLUMN IF NOT EXISTS bonus_invoice_bh_cs numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bonus_invoice_ktv numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bonus_performance numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS allowance_responsibility numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS allowance_meal numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS happy_birthday numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS allowance_parking numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS support_other_1 numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS support_other_2 numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS leave_settlement numeric DEFAULT 0,
  
  -- F. Các khoản trừ chi tiết
  ADD COLUMN IF NOT EXISTS deduction_social_insurance numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deduction_other numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS salary_advance numeric DEFAULT 0,
  
  -- G. Chi tiết thanh toán
  ADD COLUMN IF NOT EXISTS paid_advance numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_day_3 numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_day_15 numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_company_paid numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_surplus numeric DEFAULT 0;

-- Update payroll_invoice_commissions table
ALTER TABLE public.payroll_invoice_commissions
  ADD COLUMN IF NOT EXISTS commission_type text NOT NULL DEFAULT 'invoice_500k',
  ADD COLUMN IF NOT EXISTS commission_amount numeric DEFAULT 0;

-- Drop trigger and function (CASCADE to drop dependent trigger)
DROP FUNCTION IF EXISTS public.calculate_payroll_totals() CASCADE;

-- Add comments
COMMENT ON TABLE public.employee_payrolls IS 'Bảng lưu trữ phiếu lương chi tiết - dữ liệu import từ Excel (không tự động tính toán)';
COMMENT ON COLUMN public.employee_payrolls.total_salary IS 'Tổng lương - giá trị từ Excel (đã tính sẵn)';
COMMENT ON COLUMN public.employee_payrolls.total_income IS 'Tổng thu nhập - giá trị từ Excel (đã tính sẵn)';
COMMENT ON COLUMN public.employee_payrolls.net_payment IS 'Thực nhận - giá trị từ Excel (đã tính sẵn)';