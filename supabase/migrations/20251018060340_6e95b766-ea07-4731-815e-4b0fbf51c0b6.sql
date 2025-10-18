-- Phase 1: Add RLS policies for admins to update and delete profiles

-- Policy: Admins can update any profile (status, etc.)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND LOWER(r.name) IN ('owner', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND LOWER(r.name) IN ('owner', 'admin')
  )
);

-- Policy: Admins can delete profiles (except themselves)
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND LOWER(r.name) IN ('owner', 'admin')
  )
  AND id != auth.uid()  -- Prevent self-deletion
);

-- Phase 2: Backfill missing roles for users without role assignments
INSERT INTO user_roles (user_id, role_id)
SELECT 
  p.id,
  (SELECT id FROM roles WHERE LOWER(name) = 'user' LIMIT 1)
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = p.id
)
AND EXISTS (SELECT 1 FROM roles WHERE LOWER(name) = 'user');