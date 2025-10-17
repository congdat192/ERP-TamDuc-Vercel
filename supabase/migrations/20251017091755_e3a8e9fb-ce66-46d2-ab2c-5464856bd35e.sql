-- Drop old function and create enhanced version that handles complete business creation flow
DROP FUNCTION IF EXISTS public.create_business_safe(text, text, text, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.create_business_safe(
  _name text,
  _description text DEFAULT NULL,
  _logo_path text DEFAULT NULL,
  _address text DEFAULT NULL,
  _phone_number text DEFAULT NULL,
  _email_address text DEFAULT NULL,
  _website_url text DEFAULT NULL,
  _tax_number text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  owner_id uuid,
  logo_path text,
  address text,
  phone_number text,
  email_address text,
  website_url text,
  tax_number text,
  created_at timestamptz,
  updated_at timestamptz,
  is_owner boolean,
  user_role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _business_id uuid;
  _user_id uuid;
  _role_id integer;
BEGIN
  -- Get authenticated user
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  RAISE NOTICE 'Creating business % for user %', _name, _user_id;
  
  -- 1. Create business
  INSERT INTO public.businesses (
    name, description, owner_id, logo_path, address,
    phone_number, email_address, website_url, tax_number
  )
  VALUES (
    _name, _description, _user_id, _logo_path, _address,
    _phone_number, _email_address, _website_url, _tax_number
  )
  RETURNING businesses.id INTO _business_id;
  
  RAISE NOTICE 'Business created with ID %', _business_id;
  
  -- 2. Create default "ERP Admin" role
  INSERT INTO public.roles (business_id, name, description, is_system)
  VALUES (_business_id, 'ERP Admin', 'Quản trị viên với đầy đủ quyền hạn', true)
  RETURNING roles.id INTO _role_id;
  
  RAISE NOTICE 'Role created with ID %', _role_id;
  
  -- 3. Assign ALL permissions to ERP Admin role
  INSERT INTO public.role_permissions (role_id, feature_id)
  SELECT _role_id, f.id FROM public.features f;
  
  RAISE NOTICE 'Permissions assigned to role';
  
  -- 4. Add owner as member with ERP Admin role
  INSERT INTO public.business_members (business_id, user_id, role_id, status)
  VALUES (_business_id, _user_id, _role_id, 'ACTIVE');
  
  RAISE NOTICE 'Owner added as member';
  
  -- 5. Assign platform role business_owner if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'business_owner')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Platform role assigned';
  
  -- 6. Return complete business data
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.description,
    b.owner_id,
    b.logo_path,
    b.address,
    b.phone_number,
    b.email_address,
    b.website_url,
    b.tax_number,
    b.created_at,
    b.updated_at,
    true as is_owner,
    'owner'::text as user_role
  FROM public.businesses b
  WHERE b.id = _business_id;
  
  RAISE NOTICE 'Business creation completed successfully';
END;
$$;