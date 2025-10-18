-- Update handle_new_user trigger to include email sync
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  default_role_id INTEGER;
BEGIN
  -- Insert profile with email
  INSERT INTO public.profiles (
    id, 
    full_name,
    email,
    phone,
    password_change_required
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
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