-- Add gender column
ALTER TABLE employees 
ADD COLUMN gender text CHECK (gender IN ('Male', 'Female', 'Other'));

-- Add birth_date column
ALTER TABLE employees 
ADD COLUMN birth_date date;

-- Add salary columns for different employment types
ALTER TABLE employees 
ADD COLUMN salary_fulltime_probation numeric DEFAULT 0,
ADD COLUMN salary_fulltime_official numeric DEFAULT 0,
ADD COLUMN salary_parttime_probation numeric DEFAULT 0,
ADD COLUMN salary_parttime_official numeric DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN employees.gender IS 'Giới tính: Male, Female, Other';
COMMENT ON COLUMN employees.birth_date IS 'Ngày sinh nhật';
COMMENT ON COLUMN employees.salary_fulltime_probation IS 'Lương Full-time thử việc (VNĐ)';
COMMENT ON COLUMN employees.salary_fulltime_official IS 'Lương Full-time chính thức (VNĐ)';
COMMENT ON COLUMN employees.salary_parttime_probation IS 'Lương Part-time thử việc (VNĐ)';
COMMENT ON COLUMN employees.salary_parttime_official IS 'Lương Part-time chính thức (VNĐ)';