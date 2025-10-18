-- PHẦN 1: Xóa các bảng multi-tenant
DROP TABLE IF EXISTS business_invitations CASCADE;
DROP TABLE IF EXISTS business_members CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;

-- PHẦN 2: Drop function và policies trước
DROP FUNCTION IF EXISTS has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS has_permission(uuid, uuid, text) CASCADE;
DROP FUNCTION IF EXISTS get_user_permissions(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS get_user_businesses(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_business_member(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS create_business_safe(text, text, text, text, text, text, text, text) CASCADE;

-- PHẦN 3: Tạo enum mới
CREATE TYPE app_role_new AS ENUM ('admin', 'user');

-- PHẦN 4: Migrate dữ liệu
ALTER TABLE user_roles 
  ALTER COLUMN role TYPE app_role_new 
  USING (
    CASE 
      WHEN role::text IN ('super_admin', 'business_owner') THEN 'admin'::app_role_new
      ELSE 'user'::app_role_new
    END
  );

-- PHẦN 5: Drop enum cũ và rename
DROP TYPE app_role CASCADE;
ALTER TYPE app_role_new RENAME TO app_role;

-- PHẦN 6: Update role cho congdat192@gmail.com
DELETE FROM user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'congdat192@gmail.com');

INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'congdat192@gmail.com'),
  'admin'::app_role
);

-- PHẦN 7: Recreate has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- PHẦN 8: Recreate RLS policies cho user_roles
DROP POLICY IF EXISTS "Super admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;

-- Policy mới: Admin có thể view tất cả roles
CREATE POLICY "Admins can view all roles" 
ON user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy mới: Admin có thể manage tất cả roles
CREATE POLICY "Admins can manage all roles" 
ON user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Users có thể view own roles
CREATE POLICY "Users can view own roles" 
ON user_roles 
FOR SELECT 
USING (auth.uid() = user_id);