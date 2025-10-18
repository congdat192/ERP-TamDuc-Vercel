-- ============================================
-- STORAGE RLS POLICIES FOR employee-documents BUCKET
-- ============================================

-- 1. Policy: Authenticated users with edit_employees permission can upload documents
CREATE POLICY "Users with edit permission can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'employee-documents' AND
  (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN features f ON f.id = rp.feature_id
      WHERE ur.user_id = auth.uid() 
        AND f.code = 'edit_employees'
    ) OR is_admin(auth.uid())
  )
);

-- 2. Policy: Users with view_employees permission can download documents
CREATE POLICY "Users with view permission can download documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN features f ON f.id = rp.feature_id
      WHERE ur.user_id = auth.uid() 
        AND f.code = 'view_employees'
    ) OR is_admin(auth.uid())
  )
);

-- 3. Policy: Admins can delete documents
CREATE POLICY "Admins can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  is_admin(auth.uid())
);

-- 4. Policy: Users with edit permission can update document metadata
CREATE POLICY "Users with edit permission can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN features f ON f.id = rp.feature_id
      WHERE ur.user_id = auth.uid() 
        AND f.code = 'edit_employees'
    ) OR is_admin(auth.uid())
  )
);