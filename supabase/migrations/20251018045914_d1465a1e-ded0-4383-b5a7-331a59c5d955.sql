-- =====================================================
-- PHASE 1: Create Security Definer Function
-- =====================================================

-- Function to check if user is Owner or Admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND LOWER(r.name) IN ('owner', 'admin')
  )
$$;

-- =====================================================
-- PHASE 2: Update RLS Policies for roles table
-- =====================================================

-- Drop old permissive policies
DROP POLICY IF EXISTS "Authenticated users can create roles" ON public.roles;
DROP POLICY IF EXISTS "Authenticated users can update roles" ON public.roles;
DROP POLICY IF EXISTS "Authenticated users can delete roles" ON public.roles;

-- Only admins can INSERT roles
CREATE POLICY "Only admins can create roles"
ON public.roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can UPDATE roles
CREATE POLICY "Only admins can update roles"
ON public.roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can DELETE roles (except system roles)
CREATE POLICY "Only admins can delete roles"
ON public.roles
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid()) 
  AND is_system = false
);

-- =====================================================
-- PHASE 3: Update RLS Policies for role_permissions
-- =====================================================

-- Drop old permissive policies
DROP POLICY IF EXISTS "Authenticated users can create role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Authenticated users can update role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Authenticated users can delete role permissions" ON public.role_permissions;

-- Only admins can manage role permissions
CREATE POLICY "Only admins can create role permissions"
ON public.role_permissions
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update role permissions"
ON public.role_permissions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete role permissions"
ON public.role_permissions
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- =====================================================
-- PHASE 4: Protect user_roles table
-- =====================================================

-- Only admins can assign roles to users
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can remove user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));