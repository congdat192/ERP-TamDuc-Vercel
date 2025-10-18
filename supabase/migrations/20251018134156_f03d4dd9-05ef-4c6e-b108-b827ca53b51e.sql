-- Drop old SELECT policy that prevents viewing deleted employees
DROP POLICY IF EXISTS "Users can view employees if they have permission" ON employees;

-- Policy 1: Users can view active employees (not deleted)
CREATE POLICY "Users can view active employees"
ON employees FOR SELECT
USING (
  deleted_at IS NULL
  AND (
    (EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN features f ON f.id = rp.feature_id
      WHERE ur.user_id = auth.uid()
        AND f.code = 'view_employees'
    ))
    OR is_admin(auth.uid())
  )
);

-- Policy 2: Only admins can view deleted employees
CREATE POLICY "Admins can view deleted employees"
ON employees FOR SELECT
USING (
  deleted_at IS NOT NULL
  AND is_admin(auth.uid())
);