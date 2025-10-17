-- Create security definer function to create business safely
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
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _business_id uuid;
  _user_id uuid;
BEGIN
  -- Get current user ID
  _user_id := auth.uid();
  
  -- Check if user is authenticated
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Insert business
  INSERT INTO public.businesses (
    name,
    description,
    owner_id,
    logo_path,
    address,
    phone_number,
    email_address,
    website_url,
    tax_number
  )
  VALUES (
    _name,
    _description,
    _user_id,
    _logo_path,
    _address,
    _phone_number,
    _email_address,
    _website_url,
    _tax_number
  )
  RETURNING id INTO _business_id;
  
  RETURN _business_id;
END;
$$;