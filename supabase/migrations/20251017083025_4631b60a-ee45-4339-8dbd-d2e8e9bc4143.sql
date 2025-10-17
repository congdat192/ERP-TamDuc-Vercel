-- Fix infinite recursion by ensuring all permission functions bypass RLS with SECURITY DEFINER

-- Update has_role function to ensure it bypasses RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update has_permission function to ensure it bypasses RLS
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _business_id uuid, _feature_code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM business_members bm
    JOIN roles r ON r.id = bm.role_id
    JOIN role_permissions rp ON rp.role_id = r.id
    JOIN features f ON f.id = rp.feature_id
    WHERE bm.user_id = _user_id
      AND bm.business_id = _business_id
      AND f.code = _feature_code
      AND bm.status = 'ACTIVE'
  )
$$;

-- Update get_user_permissions to ensure it bypasses RLS
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id uuid, _business_id uuid)
RETURNS TABLE(module_code text, feature_code text, feature_name text, feature_type text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    m.code as module_code,
    f.code as feature_code,
    f.name as feature_name,
    f.feature_type as feature_type
  FROM business_members bm
  JOIN roles r ON r.id = bm.role_id
  JOIN role_permissions rp ON rp.role_id = r.id
  JOIN features f ON f.id = rp.feature_id
  JOIN modules m ON m.id = f.module_id
  WHERE bm.user_id = _user_id
    AND bm.business_id = _business_id
    AND bm.status = 'ACTIVE'
    AND m.is_active = true
  ORDER BY m.display_order, f.feature_type
$$;

-- Update get_user_businesses to ensure it bypasses RLS
CREATE OR REPLACE FUNCTION public.get_user_businesses(_user_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  owner_id uuid,
  description text,
  logo_path text,
  is_owner boolean,
  user_role text,
  role_name text,
  member_status member_status
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.name,
    b.owner_id,
    b.description,
    b.logo_path,
    (b.owner_id = _user_id) as is_owner,
    CASE WHEN b.owner_id = _user_id THEN 'owner' ELSE 'member' END as user_role,
    r.name as role_name,
    bm.status as member_status
  FROM businesses b
  JOIN business_members bm ON bm.business_id = b.id
  LEFT JOIN roles r ON r.id = bm.role_id
  WHERE bm.user_id = _user_id
    AND bm.status = 'ACTIVE'
    AND b.is_active = true
  ORDER BY b.created_at DESC
$$;