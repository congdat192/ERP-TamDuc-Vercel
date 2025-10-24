-- Step 1: Create SECURITY DEFINER function to check lens media permissions
CREATE OR REPLACE FUNCTION can_manage_lens_media(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Owner/Admin (level <= 2) can manage all media
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND r.level <= 2
  )
  OR
  -- Users with manage_lens_products feature can manage
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = _user_id
      AND f.code = 'manage_lens_products'
  );
$$;

-- Step 2: Drop old complex RLS policies
DROP POLICY IF EXISTS "Admins can manage media library" ON lens_media_library;
DROP POLICY IF EXISTS "Users can view active media" ON lens_media_library;
DROP POLICY IF EXISTS "Users can upload media" ON lens_media_library;
DROP POLICY IF EXISTS "Users can update own uploads" ON lens_media_library;

-- Step 3: Create simple unified policy
CREATE POLICY "Manage lens media"
  ON lens_media_library
  FOR ALL
  USING (can_manage_lens_media(auth.uid()))
  WITH CHECK (can_manage_lens_media(auth.uid()));

-- Step 4: Fix update_media_usage function - add SECURITY DEFINER and SET search_path
CREATE OR REPLACE FUNCTION update_media_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- When a product is updated, update usage tracking in media library
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update usage_count for images in new product
    UPDATE lens_media_library
    SET 
      used_in_products = CASE
        WHEN NEW.id::text = ANY(COALESCE(used_in_products, '{}'))
        THEN used_in_products
        ELSE array_append(COALESCE(used_in_products, '{}'), NEW.id::text)
      END,
      usage_count = CASE
        WHEN NEW.id::text = ANY(COALESCE(used_in_products, '{}'))
        THEN usage_count
        ELSE usage_count + 1
      END
    WHERE EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(NEW.image_urls) AS url
      WHERE url LIKE '%' || file_path || '%'
    );
  END IF;
  
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    -- Remove product ID from usage tracking when product is deleted or images changed
    UPDATE lens_media_library
    SET 
      used_in_products = array_remove(used_in_products, OLD.id::text),
      usage_count = GREATEST(usage_count - 1, 0)
    WHERE EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(OLD.image_urls) AS url
      WHERE url LIKE '%' || file_path || '%'
    )
    AND (TG_OP = 'DELETE' OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(NEW.image_urls) AS url
      WHERE url LIKE '%' || file_path || '%'
    ));
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Step 5: Fix get_unused_media function - add SET search_path
CREATE OR REPLACE FUNCTION get_unused_media(older_than_days INTEGER DEFAULT 30)
RETURNS TABLE(
  id UUID,
  file_name TEXT,
  file_path TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.file_name,
    m.file_path,
    m.file_size,
    m.created_at
  FROM lens_media_library m
  WHERE 
    m.usage_count = 0
    AND m.created_at < now() - (older_than_days || ' days')::INTERVAL
    AND m.is_active = true
  ORDER BY m.created_at ASC;
END;
$$;