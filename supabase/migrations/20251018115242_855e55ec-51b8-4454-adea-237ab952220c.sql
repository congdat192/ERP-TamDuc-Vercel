-- Grant admin_documents permissions to HR Manager role
-- Purpose: Allow HR Manager to access Administration module

-- Verify and grant 4 admin_documents permissions to HR Manager
DO $$
DECLARE
  hr_manager_role_id INTEGER;
  feature_count INTEGER;
BEGIN
  -- Get HR Manager role ID
  SELECT id INTO hr_manager_role_id 
  FROM roles 
  WHERE name = 'HR Manager';
  
  IF hr_manager_role_id IS NULL THEN
    RAISE EXCEPTION 'HR Manager role not found in roles table';
  END IF;
  
  -- Grant 4 admin_documents permissions
  INSERT INTO role_permissions (role_id, feature_id)
  SELECT 
    hr_manager_role_id,
    f.id
  FROM features f
  WHERE f.code IN (
    'view_admin_documents',
    'create_admin_documents',
    'approve_admin_documents',
    'delete_admin_documents'
  )
  ON CONFLICT DO NOTHING;
  
  -- Verify permissions were granted
  SELECT COUNT(*) INTO feature_count
  FROM role_permissions rp
  JOIN features f ON f.id = rp.feature_id
  WHERE rp.role_id = hr_manager_role_id
    AND f.code LIKE '%admin_documents%';
  
  IF feature_count < 4 THEN
    RAISE WARNING 'Only % admin_documents permissions granted to HR Manager (expected 4)', feature_count;
  ELSE
    RAISE NOTICE 'Successfully granted 4 admin_documents permissions to HR Manager role';
  END IF;
END $$;