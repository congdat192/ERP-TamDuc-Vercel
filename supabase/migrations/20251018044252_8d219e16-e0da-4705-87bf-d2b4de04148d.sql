-- Fix infinite recursion in roles table RLS policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;
DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;

-- Create simple policy: Allow all authenticated users to view roles
-- This is safe because roles table only contains role definitions
CREATE POLICY "Authenticated users can view roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

-- Fix infinite recursion in role_permissions table if needed
DROP POLICY IF EXISTS "Admins can manage role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Authenticated users can view role permissions" ON public.role_permissions;

-- Allow authenticated users to view role permissions
CREATE POLICY "Authenticated users can view role permissions"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);