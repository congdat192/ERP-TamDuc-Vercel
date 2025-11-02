-- Create kiotviet_attributes table
CREATE TABLE IF NOT EXISTS public.kiotviet_attributes (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  attribute_values JSONB DEFAULT '[]'::jsonb,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_kiotviet_attributes_name ON public.kiotviet_attributes(name);

-- Enable RLS
ALTER TABLE public.kiotviet_attributes ENABLE ROW LEVEL SECURITY;

-- Create policy: Admin/Owner can do everything
CREATE POLICY "Admin can manage attributes"
  ON public.kiotviet_attributes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.level <= 2
    )
  );

-- Create policy: All authenticated users can view
CREATE POLICY "Users can view attributes"
  ON public.kiotviet_attributes
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Comment
COMMENT ON TABLE public.kiotviet_attributes IS 'Stores product attributes synced from KiotViet API (e.g., Màu sắc, Kích cỡ)';