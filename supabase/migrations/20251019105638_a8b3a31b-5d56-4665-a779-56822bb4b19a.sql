-- Phase 1: Fix Storage RLS for Document Downloads
-- Drop old restrictive policy
DROP POLICY IF EXISTS "Employees can read own documents from storage" ON storage.objects;

-- Create flexible policy that works with any file path format
CREATE POLICY "Employees can read own documents from storage"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-documents' 
  AND (
    -- Allow if file path contains employee_id anywhere
    auth.uid() IN (
      SELECT user_id FROM employees 
      WHERE name LIKE '%' || id::text || '%'
        AND deleted_at IS NULL
    )
    OR
    -- Admins can read all documents
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
        AND LOWER(r.name) IN ('owner', 'admin')
    )
  )
);