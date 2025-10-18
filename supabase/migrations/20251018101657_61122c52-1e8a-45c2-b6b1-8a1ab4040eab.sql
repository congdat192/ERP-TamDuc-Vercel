-- Fix security warnings: Set search_path for functions

DROP FUNCTION IF EXISTS public.calculate_seniority_months() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_total_fixed_salary() CASCADE;

-- Function to calculate seniority_months (with search_path)
CREATE OR REPLACE FUNCTION public.calculate_seniority_months()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.seniority_months := EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.join_date)) * 12 
                        + EXTRACT(MONTH FROM AGE(CURRENT_DATE, NEW.join_date));
  RETURN NEW;
END;
$$;

-- Function to calculate total_fixed_salary (with search_path)
CREATE OR REPLACE FUNCTION public.calculate_total_fixed_salary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.total_fixed_salary := COALESCE(NEW.salary_p1, 0) 
                          + COALESCE(NEW.allowance_meal, 0)
                          + COALESCE(NEW.allowance_fuel, 0)
                          + COALESCE(NEW.allowance_phone, 0)
                          + COALESCE(NEW.allowance_other, 0);
  RETURN NEW;
END;
$$;

-- Re-create triggers
CREATE TRIGGER trg_calculate_seniority
  BEFORE INSERT OR UPDATE OF join_date
  ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_seniority_months();

CREATE TRIGGER trg_calculate_total_salary
  BEFORE INSERT OR UPDATE OF salary_p1, allowance_meal, allowance_fuel, allowance_phone, allowance_other
  ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_total_fixed_salary();