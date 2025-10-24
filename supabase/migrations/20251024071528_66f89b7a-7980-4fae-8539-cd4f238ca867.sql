-- ============================================
-- PHASE 1: LENS MEDIA LIBRARY DATABASE
-- ============================================

-- Create lens_media_library table
CREATE TABLE IF NOT EXISTS lens_media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- File info
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Categorization
  folder TEXT NOT NULL DEFAULT 'uncategorized',
  tags TEXT[] DEFAULT '{}',
  
  -- Metadata
  alt_text TEXT,
  caption TEXT,
  
  -- Usage tracking
  used_in_products TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Audit
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lens_media_folder ON lens_media_library(folder);
CREATE INDEX IF NOT EXISTS idx_lens_media_tags ON lens_media_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_lens_media_used_in ON lens_media_library USING GIN(used_in_products);
CREATE INDEX IF NOT EXISTS idx_lens_media_active ON lens_media_library(is_active);
CREATE INDEX IF NOT EXISTS idx_lens_media_uploaded_by ON lens_media_library(uploaded_by);

-- Enable RLS
ALTER TABLE lens_media_library ENABLE ROW LEVEL SECURITY;

-- Admins have full access
CREATE POLICY "Admins can manage media library"
  ON lens_media_library FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.level <= 2
    )
  );

-- Users with manage_lens_products can view and upload
CREATE POLICY "Users can view active media"
  ON lens_media_library FOR SELECT
  USING (
    is_active = true AND (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid() AND r.level <= 2
      ) OR
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN role_permissions rp ON rp.role_id = ur.role_id
        JOIN features f ON f.id = rp.feature_id
        WHERE ur.user_id = auth.uid() 
        AND f.code = 'manage_lens_products'
      )
    )
  );

CREATE POLICY "Users can upload media"
  ON lens_media_library FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.level <= 2
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN features f ON f.id = rp.feature_id
      WHERE ur.user_id = auth.uid() 
      AND f.code = 'manage_lens_products'
    )
  );

CREATE POLICY "Users can update own uploads"
  ON lens_media_library FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.level <= 2
    )
  );

-- Function to track image usage
CREATE OR REPLACE FUNCTION update_media_usage()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update usage when products change
DROP TRIGGER IF EXISTS track_product_image_usage ON lens_products;
CREATE TRIGGER track_product_image_usage
  AFTER INSERT OR UPDATE OR DELETE ON lens_products
  FOR EACH ROW
  EXECUTE FUNCTION update_media_usage();

-- Function to get unused media
CREATE OR REPLACE FUNCTION get_unused_media(
  older_than_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  file_name TEXT,
  file_path TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;