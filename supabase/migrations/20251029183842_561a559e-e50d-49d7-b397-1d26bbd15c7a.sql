-- Clean old data
DELETE FROM kiotviet_categories;

-- Update RLS policy to allow users with manage_kiotviet permission to delete
DROP POLICY IF EXISTS "Users can delete categories with permission" ON kiotviet_categories;

CREATE POLICY "Users can delete categories with permission" 
ON kiotviet_categories 
FOR DELETE 
USING (
  is_admin(auth.uid()) OR 
  (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
    AND f.code = 'manage_kiotviet'
  ))
);