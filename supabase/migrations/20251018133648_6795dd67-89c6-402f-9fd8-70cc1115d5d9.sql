-- Drop old UPDATE policy that blocks soft delete
DROP POLICY IF EXISTS "Users can update employees if they have permission" ON employees;

-- Create new UPDATE policy without deleted_at check
-- This allows soft delete (setting deleted_at) and restore operations
CREATE POLICY "Users can update employees if they have permission"
ON employees FOR UPDATE
USING (
  (EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'edit_employees'
  ))
  OR is_admin(auth.uid())
);