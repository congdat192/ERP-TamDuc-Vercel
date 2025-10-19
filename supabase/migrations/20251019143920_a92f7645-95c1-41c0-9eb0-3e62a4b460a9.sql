-- ============================================
-- MIGRATION: Add role.level + RPC functions
-- Mục đích: Đơn giản hóa auth flow với role level
-- ============================================

-- 1. Add level column to roles table (safe: keeps existing data)
ALTER TABLE public.roles 
ADD COLUMN IF NOT EXISTS level INTEGER;

-- 2. Update existing roles with standard levels
UPDATE public.roles SET level = 1 WHERE LOWER(name) = 'owner';
UPDATE public.roles SET level = 2 WHERE LOWER(name) = 'admin';
UPDATE public.roles SET level = 3 WHERE LOWER(name) = 'hr manager';
UPDATE public.roles SET level = 4 WHERE LOWER(name) = 'accountant';
UPDATE public.roles SET level = 5 WHERE LOWER(name) = 'user';

-- 3. Create function to get user role level (for RLS checks)
CREATE OR REPLACE FUNCTION public.get_user_role_level(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.level
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = _user_id
  ORDER BY r.level ASC
  LIMIT 1;
$$;

-- 4. Create RPC to get user profile + role in one call (for frontend)
CREATE OR REPLACE FUNCTION public.get_user_profile_simple(_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _result JSON;
BEGIN
  SELECT json_build_object(
    'profile', json_build_object(
      'id', p.id,
      'full_name', p.full_name,
      'email', p.email,
      'phone', p.phone,
      'avatar_path', p.avatar_path,
      'status', p.status
    ),
    'role', json_build_object(
      'id', r.id,
      'name', r.name,
      'level', r.level,
      'description', r.description
    )
  )
  INTO _result
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON ur.user_id = p.id
  LEFT JOIN public.roles r ON r.id = ur.role_id
  WHERE p.id = _user_id
  ORDER BY r.level ASC
  LIMIT 1;
  
  RETURN _result;
END;
$$;

-- 5. Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_role_level(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile_simple(UUID) TO authenticated;