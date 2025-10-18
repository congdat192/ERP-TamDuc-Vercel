-- =====================================================
-- PHASE 1: Restructure user_roles table to use role_id
-- =====================================================

-- Step 1: Drop old ENUM column
ALTER TABLE public.user_roles DROP COLUMN IF EXISTS role;

-- Step 2: Add role_id column (FK to roles table)
ALTER TABLE public.user_roles 
ADD COLUMN role_id INTEGER REFERENCES public.roles(id) ON DELETE CASCADE;

-- Step 3: Ensure default roles exist (without ON CONFLICT)
DO $$
BEGIN
  -- Insert Admin role if not exists
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'Admin') THEN
    INSERT INTO public.roles (name, description, is_system)
    VALUES ('Admin', 'Quản trị viên hệ thống', true);
  END IF;
  
  -- Insert User role if not exists
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'User') THEN
    INSERT INTO public.roles (name, description, is_system)
    VALUES ('User', 'Người dùng thông thường', true);
  END IF;
END $$;

-- Step 4: Migrate existing data - assign all current users to Admin role
UPDATE public.user_roles 
SET role_id = (SELECT id FROM public.roles WHERE name = 'Admin' LIMIT 1)
WHERE role_id IS NULL;

-- Step 5: Make role_id NOT NULL after data migration
ALTER TABLE public.user_roles ALTER COLUMN role_id SET NOT NULL;

-- Step 6: Add unique constraint
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Step 7: Update has_role function to work with role_id and role name
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role_name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND LOWER(r.name) = LOWER(_role_name)
  )
$$;

-- Step 8: Update trigger to use role_id (assign default User role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    full_name, 
    phone,
    password_change_required
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'password_change_required')::boolean, true)
  );
  
  -- Assign default 'User' role using role_id
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (
    NEW.id, 
    (SELECT id FROM public.roles WHERE name = 'User' LIMIT 1)
  );
  
  RETURN NEW;
END;
$$;