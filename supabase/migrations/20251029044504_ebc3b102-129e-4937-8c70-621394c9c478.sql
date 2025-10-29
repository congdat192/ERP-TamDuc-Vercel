-- PHASE 1: Fix Owner Permissions - Dynamic Module Loading
-- Owner/Admin (level <= 2) có TOÀN QUYỀN trên TẤT CẢ modules (bao gồm voucher)
-- Load DYNAMICALLY từ database thay vì hardcode

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
  -- Get role level
  SELECT COALESCE(r.level, 999) INTO _role_level
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = _user_id
  ORDER BY r.level ASC
  LIMIT 1;
  
  -- Owner/Admin (level <= 2): TOÀN QUYỀN - LOAD TẤT CẢ active modules từ DB
  IF _role_level <= 2 THEN
    -- ✅ DYNAMIC: Load ALL active modules from database (bao gồm voucher)
    SELECT COALESCE(array_agg(m.code ORDER BY m.display_order), ARRAY[]::TEXT[])
    INTO _modules
    FROM public.modules m
    WHERE m.is_active = true;
    
    -- ✅ Owner có 'full_access' feature (bypass tất cả permission checks)
    _features := ARRAY['full_access'];
    
  ELSE
    -- Custom roles: Extract permissions từ role_permissions
    SELECT COALESCE(array_agg(DISTINCT m.code), ARRAY[]::TEXT[])
    INTO _modules
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.features f ON f.id = rp.feature_id
    JOIN public.modules m ON m.id = f.module_id
    WHERE ur.user_id = _user_id
      AND m.is_active = true;
    
    SELECT COALESCE(array_agg(DISTINCT f.code), ARRAY[]::TEXT[])
    INTO _features
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.features f ON f.id = rp.feature_id
    WHERE ur.user_id = _user_id;
    
    -- Always include dashboard
    IF NOT ('dashboard' = ANY(_modules)) OR _modules = ARRAY[]::TEXT[] THEN
      _modules := array_prepend('dashboard', _modules);
    END IF;
  END IF;
  
  -- Build final JSON
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