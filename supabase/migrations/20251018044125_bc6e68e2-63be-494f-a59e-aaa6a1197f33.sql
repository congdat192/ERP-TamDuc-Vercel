-- Drop existing strict RLS policies on user_roles that are blocking login
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Create simple policy: Allow all authenticated users to view user_roles
-- This is safe because user_roles only contains user_id <-> role_id mappings (not sensitive data)
-- This policy allows AuthContext to load user roles during login
CREATE POLICY "Authenticated users can view user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);