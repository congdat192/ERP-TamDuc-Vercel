-- Phase 1: Create triggers for auto-computation

-- Function to calculate seniority_months
CREATE OR REPLACE FUNCTION public.calculate_seniority_months()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.seniority_months := EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.join_date)) * 12 
                        + EXTRACT(MONTH FROM AGE(CURRENT_DATE, NEW.join_date));
  RETURN NEW;
END;
$$;

-- Function to calculate total_fixed_salary
CREATE OR REPLACE FUNCTION public.calculate_total_fixed_salary()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Trigger for seniority_months (BEFORE INSERT OR UPDATE)
CREATE TRIGGER trg_calculate_seniority
  BEFORE INSERT OR UPDATE OF join_date
  ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_seniority_months();

-- Trigger for total_fixed_salary (BEFORE INSERT OR UPDATE)
CREATE TRIGGER trg_calculate_total_salary
  BEFORE INSERT OR UPDATE OF salary_p1, allowance_meal, allowance_fuel, allowance_phone, allowance_other
  ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_total_fixed_salary();