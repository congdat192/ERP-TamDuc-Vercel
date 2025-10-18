-- Phase 1: Create default 'User' role (only if it doesn't exist)
INSERT INTO public.roles (name, description, is_system)
SELECT 'User', 'Người dùng thông thường - Quyền hạn cơ bản', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.roles WHERE LOWER(name) = 'user'
);

-- Phase 3: Improve handle_new_user trigger with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  default_role_id INTEGER;
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
  
  -- Find default 'User' role
  SELECT id INTO default_role_id 
  FROM public.roles 
  WHERE LOWER(name) = 'user' 
  LIMIT 1;
  
  -- Only insert user_roles if 'User' role exists
  IF default_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, default_role_id);
  ELSE
    RAISE WARNING 'Default role "User" not found. Skipping user_roles insert for user %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;