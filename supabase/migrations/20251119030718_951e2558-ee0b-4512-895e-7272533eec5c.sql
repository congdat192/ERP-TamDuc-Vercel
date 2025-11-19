-- Enable RLS on supplier_catalogs table
ALTER TABLE supplier_catalogs ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all catalogs
CREATE POLICY "Admins can manage supplier catalogs" ON supplier_catalogs
FOR ALL USING (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
    AND f.code = 'manage_lens_admin'
  )
);

-- Allow anyone to view active catalogs
CREATE POLICY "Anyone can view active supplier catalogs" ON supplier_catalogs
FOR SELECT USING (is_active = true);