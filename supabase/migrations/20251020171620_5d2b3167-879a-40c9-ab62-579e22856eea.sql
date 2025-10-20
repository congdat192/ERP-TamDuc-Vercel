-- Add view_payroll feature for future payroll calculation module
INSERT INTO features (module_id, code, name, description, feature_type)
VALUES 
  (6, 'view_payroll', 'Xem tính lương', 'Truy cập module tính lương tự động (3P)', 'view')
ON CONFLICT (code) DO NOTHING;

-- Grant view_payroll to Admin roles (level 1-2)
INSERT INTO role_permissions (role_id, feature_id)
SELECT r.id, f.id
FROM roles r
CROSS JOIN features f
WHERE r.level <= 2 
  AND f.code = 'view_payroll'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.feature_id = f.id
  );