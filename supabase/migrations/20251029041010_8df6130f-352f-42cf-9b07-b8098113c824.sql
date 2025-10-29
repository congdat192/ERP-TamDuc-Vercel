-- Update existing records to change company name
UPDATE employee_payrolls
SET company_name = 'Mắt Kính Tâm Đức'
WHERE company_name = 'Công ty TNHH ABC' OR company_name IS NULL;

-- Set default value for future records
ALTER TABLE employee_payrolls 
ALTER COLUMN company_name SET DEFAULT 'Mắt Kính Tâm Đức';