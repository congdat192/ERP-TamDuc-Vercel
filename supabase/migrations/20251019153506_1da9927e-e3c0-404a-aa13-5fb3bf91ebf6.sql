-- ============================================
-- MIGRATION: Add features array to RPC response
-- Hybrid approach: Owner/Admin get ['full_access'], Custom roles get actual feature codes
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_profile_simple(_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _result JSON;
  _role_level INTEGER;
  _modules TEXT[];
  _features TEXT[];
BEGIN
  -- SAFETY CHECK #1: Get role level with NULL fallback
  SELECT COALESCE(r.level, 999) INTO _role_level
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = _user_id
  ORDER BY r.level ASC
  LIMIT 1;
  
  -- SAFETY CHECK #2: Handle users without role assignment
  IF _role_level IS NULL THEN
    _role_level := 999;
    _modules := ARRAY['dashboard'];
    _features := ARRAY[]::TEXT[];
    
    -- Early return with minimal profile
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
        'id', NULL,
        'name', 'No Role',
        'level', 999,
        'description', 'User without role assignment'
      ),
      'modules', _modules,
      'features', _features
    )
    INTO _result
    FROM public.profiles p
    WHERE p.id = _user_id
    LIMIT 1;
    
    RETURN _result;
  END IF;
  
  -- Owner/Admin (level <= 2): ALL modules + full_access bypass
  IF _role_level <= 2 THEN
    _modules := ARRAY[
      'dashboard',
      'customers',
      'sales',
      'inventory',
      'accounting',
      'hr',
      'voucher',
      'marketing',
      'affiliate',
      'system-settings',
      'user-management'
    ];
    _features := ARRAY['full_access'];  -- Bypass token for Owner/Admin
  ELSE
    -- Custom roles (level >= 3): Extract modules from DB
    SELECT COALESCE(array_agg(DISTINCT m.code), ARRAY[]::TEXT[])
    INTO _modules
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.features f ON f.id = rp.feature_id
    JOIN public.modules m ON m.id = f.module_id
    WHERE ur.user_id = _user_id
      AND m.is_active = true;
    
    -- Custom roles: Extract features from DB
    SELECT COALESCE(array_agg(DISTINCT f.code), ARRAY[]::TEXT[])
    INTO _features
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.features f ON f.id = rp.feature_id
    WHERE ur.user_id = _user_id;
    
    -- SAFETY CHECK #3: Always include dashboard for custom roles
    IF NOT ('dashboard' = ANY(_modules)) OR _modules = ARRAY[]::TEXT[] THEN
      _modules := array_prepend('dashboard', _modules);
    END IF;
  END IF;
  
  -- Build final JSON response
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
      'level', COALESCE(r.level, 999),
      'description', r.description
    ),
    'modules', _modules,
    'features', _features
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_profile_simple(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.get_user_profile_simple(UUID) IS 
'Ultra-simple auth RPC: Returns profile + role + modules + features in one call.
Hybrid approach: Owner/Admin get full_access bypass, Custom roles get actual feature codes from DB.
Safety: Handles NULL level, NULL role, and empty permissions.';